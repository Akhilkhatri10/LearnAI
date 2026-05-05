// NewPrompt.jsx
import { useEffect, useRef, useState } from "react";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const [isTyping, setIsTyping] = useState(false);

  const chat = model.startChat({
    history:
      data?.history?.map(({ role, parts }) => ({
        role,
        parts: [{ text: parts[0].text }],
      })) || [],
    generationConfig: {},
  });

  const endRef = useRef(null);
  const formRef = useRef(null);
  const hasRun = useRef(false);

  // useEffect(() => {
  //   endRef.current.scrollIntoView({ behavior: "smooth" });
  // }, [data, question, answer, img.dbData]);

  useEffect(() => {
  if (answer || isTyping) {
    endRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }
}, [answer, isTyping]);

  useEffect(() => {
    if (!hasRun.current && data?.history?.length === 1) {
      add(data.history[0].parts[0].text, true);
      hasRun.current = true;
    }
  }, [data]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ finalAnswer }) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        // credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer: finalAnswer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },

    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();

          setQuestion("");
          setAnswer("");

          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },

    onError: (err) => {
      console.log(err);
    },
  });

  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);

    setLoading(true);
    setIsTyping(true);

    try {

      const imageUrl = img.dbData?.filePath
        ? `${import.meta.env.VITE_IMAGE_KIT_ENDPOINT}/${img.dbData.filePath}`
        : null;

      const result = await chat.sendMessageStream(text, imageUrl);

      let accumulatedText = "";

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();

        for (let i = 0; i < chunkText.length; i++) {
          accumulatedText += chunkText[i];
          setAnswer(accumulatedText);

          await sleep(10); // control speed here
        }
      }

      mutation.mutate({ finalAnswer: accumulatedText });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value.trim();
    if (!text) return;

    e.target.reset(); //clear immediately

    add(text, false);
  };



  return (
    <>
      {img.isLoading && <div>Loading...</div>}

      {img.dbData?.filePath?.trim() ? (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData.filePath}
          width="380"
          transformation={[{ width: 380 }]}
          className="max-w-full h-auto rounded-lg"
        />
      ) : null}

      {question && (
        <div className="p-3 sm:p-4 md:p-5 bg-[#2c2937] rounded-[20px] max-w-[90%] sm:max-w-[80%] self-end text-sm sm:text-base">
          {question}
        </div>
      )}

      {answer && (
        <div className="p-3 sm:p-4 md:p-5 text-sm sm:text-base">
          <Markdown>{answer}</Markdown>
        </div>
      )}

      {isTyping && (
        <div className="flex items-center gap-1 px-4 py-2">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.15s" }}
          ></span>
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></span>
        </div>
      )}

      {/* <div className="pb-[80px] sm:pb-[100px]" ref={endRef}></div> */}

      {/* INPUT BAR */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl bg-[#2c2937] rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-2 sm:py-0 shadow-xl border border-[#3b3845] z-50"
      >

        <Upload setImg={setImg} />

        <input
          id="file"
          type="file"
          multiple={false}
          hidden
        />

        <input
          type="text"
          name="text"
          placeholder="Ask anything..."
          className="flex-1 p-2 sm:p-5 border-none outline-none bg-transparent text-[#ececec] text-sm sm:text-base"
        />

        <button
          disabled={loading}
          className="rounded-full bg-[#605e68] border-none p-2 sm:p-2.5 flex items-center justify-center cursor-pointer hover:bg-[#7d7987]"
        >
          <img
            src="/arrow.png"
            alt=""
            className="w-3 h-3 sm:w-4 sm:h-4"
          />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;