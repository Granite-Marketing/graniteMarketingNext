import React from "react";
import { cn } from "@/lib/utils";

interface VideoIframeProps {
  video: string;
  className?: string;
}

export function VideoIframe({ video, className }: VideoIframeProps) {
  return (
    <div className={cn("relative aspect-video w-full", className)}>
      <iframe
        src={video}
        className="absolute inset-0 h-full w-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video player"
      />
    </div>
  );
}

