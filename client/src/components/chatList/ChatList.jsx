// ChatList.jsx
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const ChatList = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        // credentials: "include",
      }).then((res) => res.json()),
  });

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden p-5 sm:px-5">

      <span className="font-semibold text-[10px] mb-2.5">DASHBOARD</span>

      <Link className="p-2 sm:p-2.5 rounded-[10px] hover:bg-[#2c2937] transition-colors">
        Create a new Chat
      </Link>

      <Link className="p-2 sm:p-2.5 rounded-[10px] hover:bg-[#2c2937] transition-colors">
        Explore Learn AI
      </Link>

      <Link className="p-2 sm:p-2.5 rounded-[10px] hover:bg-[#2c2937] transition-colors">
        Contact
      </Link>

      <hr className="border-none h-[2px] bg-[#ddd] opacity-10 rounded-[5px] my-4 sm:my-5" />

      <span className="font-semibold text-[10px] mb-2.5">RECENT CHATS</span>

      <div className="flex-1 overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-[#2c2937] scrollbar-track-transparent">
        {isPending
          ? "Loading..."
          : error
            ? "Something went wrong!"
            : data?.map((chat) => (
              <Link
                to={`/dashboard/chats/${chat._id}`}
                key={chat._id}
                className="block p-2.5 rounded-xl hover:bg-[#2c2937] transition-colors truncate"
              >
                {chat.title}
              </Link>
            ))}
      </div>

      <hr className="border-none h-[2px] bg-[#ddd] opacity-10 rounded-[5px] my-4 sm:my-5" />

      <div className="mt-auto pt-4 sm:pt-6 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs">
        <img src="/logo.png" alt="" className="w-5 h-5 sm:w-6 sm:h-6" />

        <div className="flex flex-col">
          <span className="font-semibold">Upgrade to Learn AI Pro</span>
          <span className="text-[#888]">
            Get unlimited access to all features
          </span>
        </div>
      </div>

    </div>
  );
};

export default ChatList;