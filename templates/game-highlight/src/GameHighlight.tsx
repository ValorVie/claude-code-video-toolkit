import React from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  highlightConfig,
  videoConfig,
  timeToFrames,
  calculateTotalFrames,
} from './config/highlight-config';
import { GameSubtitle } from './components/slides/GameSubtitle';
import { TitleCard } from './components/slides/TitleCard';
import { EndCard } from './components/slides/EndCard';
import { Vignette } from './components/core';

export const GameHighlight: React.FC = () => {
  const { fps } = useVideoConfig();
  const config = highlightConfig;
  const totalFrames = calculateTotalFrames(config, fps);

  // Build timeline
  let currentFrame = 0;

  // Title card
  const titleFrames = config.titleCard.enabled
    ? config.titleCard.durationSeconds * fps
    : 0;

  // Resolve clip frames
  const resolvedClips = config.clips.map((clip) => {
    const startF = timeToFrames(clip.start, fps);
    const endF = timeToFrames(clip.end, fps);
    return { ...clip, startFrame: startF, endFrame: endF, durationInFrames: endF - startF };
  });

  // End card
  const endCardFrames = config.endCard.enabled
    ? config.endCard.durationSeconds * fps
    : 0;

  // Calculate clip timeline offsets (after title card)
  currentFrame = titleFrames;
  const clipTimeline = resolvedClips.map((clip) => {
    const entry = { ...clip, timelineStart: currentFrame };
    currentFrame += clip.durationInFrames;
    return entry;
  });

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Title Card */}
      {config.titleCard.enabled && (
        <Sequence durationInFrames={titleFrames} name="Title Card">
          <TitleCard
            headline={config.titleCard.headline}
            subheadline={config.titleCard.subheadline}
          />
        </Sequence>
      )}

      {/* Video Clips */}
      {clipTimeline.map((clip, index) => {
        const transitionFrames = clip.transitionFrames ?? 15;
        const transition = clip.transition ?? 'none';

        return (
          <Sequence
            key={clip.label}
            from={clip.timelineStart}
            durationInFrames={clip.durationInFrames}
            name={clip.label}
          >
            <AbsoluteFill>
              {/* Video */}
              <OffthreadVideo
                src={staticFile(config.source)}
                trimBefore={clip.startFrame}
                trimAfter={clip.endFrame}
                volume={config.audio.keepOriginalAudio ? config.audio.originalAudioVolume : 0}
                playbackRate={clip.playbackRate ?? 1}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Fade-in transition (not on first clip) */}
              {transition === 'fade' && index > 0 && (
                <Sequence durationInFrames={transitionFrames}>
                  <FadeOverlay direction="in" durationInFrames={transitionFrames} />
                </Sequence>
              )}

              {/* Fade-out transition (not on last clip) */}
              {transition === 'fade' && index < clipTimeline.length - 1 && (
                <Sequence
                  from={clip.durationInFrames - transitionFrames}
                  durationInFrames={transitionFrames}
                >
                  <FadeOverlay direction="out" durationInFrames={transitionFrames} />
                </Sequence>
              )}

              {/* Subtitle */}
              {clip.subtitle && (
                <GameSubtitle
                  text={clip.subtitle}
                  durationInFrames={clip.durationInFrames}
                />
              )}
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* End Card */}
      {config.endCard.enabled && (
        <Sequence
          from={currentFrame}
          durationInFrames={endCardFrames}
          name="End Card"
        >
          <EndCard
            headline={config.endCard.headline}
            subheadline={config.endCard.subheadline}
          />
        </Sequence>
      )}

      {/* Subtle vignette overlay */}
      <Vignette />

      {/* Background Music */}
      {config.audio.bgmFile && (
        <Audio
          src={staticFile(config.audio.bgmFile)}
          volume={(f) => {
            const fadeIn = interpolate(f, [0, 60], [0, config.audio.bgmVolume], {
              extrapolateRight: 'clamp',
            });
            const fadeOut = interpolate(
              f,
              [totalFrames - 90, totalFrames],
              [config.audio.bgmVolume, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            );
            return Math.min(fadeIn, fadeOut);
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/** Simple black fade overlay */
const FadeOverlay: React.FC<{ direction: 'in' | 'out'; durationInFrames: number }> = ({
  direction,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const opacity =
    direction === 'in'
      ? interpolate(frame, [0, durationInFrames], [1, 0], { extrapolateRight: 'clamp' })
      : interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', opacity, zIndex: 10 }} />
  );
};
