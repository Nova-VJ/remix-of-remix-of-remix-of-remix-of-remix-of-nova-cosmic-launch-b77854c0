import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDuration: number;
  twinkleDelay: number;
}

// Generate fixed star positions
const generateStars = (count: number): Star[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (i * 37 + 13) % 100,
    y: (i * 23 + 7) % 100,
    size: 1 + (i % 3),
    opacity: 0.3 + (i % 5) * 0.15,
    twinkleDuration: 2 + (i % 4),
    twinkleDelay: (i * 0.2) % 3,
  }));
};

const STAR_COUNT = 80;
const INTERACTION_RADIUS = 100;
const BOUNCE_STRENGTH = 40;

export default function InteractiveStars() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stars] = useState<Star[]>(() => generateStars(STAR_COUNT));
  const [offsets, setOffsets] = useState<{ [key: number]: { x: number; y: number } }>({});
  const mousePos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top + window.scrollY;
      
      mousePos.current = { x, y };

      const newOffsets: { [key: number]: { x: number; y: number } } = {};

      stars.forEach((star) => {
        const starX = (star.x / 100) * rect.width;
        const starY = (star.y / 100) * document.documentElement.scrollHeight;
        
        const dx = starX - x;
        const dy = starY - (y - window.scrollY);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < INTERACTION_RADIUS && distance > 0) {
          const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;
          const angle = Math.atan2(dy, dx);
          newOffsets[star.id] = {
            x: Math.cos(angle) * force * BOUNCE_STRENGTH,
            y: Math.sin(angle) * force * BOUNCE_STRENGTH,
          };
        }
      });

      setOffsets(newOffsets);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleLeave = () => {
      mousePos.current = { x: -1000, y: -1000 };
      setOffsets({});
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseleave", handleLeave);
    window.addEventListener("touchend", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("touchend", handleLeave);
    };
  }, [stars]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: -1 }}
    >
      {stars.map((star) => {
        const offset = offsets[star.id] || { x: 0, y: 0 };
        
        return (
          <motion.div
            key={star.id}
            className="absolute"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
            }}
            animate={{
              x: offset.x,
              y: offset.y,
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 15,
              mass: 0.5,
            }}
          >
            {/* Star glow */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: star.size * 4,
                height: star.size * 4,
                left: -star.size * 1.5,
                top: -star.size * 1.5,
                background: `radial-gradient(circle, hsl(var(--primary) / ${star.opacity * 0.3}) 0%, transparent 70%)`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: star.twinkleDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: star.twinkleDelay,
              }}
            />
            {/* Star core */}
            <motion.div
              className="rounded-full bg-foreground"
              style={{
                width: star.size,
                height: star.size,
                boxShadow: `0 0 ${star.size * 2}px hsl(var(--primary) / 0.5), 0 0 ${star.size * 4}px hsl(var(--primary) / 0.3)`,
              }}
              animate={{
                opacity: [star.opacity, star.opacity + 0.4, star.opacity],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: star.twinkleDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: star.twinkleDelay,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
