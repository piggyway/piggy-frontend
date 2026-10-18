"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

type AnimationState = "static" | "hidden" | "revealed";

export function AnimatedSection({
  children,
  className,
  delay = 0,
}: AnimatedSectionProps) {
  const [animationState, setAnimationState] =
    useState<AnimationState>("static");
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let isHidden = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!isHidden) {
          if (
            entry.isIntersecting ||
            entry.boundingClientRect.top < window.innerHeight
          ) {
            observer.disconnect();
            return;
          }
          isHidden = true;
          setAnimationState("hidden");
          return;
        }
        if (entry.isIntersecting) {
          timeoutId = setTimeout(() => {
            setAnimationState("revealed");
          }, delay);
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [delay]);

  return (
    <div
      ref={sectionRef}
      className={cn(
        animationState === "hidden" && "translate-y-8 opacity-0",
        animationState === "revealed" &&
          "translate-y-0 opacity-100 transition-all duration-700 ease-out",
        className
      )}
    >
      {children}
    </div>
  );
}
