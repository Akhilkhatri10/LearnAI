// Homepage.jsx
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

const Homepage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");

  return (
    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-[100px] h-full relative px-4 sm:px-6">
      <img
        src="/orbital.png"
        alt=""
        className="absolute bottom-0 left-0 opacity-[0.05] -z-10 animate-[spin_100s_linear_infinite]"
      />

      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-[48px] sm:text-[64px] md:text-[80px] xl:text-[120px] font-bold bg-gradient-to-r from-[#217bfe] to-[#e55571] bg-clip-text text-transparent">
          LEARN AI
        </h1>

        <h2 className="text-2xl font-semibold">
          Supercharge your creativity and productivity
        </h2>

        <h3 className="font-normal max-w-full lg:max-w-[70%]">
          Powering the Next Generation of Intelligent Text. Where Language Meets Logic.
        </h3>

        <Link
          to="/dashboard"
          className="mt-5 px-5 sm:px-[25px] py-3 sm:py-[15px] bg-[#217bfe] text-white rounded-[20px] text-base sm:text-lg font-semibold hover:bg-white hover:text-[#217bfe] transition-colors duration-300"
        >
          Get Started
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center h-[300px] sm:h-[400px] lg:h-full">
        <div className="flex items-center justify-center bg-[#140e2d] rounded-[50px] w-[80%] h-[50%] relative overflow-visible">
          <div className="w-full h-full absolute top-0 left-0 rounded-[50px] overflow-hidden">
            <div
              className="w-[200%] h-full opacity-20 bg-repeat-x bg-[length:auto_100%] animate-[slideBg_8s_ease-in-out_infinite_alternate]"
              style={{ backgroundImage: 'url("/bg.png")' }}
            ></div>
          </div>

          <img
            src="/bot.png"
            alt=""
            className="w-full h-full object-contain animate-[botAnimate_3s_ease-in-out_infinite_alternate]"
          />

          <div className="absolute bottom-[-30px] right-[-50px] max-[1280px]:right-0 max-[1024px]:hidden flex items-center gap-2.5 p-5 bg-[#2c2937] rounded-[10px]">
            <img
              src={
                typingStatus === "human1"
                  ? "/human1.jpeg"
                  : typingStatus === "human2"
                    ? "/human2.jpeg"
                    : "/bot.png"
              }
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />

            <TypeAnimation
              sequence={[
                "Human:We produce food for Mice",
                2000,
                () => setTypingStatus("bot"),
                "Bot:We produce food for Hamsters",
                2000,
                () => setTypingStatus("human2"),
                "Human2:We produce food for Guinea Pigs",
                2000,
                () => setTypingStatus("bot"),
                "Bot:We produce food for Chinchillas",
                2000,
                () => setTypingStatus("human1"),
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 sm:gap-5">
        <img
          src="/logo.png"
          alt=""
          className="w-4 h-4"
        />

        <div className="flex gap-2.5 text-[#888] text-[10px]">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;