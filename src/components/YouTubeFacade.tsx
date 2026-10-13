import { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubeFacadeProps {
  /** Any YouTube embed or watch URL */
  url: string;
  title: string;
}

const videoId = (url: string) => url.match(/(?:embed\/|v=|youtu\.be\/)([\w-]{11})/)?.[1] ?? '';

/**
 * Shows the video thumbnail and only loads YouTube's player when the visitor
 * presses play. Saves ~1 MB of third-party code per video on page load and,
 * through youtube-nocookie.com, sets no YouTube cookies before consent.
 */
const YouTubeFacade = ({ url, title }: YouTubeFacadeProps) => {
  const [playing, setPlaying] = useState(false);
  const id = videoId(url);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group absolute inset-0 h-full w-full overflow-hidden bg-black"
      aria-label={`Reproducir vídeo: ${title}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        width={480}
        height={360}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover opacity-90 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden="true" />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[hsl(var(--nova-ink))] shadow-xl transition-transform duration-300 group-hover:scale-110">
        <Play className="ml-1 h-7 w-7 fill-current" />
      </span>
    </button>
  );
};

export default YouTubeFacade;
