# Game Highlight Reel Template

Remotion 影片模板，專為遊戲精華剪輯設計。從一段長影片中擷取多個精彩片段，自動串接、加字幕、配背景音樂。

## Quick Start

```bash
npm install
npm run studio     # 瀏覽器即時預覽
npm run render     # 輸出 MP4
```

## 使用方式

### 1. 放入素材

將檔案放到 `public/`：
- 影片：`public/ff14_raid.mp4`（或任何 .mp4）
- BGM：`public/audio/bgm.mp3`

### 2. 編輯時間軸

修改 `src/config/highlight-config.ts`：

```typescript
clips: [
  {
    label: '開場',
    start: '00:02:15',       // 開始時間
    end: '00:02:45',         // 結束時間
    subtitle: 'Phase 1 開場', // 字幕（可選）
    transition: 'fade',       // none | fade | crossfade
    transitionFrames: 15,     // 轉場幀數（0.5s at 30fps）
    playbackRate: 1,          // 播放速度（0.5=慢動作, 2=快轉）
  },
  // ... 更多片段
],
```

### 3. 設定音訊

```typescript
audio: {
  bgmFile: 'audio/bgm.mp3',
  bgmVolume: 0.3,            // BGM 音量
  keepOriginalAudio: true,    // 保留遊戲原音
  originalAudioVolume: 0.7,   // 原音音量
},
```

### 4. 片頭/片尾

```typescript
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
```

## Project Structure

```
game-highlight/
├── src/
│   ├── config/
│   │   ├── highlight-config.ts  ← 你的剪輯設定（主要編輯這個）
│   │   ├── types.ts
│   │   └── theme.ts
│   ├── components/
│   │   ├── core/              # Vignette 等共用組件
│   │   └── slides/            # GameSubtitle, TitleCard, EndCard
│   ├── GameHighlight.tsx      # 主要作品
│   ├── Root.tsx
│   └── index.ts
├── public/
│   ├── (your-video.mp4)       ← 影片素材
│   └── audio/
│       └── (bgm.mp3)          ← 背景音樂
└── package.json
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run studio` | 開啟 Remotion 預覽 Studio |
| `npm run render` | 輸出完整品質 MP4 |
| `npm run render:preview` | 輸出半解析度預覽 |

## Features

- 時間軸式片段定義（start/end）
- 自動 BGM 淡入淡出
- 動畫字幕（滑入 + 淡入淡出）
- Fade / Crossfade 轉場
- 片頭標題卡 + 片尾卡
- 慢動作 / 快轉支援
- 原始遊戲音訊 + BGM 分軌控制
- Vignette 電影感濾鏡
