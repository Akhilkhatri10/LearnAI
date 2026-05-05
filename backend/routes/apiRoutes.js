// routes/apiRoutes.js
import { Router } from "express";
import { getAuth } from "@clerk/express";
import Chat from "../models/chat.js";
import UserChats from "../models/userChats.js";
import imagekit from "../utils/imagekit.js";
import { requireAuth } from "@clerk/express";

const router = Router();

router.get("/upload", (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});

router.post("/chats", requireAuth(), async (req, res) => {
    const { userId } = req.auth; 
    const { text } = req.body;

    try {
        const newChat = new Chat({
            userId,
            history: [{ role: "user", parts: [{ text }] }],
        });

        const savedChat = await newChat.save();

        const userChats = await UserChats.findOne({ userId });

        if (!userChats) {
            const newUserChats = new UserChats({
                userId,
                chats: [
                    {
                        _id: savedChat._id,
                        title: text.substring(0, 40),
                        createdAt: new Date(),
                    },
                ],
            });

            await newUserChats.save();
            
        } else {
            await UserChats.updateOne(
                { userId },
                {
                    $push: {
                        chats: {
                            _id: savedChat._id,
                            title: text.substring(0, 40),
                            createdAt: new Date(),
                        },
                    },
                }
            );
        }

        res.status(201).send(savedChat._id);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating chat!");
    }
});

router.get("/userchats", requireAuth(), async (req, res) => {
    const { userId } = req.auth;

    try {
        const userChats = await UserChats.findOne({ userId });

        if (!userChats) {
            return res.status(200).send([]);
        }

        const sortedChats = [...userChats.chats].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        res.status(200).send(sortedChats);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching userchats!");
    }
});

router.get("/chats/:id", requireAuth(), async (req, res) => {
    const { userId } = req.auth;

    try {
        const chat = await Chat.findOne({ _id: req.params.id, userId });
        res.status(200).send(chat);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching chat!");
    }
});

router.put("/chats/:id", requireAuth(), async (req, res) => {
    const { userId } = req.auth;
    const { question, answer, img } = req.body;

    const newItems = [
        ...(question
            ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
            : []),
        { role: "model", parts: [{ text: answer }] },
    ];

    try {
        const updatedChat = await Chat.updateOne(
            { _id: req.params.id, userId },
            {
                $push: {
                    history: { $each: newItems },
                },
            }
        );

        await UserChats.updateOne(
            { userId, "chats._id": req.params.id },
            {
                $set: {
                    "chats.$.createdAt": new Date(),
                },
            }
        );

        res.status(200).send(updatedChat);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding conversation!");
    }
});

router.post("/ask", async (req, res) => {
    try {
        const { message, history = [], imageUrl } = req.body;

        const messages = [
            ...history,
            {
                role: "user",
                content: imageUrl
                    ? [
                        { type: "text", text: message },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageUrl,
                            },
                        },
                    ]
                    : message,
            },
        ];

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "openai/gpt-4o-mini",
                    messages, // USE THIS
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({ error: data });
        }

        const answer = data.choices[0].message.content;

        res.status(200).json({ answer });
    } catch (err) {
        console.log("SERVER ERROR:", err);
        res.status(500).json({ error: "AI request failed" });
    }
});

export default router;