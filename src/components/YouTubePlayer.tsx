import { getYouTubeEmbedUrl } from '@/lib/youtube';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
}

export function YouTubePlayer({ videoId, title }: YouTubePlayerProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black" style={{ aspectRatio: '16 / 9' }}>
      <iframe
        className="absolute inset-0 h-full w-full"
        src={getYouTubeEmbedUrl(videoId)}
        title={title ?? 'Video del ejercicio'}
        frameBorder="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
