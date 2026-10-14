import { useEffect, useId, useRef, useState } from "react";

export interface FormatDemoVideo {
  device: "Desktop" | "Mobile";
  src: string;
}

interface FormatVideoDemoProps {
  title: string;
  videos: readonly [FormatDemoVideo, ...FormatDemoVideo[]];
  poster?: string;
}

export default function FormatVideoDemo({ title, videos, poster }: FormatVideoDemoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoId = useId();
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const device = window.matchMedia("(max-width: 767px)").matches ? "Mobile" : "Desktop";
    return Math.max(0, videos.findIndex((video) => video.device === device));
  });
  const selectedVideo = videos[selectedIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let visible = true;

    const syncPlayback = () => {
      if (visible && document.visibilityState === "visible") {
        // Muted inline playback also permits autoplay on mobile browsers.
        video.muted = true;
        void video.play().catch(() => {
          // A source change can cancel play; canplay retries once it is ready.
        });
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(video);
    video.addEventListener("canplay", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();

    return () => {
      observer.disconnect();
      video.removeEventListener("canplay", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [selectedVideo.src]);

  return (
    <div className="relative w-full overflow-hidden rounded-[1.5rem] bg-[#dad8d2] md:rounded-[2rem]">
      <div className="aspect-video w-full">
        <video
          key={selectedVideo.src}
          ref={videoRef}
          id={videoId}
          src={selectedVideo.src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          preload="metadata"
          aria-label={`Demo de ${title} en ${selectedVideo.device}`}
          className="pointer-events-none block h-full w-full object-contain"
        />
      </div>
      {videos.length > 1 && (
        <div role="group" aria-label="Dispositivo de la demo" className="flex shrink-0 justify-center gap-2 border-t border-ink/10 px-4 py-3">
          {videos.map((video, index) => (
            <button
              key={video.device}
              type="button"
              aria-pressed={index === selectedIndex}
              aria-controls={videoId}
              data-cursor="hover"
              onClick={() => setSelectedIndex(index)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red ${index === selectedIndex ? "bg-ink text-bone" : "text-ink/60 hover:bg-ink/10 hover:text-ink"}`}
            >
              {video.device}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
