"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

const images = [
  "/Hero/m-landing-1.jpeg",
  "/Hero/m-landing-2.jpeg",
  "/Hero/m-landing-3.jpeg",
];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1.05,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.1,
    }),
  };

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-black">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.6 },
            scale: { duration: 0.8 },
          }}
          className="absolute inset-0 overflow-hidden"
        >
          <motion.div
            animate={{
              x: ["2%", "-2%"],
              scale: [1, 1.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src={images[index]}
              alt={`Hero Background ${index + 1}`}
              fill
              priority
              className="object-cover"
              sizes="50vw"
            />
          </motion.div>
          {/* Subtle gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/40"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
        >
          End of Season Sale
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="mt-6 text-lg font-medium text-white/90 md:text-xl max-w-2xl"
        >
          Discover our latest collection with premium quality and unparalleled
          style. Limited time offer up to 50% off.
        </motion.p>

        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 bg-red-600 hover:bg-red-500 transition-all duration-300 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] rounded-full cursor-pointer"
        >
          Shop Now
        </motion.button>
      </div>

      {/* Progress indicators */}
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-3 z-30">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`group relative h-1.5 overflow-hidden rounded-full transition-all duration-500 ${
              i === index
                ? "w-12 bg-red-600"
                : "w-3 bg-white/30 hover:bg-white/50"
            }`}
          >
            {i === index && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
                className="absolute inset-0 bg-white/40"
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
