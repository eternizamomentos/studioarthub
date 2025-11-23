"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function WaveformPlayer({
  src,
  height = 64,
}: {
  src: string;
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  const [isReady, setReady] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#5c6278",
      progressColor: "#d4af37",
      cursorColor: "#ffffff55",
      height,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
    });

    wavesurfer.current.load(src);

    wavesurfer.current.on("ready", () => {
      setDuration(wavesurfer.current!.getDuration());
      setReady(true);
    });

    wavesurfer.current.on("audioprocess", () => {
      setCurrent(wavesurfer.current!.getCurrentTime());
    });

    wavesurfer.current.on("play", () => setPlaying(true));
    wavesurfer.current.on("pause", () => setPlaying(false));
    wavesurfer.current.on("finish", () => {
      setPlaying(false);
      setCurrent(0);
    });

    return () => {
      wavesurfer.current?.unAll();
      wavesurfer.current?.destroy();
    };
  }, [src]);

  function togglePlay() {
    wavesurfer.current?.playPause();
  }

  function fmt(t: number) {
    if (!Number.isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div ref={containerRef} className="w-full rounded-md overflow-hidden" />

      {/* Ajuste fino de layout para espaçamento ideal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-pure/60 mt-2 px-2">
        <button
          onClick={togglePlay}
          className="px-3 py-1 rounded-md border border-white/20 hover:bg-white/10 text-pure/80 transition"
        >
          {isPlaying ? "Pausar" : isReady ? "Play" : "⋯"}
        </button>
        <span className="min-w-[4rem] text-right">
          {fmt(current)} / {fmt(duration)}
        </span>
      </div>
    </div>
  );
}