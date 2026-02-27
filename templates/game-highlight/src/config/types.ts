/**
 * Type definitions for game-highlight template
 */

// Re-export theme types from lib
export type {
  Theme,
  ThemeColors,
  ThemeFonts,
  ThemeSpacing,
  ThemeBorderRadius,
  ThemeTypography,
} from '../../../../lib/theme';

/** A single clip from the source video */
export interface ClipConfig {
  /** Clip label (for identification in Remotion Studio) */
  label: string;
  /** Start time "MM:SS" or "HH:MM:SS" */
  start: string;
  /** End time "MM:SS" or "HH:MM:SS" */
  end: string;
  /** Subtitle text (empty = no subtitle) */
  subtitle?: string;
  /** Transition effect between this clip and the next */
  transition?: 'none' | 'fade' | 'crossfade';
  /** Transition duration in frames (default: 15 = 0.5s at 30fps) */
  transitionFrames?: number;
  /** Playback speed (1 = normal, 0.5 = slow-mo, 2 = fast) */
  playbackRate?: number;
}

/** Title card shown at the beginning */
export interface TitleCardConfig {
  enabled: boolean;
  durationSeconds: number;
  headline: string;
  subheadline?: string;
}

/** End card shown at the end */
export interface EndCardConfig {
  enabled: boolean;
  durationSeconds: number;
  headline?: string;
  subheadline?: string;
}

export interface AudioConfig {
  bgmFile?: string;
  bgmVolume: number;
  keepOriginalAudio: boolean;
  originalAudioVolume: number;
}

export interface HighlightConfig {
  source: string;
  titleCard: TitleCardConfig;
  endCard: EndCardConfig;
  clips: ClipConfig[];
  audio: AudioConfig;
}

export interface VideoConfig {
  fps: number;
  width: number;
  height: number;
}
