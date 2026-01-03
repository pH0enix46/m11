"use client";

import React from "react";
import { motion } from "motion/react";

const testimonials = [
  {
    id: 1,
    rating: 5,
    title: "White breathable",
    author: "Paul H.",
    content: "Excellent quality, very comfortable. All in all great!",
  },
  {
    id: 2,
    rating: 4.5,
    title: "Perfect design",
    author: "Magdalena J.",
    content: "Size match properly. Very good look!",
  },
  {
    id: 3,
    rating: 4,
    title: "Amazing",
    author: "Henri K.",
    content: "Love the look and the quality.",
  },
  {
    id: 4,
    rating: 5,
    title: "Good quality!",
    author: "Robbe Z.",
    content: "Elegant and comfortable shoes.",
  },
];

const Star = ({ fill }: { fill: number }) => {
  // fill is 0 to 1
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300 hover:scale-110"
    >
      <defs>
        <linearGradient id={`grad-${fill}`}>
          <stop offset={`${fill * 100}%`} stopColor="#dc2626" />
          <stop offset={`${fill * 100}%`} stopColor="#e5e7eb" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={
          fill === 1 ? "#dc2626" : fill === 0 ? "#e5e7eb" : `url(#grad-${fill})`
        }
        stroke={fill > 0 ? "#dc2626" : "#e5e7eb"}
        strokeWidth="1"
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="flex flex-col items-center p-8 bg-white border border-black/5 rounded-2xl shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 group cursor-default"
    >
      {/* Stars - Totally Filled */}
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => {
          const fillAmount = Math.max(0, Math.min(1, testimonial.rating - i));
          return <Star key={i} fill={fillAmount} />;
        })}
      </div>

      {/* Content */}
      <div className="text-center space-y-3">
        <h3 className="text-lg font-bold text-black tracking-tight">
          {testimonial.title}
        </h3>
        <p className="text-sm font-semibold text-black/40">
          {testimonial.author}
        </p>
        <p className="text-sm text-black/60 leading-relaxed max-w-[220px]">
          &ldquo;{testimonial.content}&rdquo;
        </p>
      </div>
    </motion.div>
  );
};

const PeoplesWord = () => {
  return (
    <section className="py-24 px-4 md:px-8 border-t border-black/10">
      <div className="mx-auto max-w-8xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-black"
          >
            The Community Speaks
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-1 w-24 bg-red-600 mx-auto rounded-full"
          />
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
