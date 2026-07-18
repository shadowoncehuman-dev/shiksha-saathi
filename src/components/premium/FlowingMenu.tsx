import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

export interface MenuItemData {
  link: string;
  text: string;
  image: string;
}

export interface FlowingMenuProps {
  items?: MenuItemData[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  onItemClick?: (link: string) => void;
}

export const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = [],
  speed = 15,
  textColor = "hsl(var(--foreground))",
  bgColor = "hsl(var(--background))",
  marqueeBgColor = "hsl(var(--primary))",
  marqueeTextColor = "hsl(var(--primary-foreground))",
  borderColor = "hsl(var(--border))",
  onItemClick,
}) => {
  return (
    <div className="w-full overflow-hidden" style={{ background: bgColor }}>
      <nav className="flex flex-col w-full">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            isFirst={idx === 0}
            onItemClick={onItemClick}
          />
        ))}
      </nav>
    </div>
  );
};

interface MenuItemProps extends MenuItemData {
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  isFirst: boolean;
  onItemClick?: (link: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  link,
  text,
  image,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  isFirst,
  onItemClick,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);
  const animationDefaults = { duration: 0.6, ease: "expo.out" };

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): "top" | "bottom" => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
  };

  useEffect(() => {
    const calc = () => {
      if (!marqueeInnerRef.current) return;
      const part = marqueeInnerRef.current.querySelector(".marquee-part") as HTMLElement;
      if (!part) return;
      const contentWidth = part.offsetWidth;
      const needed = Math.ceil(window.innerWidth / (contentWidth || 100)) + 2;
      setRepetitions(Math.max(4, needed));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [text, image]);

  useEffect(() => {
    const setup = () => {
      if (!marqueeInnerRef.current) return;
      const part = marqueeInnerRef.current.querySelector(".marquee-part") as HTMLElement;
      if (!part) return;
      const contentWidth = part.offsetWidth;
      if (contentWidth === 0) return;
      if (animationRef.current) animationRef.current.kill();
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    };
    const t = setTimeout(setup, 100);
    return () => {
      clearTimeout(t);
      if (animationRef.current) animationRef.current.kill();
    };
  }, [text, image, repetitions, speed]);

  const handleMouseEnter = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);
    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .set(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);
    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .to(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0);
  };

  return (
    <div
      ref={itemRef}
      className="relative overflow-hidden cursor-pointer"
      style={{ borderTop: isFirst ? `1px solid ${borderColor}` : "none", borderBottom: `1px solid ${borderColor}` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onItemClick?.(link)}
    >
      <a
        className="block py-8 md:py-10 px-6 md:px-10 font-playfair text-4xl md:text-6xl font-bold tracking-tight"
        style={{ color: textColor }}
        onClick={(e) => e.preventDefault()}
        href={link}
      >
        {text}
      </a>
      <div
        ref={marqueeRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ background: marqueeBgColor, transform: "translateY(101%)" }}
      >
        <div ref={marqueeInnerRef} className="flex h-full items-center whitespace-nowrap will-change-transform">
          {[...Array(repetitions)].map((_, idx) => (
            <div key={idx} className="marquee-part flex items-center gap-8 pr-8">
              <span
                className="font-playfair text-4xl md:text-6xl font-bold tracking-tight px-2"
                style={{ color: marqueeTextColor }}
              >
                {text}
              </span>
              <span
                className="inline-block h-14 w-24 md:h-20 md:w-40 rounded-full bg-center bg-cover"
                style={{ backgroundImage: `url(${image})` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlowingMenu;
