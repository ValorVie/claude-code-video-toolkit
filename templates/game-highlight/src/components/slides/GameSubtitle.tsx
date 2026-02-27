import React, { useMemo } from 'react';
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from 'remotion';

interface GameSubtitleProps {
  text: string;
  durationInFrames: number;
  /** Horizontal position 0-100 (50 = center) */
  x?: number;
  /** Vertical position 0-100 (0 = top, 100 = bottom) */
  y?: number;
  /** Font size override in px */
  fontSize?: number;
}

/**
 * Impact-style gaming subtitle
 *
 * Effects:
 * - Center-screen slam-in with scale overshoot
 * - RGB chromatic aberration split
 * - Glow pulse
 * - Glitch flicker on entrance
 * - Slide-out upward on exit
 */
export const GameSubtitle: React.FC<GameSubtitleProps> = ({
  text,
  durationInFrames,
  x = 50,
  y = 50,
  fontSize = 56,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === Timing phases ===
  const enterDuration = 12; // slam-in frames
  const glitchEnd = 18; // glitch flicker zone
  const exitStart = durationInFrames - 15;

  // === Entrance: scale slam ===
  const slamProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.6 },
  });
  const scale = interpolate(slamProgress, [0, 1], [2.5, 1]);

  // === Opacity ===
  const fadeIn = interpolate(frame, [0, 4], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(
    frame,
    [exitStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const baseOpacity = Math.min(fadeIn, fadeOut);

  // === Exit: slide up ===
  const exitProgress = interpolate(
    frame,
    [exitStart, durationInFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.ease) },
  );
  const exitY = interpolate(exitProgress, [0, 1], [0, -60]);

  // === Glitch flicker (entrance only) ===
  const glitchSeed = useMemo(
    () => Array.from({ length: glitchEnd }, () => Math.random()),
    [glitchEnd],
  );
  const isGlitching = frame < glitchEnd;
  const glitchOpacity = isGlitching
    ? (glitchSeed[frame] ?? 1) > 0.3 ? 1 : 0
    : 1;

  // === RGB split (chromatic aberration) ===
  const rgbAmount = interpolate(frame, [0, enterDuration, enterDuration + 6], [8, 3, 0], {
    extrapolateRight: 'clamp',
  });

  // === Glow pulse ===
  const glowPulse = interpolate(
    frame,
    [0, enterDuration, enterDuration + 15, enterDuration + 30],
    [30, 20, 12, 8],
    { extrapolateRight: 'clamp' },
  );

  // === Horizontal glitch offset (entrance) ===
  const glitchX = isGlitching
    ? ((glitchSeed[frame] ?? 0) - 0.5) * 16
    : 0;

  const strokeWidth = `${Math.max(2, fontSize * 0.05)}px`;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${scale}) translateY(${exitY}px) translateX(${glitchX}px)`,
        opacity: baseOpacity * glitchOpacity,
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      {/* Red channel (offset left) */}
      {rgbAmount > 0.5 && (
        <div
          style={{
            position: 'absolute',
            ...makeTextStyle(fontSize),
            color: 'rgba(255, 0, 0, 0.7)',
            WebkitTextStroke: `${strokeWidth} rgba(0, 0, 0, 0.4)`,
            paintOrder: 'stroke fill',
            transform: `translateX(${-rgbAmount}px)`,
          }}
        >
          {text}
        </div>
      )}

      {/* Blue channel (offset right) */}
      {rgbAmount > 0.5 && (
        <div
          style={{
            position: 'absolute',
            ...makeTextStyle(fontSize),
            color: 'rgba(0, 100, 255, 0.7)',
            WebkitTextStroke: `${strokeWidth} rgba(0, 0, 0, 0.4)`,
            paintOrder: 'stroke fill',
            transform: `translateX(${rgbAmount}px)`,
          }}
        >
          {text}
        </div>
      )}

      {/* Main text — white fill + black stroke for readability on any background */}
      <div
        style={{
          ...makeTextStyle(fontSize),
          color: 'white',
          WebkitTextStroke: `${strokeWidth} rgba(0, 0, 0, 0.85)`,
          paintOrder: 'stroke fill',
          textShadow: [
            `0 0 ${glowPulse}px rgba(0, 212, 170, 0.9)`,
            `0 0 ${glowPulse * 2}px rgba(0, 212, 170, 0.4)`,
            '0 3px 6px rgba(0, 0, 0, 1)',
            '0 0 20px rgba(0, 0, 0, 0.6)',
          ].join(', '),
        }}
      >
        {text}
      </div>

      {/* Horizontal scan line (entrance only) */}
      {frame < enterDuration + 8 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 2,
            top: `${interpolate(frame, [0, enterDuration + 8], [30, 70], { extrapolateRight: 'clamp' })}%`,
            background: 'linear-gradient(90deg, transparent, rgba(0, 212, 170, 0.6), transparent)',
            opacity: interpolate(frame, [enterDuration, enterDuration + 8], [0.8, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        />
      )}
    </div>
  );
};

const makeTextStyle = (size: number): React.CSSProperties => ({
  fontSize: size,
  fontFamily: 'Microsoft JhengHei, sans-serif',
  fontWeight: 900,
  letterSpacing: 4,
  textAlign: 'center' as const,
  whiteSpace: 'nowrap' as const,
  lineHeight: 1.3,
});
