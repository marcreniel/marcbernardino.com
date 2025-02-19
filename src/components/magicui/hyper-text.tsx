"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface HyperTextProps {
  text: string;
  duration?: number;
  framerProps?: Variants;
  className?: string;
  animateOnLoad?: boolean;
}

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const getRandomInt = (max: number) => Math.floor(Math.random() * max);

export default function HyperText({
  text,
  duration = 800,
  framerProps = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 3 },
  },
  className,
  animateOnLoad = true,
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState(text.split(""));
  const [trigger, setTrigger] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const interations = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerAnimation = () => {
    if (!hasAnimated) {
      interations.current = 0;
      setTrigger(true);
      setHasAnimated(true);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            triggerAnimation();
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the element is visible
        rootMargin: "0px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasAnimated]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (!trigger) {
          clearInterval(interval);
          return;
        }
        if (interations.current < text.length) {
          setDisplayText((t) =>
            t.map((l, i) =>
              l === " "
                ? l
                : i <= interations.current
                  ? text[i]
                  : alphabets[getRandomInt(26)],
            ),
          );
          interations.current = interations.current + 0.1;
        } else {
          setTrigger(false);
          clearInterval(interval);
        }
      },
      duration / (text.length * 10),
    );
    
    return () => clearInterval(interval);
  }, [text, duration, trigger]);

  return (
    <div
      ref={containerRef}
      className=" pt-2 flex cursor-default scale-100"
    >
      <AnimatePresence mode="wait">
        {displayText.map((letter, i) => (
          <motion.h1
            key={i}
            className={cn("font-mono", letter === " " ? "w-3" : "", className, "whitespace-pre-wrap text-left tracking-tighter text-black drop-shadow-[0_0px_8px_rgba(0,0,0,0.2)] text-5xl"
            )}
            {...framerProps}
            
          >
          <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent filter blur-lg"/>
          {letter.toUpperCase()}
          </motion.h1>
          
        ))}
      </AnimatePresence>
    </div>
  );
}