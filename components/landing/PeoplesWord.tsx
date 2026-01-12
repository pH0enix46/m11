"use client";

import React from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { QuoteUpIcon } from "@hugeicons/core-free-icons";

const testimonials = [
  {
    id: 1,
    rating: 5,
    title: "White Breathable",
    author: "Paul H.",
    content:
      "Excellent quality, very comfortable. All in all, a truly great experience!",
  },
  {
    id: 2,
    rating: 4.5,
    title: "Perfect Design",
    author: "Magdalena J.",
    content: "Size matches properly. Very good look! Fits my style perfectly.",
  },
  {
    id: 3,
    rating: 4,
    title: "Simply Amazing",
    author: "Henri K.",
    content:
      "Love the look and the quality. Will definitely be buying another pair.",
  },
  {
    id: 4,
    rating: 5,
    title: "Top Quality",
    author: "Robbe Z.",
    content:
      "Elegant and comfortable shoes. They feel as premium as they look.",
  },
];

const Star = ({ fill }: { fill: number }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300 hover:scale-110"
    >
      <defs>
        <linearGradient id={`grad-${fill}`}>
          <stop offset={`${fill * 100}%`} stopColor="#ef4444" />
          <stop offset={`${fill * 100}%`} stopColor="#e5e7eb" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={
          fill === 1 ? "#ef4444" : fill === 0 ? "#e5e7eb" : `url(#grad-${fill})`
        }
        stroke={fill > 0 ? "#ef4444" : "#e5e7eb"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="relative flex flex-col p-8 bg-white border border-neutral-100 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group cursor-default overflow-hidden"
    >
      {/* Decorative Background Icon */}
      <div className="absolute top-4 right-4 opacity-[0.03] transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
        <HugeiconsIcon icon={QuoteUpIcon} size={80} />
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-6 relative z-10">
        {[...Array(5)].map((_, i) => {
          const fillAmount = Math.max(0, Math.min(1, testimonial.rating - i));
          return <Star key={i} fill={fillAmount} />;
        })}
      </div>

      {/* Content */}
      <div className="space-y-4 relative z-10 flex-1">
        <h3 className="text-xl font-bold text-neutral-900 tracking-tight group-hover:text-red-600 transition-colors">
          {testimonial.title}
        </h3>
        <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
          &ldquo;{testimonial.content}&rdquo;
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-neutral-100 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 font-bold text-sm">
            {testimonial.author.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-neutral-900">
              {testimonial.author}
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              Verified Buyer
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PeoplesWord = () => {
  return (
    <section className="py-24 md:py-32 px-4 md:px-8 bg-neutral-50/50">
      <div className="mx-auto max-w-8xl">
        {/* Header */}
        <div className="text-center mb-20 space-y-6 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <span className="px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-neutral-900">
              The Community Speaks
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-500 text-lg md:text-xl font-medium leading-relaxed"
          >
            Don&apos;t just take our word for it. Here&apos;s what our community
            has to say about their experience.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PeoplesWord;
