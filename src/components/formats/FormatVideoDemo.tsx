import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

export interface FormatDemoVideo {
  device: "Desktop" | "Mobile";
  src: string;
  width?: number;
  height?: number;
}

interface FormatVideoDemoProps {
  title: string;
  videos: readonly [FormatDemoVideo, ...FormatDemoVideo[]];
  poster?: string;
  loop?: boolean;
}

const mobileQuery = "(max-width: 767px)";

function indexForDevice(videos: FormatVideoDemoProps["videos"], mobile: boolean) {
  return Math.max(0, videos.findIndex(({ device }) => device === (mobile ? "Mobile" : "Desktop")));
}

export default function FormatVideoDemo({ title, videos, poster, loop = false }: FormatVideoDemoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoId = useId();
  const [selectedIndex, setSelectedIndex] = useState(() => indexForDevice(videos, window.matchMedia(mobileQuery).matches));
  const selectedVideo = videos[selectedIndex];
  const hasDeviceSelector = videos.length > 1;
  // Existing Display captures are 16:9. Branded demos declare their encoded dimensions.
  const ratio = (selectedVideo.width ?? 16) / (selectedVideo.height ?? 9);

  useEffect(() => {
    if (!hasDeviceSelector) return;
    const media = window.matchMedia(mobileQuery);
    const syncDevice = (event: MediaQueryListEvent) => setSelectedIndex(indexForDevice(videos, event.matches));
    media.addEventListener("change", syncDevice);
    return () => media.removeEventListener("change", syncDevice);
  }, [hasDeviceSelector, videos]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => {
      // Native controls remain available if the browser blocks autoplay.
    });
    const pauseWhenHidden = () => { if (document.hidden) video.pause(); };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      video.pause();
    };
  }, [selectedVideo.src]);

  const playerStyle = {
    "--demo-ratio": ratio,
    "--demo-selector-height": hasDeviceSelector ? "3.75rem" : "0px",
    width: "min(100%, max(0px, calc((100dvh - var(--demo-viewport-offset) - var(--demo-selector-height) - env(safe-area-inset-top) - env(safe-area-inset-bottom)) * var(--demo-ratio))))",
  } as CSSProperties;

  return (
    <div
      data-format-video
      className="relative mx-auto overflow-hidden rounded-[1.5rem] bg-black [--demo-viewport-offset:9.5rem] md:rounded-[2rem] md:[--demo-viewport-offset:10.5rem]"
      style={playerStyle}
    >
      <div className="w-full" style={{ aspectRatio: ratio }}>
        <video
          key={selectedVideo.src}
          ref={videoRef}
          id={videoId}
          src={selectedVideo.src}
          poster={poster}
          autoPlay
          muted
          loop={loop}
          playsInline
          controls
          disablePictureInPicture
          disableRemotePlayback
          preload="metadata"
          aria-label={hasDeviceSelector ? `Demo de ${title} en ${selectedVideo.device}` : `Demo de ${title}`}
          className="block h-full w-full object-contain"
        />
      </div>
      {hasDeviceSelector && (
        <div role="group" aria-label="Dispositivo de la demo" className="flex shrink-0 justify-center gap-2 border-t border-ink/10 bg-[#dad8d2] p-2">
          {videos.map((video, index) => (
            <button
              key={video.device}
              type="button"
              aria-pressed={index === selectedIndex}
              aria-controls={videoId}
              data-cursor="hover"
              onClick={() => setSelectedIndex(index)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${index === selectedIndex ? "bg-ink text-bone" : "text-ink/60 hover:text-ink"}`}
            >
              {video.device}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
