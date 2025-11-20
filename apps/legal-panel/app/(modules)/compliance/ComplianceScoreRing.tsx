"use client";

import { useEffect, useRef, useState } from "react";

export default function ComplianceScoreRing({
  value,          // number 0–100
  size = 148,     // Outer size
  stroke = 12,    // Ring thickness
}: {
  value: number;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animation state
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = 1200; // Apple-like smooth fill

    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic Apple-like
      setDisplayValue(value * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  // Pulse glow effect when score > 85%
  const pulse = value >= 85;

  const dashOffset =
    circumference - (displayValue / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Glow pulse outer ring */}
      {pulse && (
        <div
          className="
            absolute inset-0 rounded-full
            animate-[pulseGlow_2.2s_ease-in-out_infinite]
          "
          style={{
            boxShadow:
              "0 0 22px rgba(231,183,95,0.45), 0 0 38px rgba(255,255,255,0.25)",
          }}
        />
      )}

      {/* Background ring */}
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={stroke}
          fill="none"
        />

        {/* Foreground animated ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          style={{
            stroke: `url(#gold-gradient)`,
            strokeDasharray: circumference,
            strokeDashoffset: dashOffset,
            transition: "stroke-dashoffset 120ms ease-out",
            filter: "drop-shadow(0 0 5px rgba(231,183,95,0.65))",
          }}
        />
        {/* Gold gradient */}
        <defs>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"  stopColor="#E7B75F" />
            <stop offset="55%" stopColor="#F3E9C8" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold text-gold">
          {Math.round(displayValue)}
        </span>
        <span className="text-xs text-pure/60 tracking-wider">
          Compliance
        </span>
      </div>

      {/* Pulse Animation (CSS) */}
      <style jsx>{`
        @keyframes pulseGlow {
          0% {
            transform: scale(1);
            opacity: 0.55;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.55;
          }
        }
      `}</style>
    </div>
  );
}