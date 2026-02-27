# Game Highlight Reel Template

Remotion 影片模板，專為遊戲精華剪輯設計。從一段長影片中擷取多個精彩片段，自動串接、加特效字幕、配背景音樂。

## Quick Start

```bash
npm install
npm run studio     # 瀏覽器即時預覽
npm run render     # 輸出 MP4
```

## 使用方式

### 1. 放入素材

將檔案放到 `public/`：
- 影片：`public/ff14_raid.mp4`（支援 .mp4 / .webm）
- BGM：`public/audio/bgm.mp3`

### 2. 編輯時間軸

修改 `src/config/highlight-config.ts`：

```typescript
clips: [
  // 基本用法
  {
    label: '開場',
    start: '00:02:15',         // 開始時間
    end: '00:02:45',           // 結束時間
    subtitle: 'Phase 1 開場',   // 字幕（可選）
    transition: 'fade',         // none | fade | crossfade
    transitionFrames: 15,       // 轉場幀數
  },

  // 進階：字幕位置/時間 + 畫面 zoom
  {
    label: 'DPS Check',
    start: '00:08:30',
    end: '00:09:10',
    subtitle: 'DPS Check',
    subtitleStyle: { x: 50, y: 70, fontSize: 48, delaySeconds: 2, durationSeconds: 5 },
    focus: { scale: 2, x: 50, y: 40 },
    transition: 'crossfade',
  },

  // 進階：同一片段多段字幕
  {
    label: 'Tank LB',
    start: '00:15:00',
    end: '00:15:30',
    subtitles: [
      { text: 'Tank LB3 救場！', x: 50, y: 40, fontSize: 56, durationSeconds: 4 },
      { text: '差點滅團...', x: 50, y: 60, fontSize: 40, delaySeconds: 4 },
    ],
    focus: { scale: 1.5, x: 50, y: 50 },
  },
],
```

### 3. 片段設定參考

| 欄位 | 必填 | 說明 |
|------|------|------|
| `label` | 是 | 片段名稱（Studio 時間軸顯示用） |
| `start` | 是 | 開始時間 `MM:SS` 或 `HH:MM:SS` |
| `end` | 是 | 結束時間 |
| `subtitle` | 否 | 簡易字幕（置中顯示） |
| `subtitleStyle` | 否 | 字幕位置/大小/時間（見下方） |
| `subtitles` | 否 | 多段字幕陣列（取代 subtitle） |
| `transition` | 否 | `'none'` / `'fade'` / `'crossfade'` |
| `transitionFrames` | 否 | 轉場幀數，預設 15 |
| `playbackRate` | 否 | `0.5`=慢動作、`1`=正常、`2`=快轉 |
| `focus` | 否 | 畫面 zoom（見下方） |

### 4. 字幕定位 (subtitleStyle / subtitles)

| 參數 | 預設 | 說明 |
|------|------|------|
| `text` | - | 字幕文字（subtitles 陣列必填） |
| `x` | 50 | 水平位置 0-100（0=最左, 50=置中, 100=最右） |
| `y` | 50 | 垂直位置 0-100（0=最上, 50=置中, 100=最下） |
| `fontSize` | 56 | 字體大小 px |
| `delaySeconds` | 0 | 延遲幾秒後出現 |
| `durationSeconds` | 到片段結束 | 顯示幾秒 |

### 5. 畫面 Focus / Zoom

裁掉 UI，放大特定角色或區域：

```typescript
focus: { scale: 2, x: 50, y: 40 }
//       放大倍率  水平焦點  垂直焦點
```

| 參數 | 說明 |
|------|------|
| `scale` | 放大倍率（2 = 顯示 50% 區域） |
| `x` | 焦點水平位置 0-100 |
| `y` | 焦點垂直位置 0-100 |

### 6. 音訊設定

```typescript
audio: {
  bgmFile: 'audio/bgm.mp3',   // BGM 檔名（刪掉 = 不加 BGM）
  bgmVolume: 0.3,              // BGM 音量（0~1）
  keepOriginalAudio: true,     // true = 保留遊戲原音
  originalAudioVolume: 0.7,    // 原音音量（0~1）
},
```

### 7. 片頭/片尾

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
- 特效字幕（衝擊縮放、RGB 色散、Glitch 閃爍、光暈脈衝）
- 字幕自由定位、獨立時間控制、多段字幕
- 白字黑邊描邊（不受影片色調影響）
- 畫面 Focus Zoom（裁掉 UI、放大特定角色）
- Fade / Crossfade 轉場
- 片頭標題卡 + 片尾卡
- 慢動作 / 快轉支援
- 原始遊戲音訊 + BGM 分軌控制（自動淡入淡出）
- Vignette 電影感濾鏡
- 支援 .mp4 / .webm 來源影片
- 支援 30fps / 60fps 輸出
