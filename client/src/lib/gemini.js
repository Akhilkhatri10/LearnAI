// src/lib/gemini.js

const model = {
  startChat({ history = [] }) {
    return {
      async sendMessageStream(messages, imageUrl) {
        const userText = Array.isArray(messages)
          ? messages.join(" ")
          : messages;

        const formattedHistory = history.map((msg) => {
          const role = msg.role === "model" ? "assistant" : msg.role;
          const text = msg.parts?.[0]?.text || "";

          // if message has image
          if (msg.img) {
            return {
              role,
              content: [
                { type: "text", text },
                {
                  type: "image_url",
                  image_url: {
                    url: `${process.env.IMAGE_KIT_ENDPOINT}/${msg.img}`,
                  },
                },
              ],
            };
          }

          // normal text message
          return {
            role,
            content: text,
          };
        });

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/ask`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: userText,
              history: formattedHistory,
              imageUrl, // <-- pass the image URL
            }),
          }
        );

        const data = await response.json();

        return {
          stream: {
            async *[Symbol.asyncIterator]() {
              yield {
                text: () => data.answer || "Model unavailable right now.",
              };
            },
          },
        };
      },
    };
  },
};

export default model;