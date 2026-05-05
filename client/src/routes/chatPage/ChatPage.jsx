// ChatPage.jsx
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import { useEffect, useRef } from "react";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        // credentials: "include",
      }).then((res) => res.json()),
  });

  console.log(data);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  return (
    <div className="h-full min-h-0 relative flex flex-col overflow-hidden">

      <div className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-40 sm:pb-52 lg:pb-60 scrollbar-thin scrollbar-thumb-[#2c2937] scrollbar-track-transparent">

        <div className="max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 pb-32 sm:pb-40">

          {data?.history?.map((message, i) => (
            <div key={i} className="flex flex-col gap-2 sm:gap-3">

              {message.img && (
                <IKImage
                  urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                  path={message.img}
                  width="400"
                  className="max-w-full h-auto rounded-lg"
                />
              )}

              <div
                className={
                  message.role === "user"
                    ? "self-end bg-[#2c2937] px-3 sm:px-5 py-2 sm:py-4 rounded-2xl max-w-[90%] sm:max-w-[75%]"
                    : "self-start px-2 py-2 max-w-full"
                }
              >
                <Markdown>{message.parts[0].text}</Markdown>
              </div>
            </div>
          ))}

          {data && <NewPrompt data={data} />}
          <div ref={bottomRef} />


        </div>

      </div>

    </div>
  );
};

export default ChatPage;