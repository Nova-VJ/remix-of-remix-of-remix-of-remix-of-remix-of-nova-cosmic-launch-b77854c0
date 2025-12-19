import { useRef, useEffect, useState } from 'react';
import introVideo from '@/assets/intro.mp4';

interface IntroSectionProps {
  onIntroEnd: () => void;
}

const IntroSection = ({ onIntroEnd }: IntroSectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isEnding, setIsEnding] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    // Show skip button after 1 second
    const skipTimer = setTimeout(() => setShowSkip(true), 1000);

    // Fallback: auto-transition after 8 seconds if video doesn't fire onEnded
    const fallbackTimer = setTimeout(() => {
      if (!isEnding) {
        handleEnd();
      }
    }, 8000);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(fallbackTimer);
    };
  }, [isEnding]);

  const handleEnd = () => {
    setIsEnding(true);
    setTimeout(onIntroEnd, 500);
  };

  const handleVideoEnd = () => {
    handleEnd();
  };

  const handleSkip = () => {
    handleEnd();
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-background transition-opacity duration-500 ${
        isEnding ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
      >
        <source src={introVideo} type="video/mp4" />
      </video>

      {/* Skip button */}
      {showSkip && !isEnding && (
        <button
          onClick={handleSkip}
          className="absolute bottom-8 right-8 px-4 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors duration-300 bg-background/30 rounded-lg backdrop-blur-sm"
        >
          Saltar
        </button>
      )}
    </div>
  );
};

export default IntroSection;
