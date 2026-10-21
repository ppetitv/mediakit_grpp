import { useEffect, useRef } from "react";
import { observeMotionVisibility } from "@/lib/motion-visibility";

export default function DeferredReel() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current!;
    let loaded = false;
    let active = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      video.preload = "metadata";
      video.src = "/images/reel.mp4";
      video.load();
    };
    const syncPlayback = () => {
      if (active) {
        load();
        video.muted = true;
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    };
    const near = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      load();
      near.disconnect();
    }, { rootMargin: "400px 0px" });
    near.observe(video);
    video.addEventListener("canplay", syncPlayback);
    const stopVisibility = observeMotionVisibility(video, (visible) => {
      active = visible;
      syncPlayback();
    });
    return () => {
      near.disconnect();
      stopVisibility();
      video.removeEventListener("canplay", syncPlayback);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, []);

  return (
    <video
      ref={ref}
      className="mani-img absolute inset-0 h-full w-full rounded-2xl object-cover"
      poster="/images/signal.png"
      loop
      muted
      playsInline
      controls={false}
      preload="none"
      disablePictureInPicture
      disableRemotePlayback
      aria-label="Reel de GRPP"
    />
  );
}
