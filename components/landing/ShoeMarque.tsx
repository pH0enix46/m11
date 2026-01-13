"use client";

import React from "react";
import { motion } from "framer-motion";

const shoeNames = [
  "Ryder",
  "Miro",
  "Avion",
  "Shark",
  "Magpie",
  "Yoroi",
  "Icon",
];

const ShoeMarquee = () => {
  // Double the array to ensure seamless looping
  const duplicatedNames = [...shoeNames, ...shoeNames];

  return (
    <section className="bg-black py-20 overflow-hidden flex flex-col gap-8 mt-36">
      {/* Optional: Section Header */}
      {/* <div className="container mx-auto px-6 mb-4">
        <h2 className="text-[#E2FF3B] text-xs font-bold uppercase tracking-[0.3em]">
          The Lineup
        </h2>
      </div> */}

      <div className="relative flex overflow-hidden group">
        {/* Gradient Overlays for "Fade" effect */}
        <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedNames.map((name, idx) => (
            <div key={idx} className="flex items-center">
              {/* The Name */}
              <span
                className={`
                  text-6xl md:text-9xl font-black uppercase tracking-tighter px-8
                  transition-colors duration-300
                  ${
                    idx % 2 === 0
                      ? "text-white group-hover:text-[#E2FF3B]"
                      : "text-transparent stroke-text"
                  }
                `}
                style={{
                  WebkitTextStroke:
                    idx % 2 !== 0 ? "1px rgba(255,255,255,0.3)" : "none",
                }}
              >
                {name}
              </span>

              {/* Decorative Dot/Separator */}
              <span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-600 mx-4" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Secondary Marquee moving in opposite direction (Optional for more style) */}
      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: ["-50%", "0%"],
          }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedNames.map((name, idx) => (
            <span
              key={idx}
              className="text-4xl md:text-6xl font-light italic uppercase tracking-widest px-12 text-gray-800"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Global CSS for the outlined text effect */}
      <style jsx global>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
};

export default ShoeMarquee;
