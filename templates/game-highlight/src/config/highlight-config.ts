import type { HighlightConfig, VideoConfig } from './types';

/**
 * 遊戲精華剪輯設定
 *
 * 使用方式：
 * 1. 把影片放到 public/ (例如 public/ff14_raid.mp4)
 * 2. 把 BGM 放到 public/audio/ (例如 public/audio/bgm.mp3)
 * 3. 修改下方 clips 陣列
 * 4. npm run studio 預覽 / npm run render 輸出
 */
export const highlightConfig: HighlightConfig = {
  source: 'ff14_raid.mp4',

  titleCard: {
    enabled: true,
    durationSeconds: 4,
    headline: 'FF14 副本精華',
    subheadline: 'Raid Highlight Reel',
  },

  endCard: {
    enabled: true,
    durationSeconds: 3,
    headline: 'Thanks for Watching',
  },

  clips: [
    // ===== 在這裡編輯你的片段 =====

    // 基本用法：字幕 + 轉場
    {
      label: '開場',
      start: '00:02:15',
      end: '00:02:45',
      subtitle: 'Phase 1 開場 — 全員集合',
      transition: 'fade',
      transitionFrames: 15,
    },

    // 進階：字幕位置/大小/時間 + focus zoom
    {
      label: 'DPS Check',
      start: '00:08:30',
      end: '00:09:10',
      subtitle: 'DPS Check 差點滅團',
      subtitleStyle: { x: 50, y: 70, fontSize: 48, delaySeconds: 2, durationSeconds: 5 },
      transition: 'crossfade',
      transitionFrames: 15,
      focus: { scale: 2, x: 50, y: 40 },
    },

    // 進階：多段字幕（同一片段內）
    {
      label: 'Tank LB',
      start: '00:15:00',
      end: '00:15:30',
      subtitles: [
        { text: 'Tank LB3 救場！', x: 50, y: 40, fontSize: 56, durationSeconds: 4 },
        { text: '差點滅團...', x: 50, y: 60, fontSize: 40, delaySeconds: 4 },
      ],
      transition: 'fade',
      transitionFrames: 15,
      focus: { scale: 1.5, x: 50, y: 50 },
    },

    // 簡單：不加字幕、不轉場
    {
      label: 'First Clear',
      start: '00:22:10',
      end: '00:22:50',
      subtitle: 'First Clear！',
      transition: 'none',
    },
  ],

  audio: {
    bgmFile: 'audio/bgm.mp3',
    bgmVolume: 0.3,
    keepOriginalAudio: true,
    originalAudioVolume: 0.7,
  },
};

export const videoConfig: VideoConfig = {
  fps: 30,
  width: 1920,
  height: 1080,
};

// === Utility ===

/** Parse time string to seconds */
export function timeToSeconds(time: string): number {
  const parts = time.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0];
}

/** Parse time string to frame number */
export function timeToFrames(time: string, fps: number): number {
  return Math.round(timeToSeconds(time) * fps);
}

/** Calculate total frames for the highlight reel */
export function calculateTotalFrames(config: HighlightConfig, fps: number): number {
  let total = 0;
  if (config.titleCard.enabled) total += config.titleCard.durationSeconds * fps;
  for (const clip of config.clips) {
    const start = timeToFrames(clip.start, fps);
    const end = timeToFrames(clip.end, fps);
    total += end - start;
  }
  if (config.endCard.enabled) total += config.endCard.durationSeconds * fps;
  return total;
}
