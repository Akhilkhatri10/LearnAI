// DashboardPage.jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (text) => {
      const token = await getToken();

      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },

    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    mutation.mutate(text);
  };

  return (
    <div className="h-full flex flex-col px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">

      <div className="flex-1 flex flex-col items-center justify-center gap-8 sm:gap-12 max-w-5xl mx-auto w-full">

        {/* Logo */}
        <div className="flex items-center gap-3 sm:gap-5 opacity-30">
          <img src="/logo.png" alt="" className="w-10 h-10 sm:w-14 sm:h-14" />

          <h1 className="text-3xl sm:text-5xl md:text-6xl xl:text-6xl font-bold bg-gradient-to-r from-[#217bfe] to-[#e55571] bg-clip-text text-transparent">
            LEARN AI
          </h1>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-2xl lg:max-w-none">

          <div className="p-4 sm:p-6 border border-[#444] rounded-2xl hover:bg-[#1b1827] hover:-translate-y-1 transition duration-300">
            <img src="/chat.png" className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" />
            <p>Create a New Chat</p>
          </div>

          <div className="p-4 sm:p-6 border border-[#444] rounded-2xl hover:bg-[#1b1827] hover:-translate-y-1 transition duration-300">
            <img src="/image.png" className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" />
            <p>Analyze Images</p>
          </div>

          <div className="p-4 sm:p-6 border border-[#444] rounded-2xl hover:bg-[#1b1827] hover:-translate-y-1 transition duration-300">
            <img src="/code.png" className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" />
            <p>Help me with my Code</p>
          </div>

        </div>
      </div>

      {/* Input */}
      <div className="max-w-3xl mt-10 sm:mt-20 lg:mt-36 mx-auto w-full">
        <form
          onSubmit={handleSubmit}
          className="bg-[#2c2937] rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-2 sm:py-3 shadow-lg border border-[#3b3845]"
        >
          <input
            type="text"
            name="text"
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent outline-none text-white text-sm sm:text-base"
          />

          <button className="bg-[#605e68] rounded-full p-2 sm:p-3 cursor-pointer hover:bg-[#7d7987]">
            <img src="/arrow.png" className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </form>
      </div>

    </div>
  );

};

export default DashboardPage;