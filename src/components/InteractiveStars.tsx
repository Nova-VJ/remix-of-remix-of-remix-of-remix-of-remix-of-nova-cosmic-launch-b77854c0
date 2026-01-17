import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleDuration: number;
  twinkleDelay: number;
}

// Generate fixed star positions with better distribution
const generateStars = (count: number): Star[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (i * 17 + 5) % 100,
    y: (i * 13 + 3) % 100,
    size: 2 + (i % 4),
    brightness: 0.5 + (i % 3) * 0.2,
    twinkleDuration: 1.5 + (i % 3),
    twinkleDelay: (i * 0.15) % 2,
  }));
};

const STAR_COUNT = 30;
const INTERACTION_RADIUS = 120;
const BOUNCE_STRENGTH = 50;

export default function InteractiveStars() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stars] = useState<Star[]>(() => generateStars(STAR_COUNT));
  const [offsets, setOffsets] = useState<{ [key: number]: { x: number; y: number } }>({});

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX;
      const y = clientY;

      const newOffsets: { [key: number]: { x: number; y: number } } = {};

      stars.forEach((star) => {
        const starX = (star.x / 100) * window.innerWidth;
        const starY = (star.y / 100) * window.innerHeight;
        
        const dx = starX - x;
        const dy = starY - y;
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
      style={{ zIndex: 0 }}
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
              stiffness: 200,
              damping: 12,
              mass: 0.3,
            }}
          >
            {/* Minimalist 4-point star shape */}
            <motion.div
              className="relative"
              style={{
                width: star.size * 3,
                height: star.size * 3,
              }}
              animate={{
                opacity: [star.brightness, 1, star.brightness],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: star.twinkleDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: star.twinkleDelay,
              }}
            >
              {/* Horizontal line */}
              <div
                className="absolute top-1/2 left-0 -translate-y-1/2"
                style={{
                  width: "100%",
                  height: star.size * 0.3,
                  background: `linear-gradient(90deg, transparent 0%, hsl(var(--primary)) 50%, transparent 100%)`,
                }}
              />
              {/* Vertical line */}
              <div
                className="absolute left-1/2 top-0 -translate-x-1/2"
                style={{
                  height: "100%",
                  width: star.size * 0.3,
                  background: `linear-gradient(180deg, transparent 0%, hsl(var(--primary)) 50%, transparent 100%)`,
                }}
              />
              {/* Center glow */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: star.size * 0.8,
                  height: star.size * 0.8,
                  backgroundColor: "hsl(var(--primary))",
                  boxShadow: `0 0 ${star.size}px hsl(var(--primary) / 0.8)`,
                }}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
