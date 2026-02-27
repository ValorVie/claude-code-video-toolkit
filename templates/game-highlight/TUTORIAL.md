# 遊戲精華剪輯教學

從一段完整的副本錄影，剪出精華片段，加上特效字幕和背景音樂。

---

## 前置準備

你需要：
- 一段遊戲錄影（.mp4 / .webm）
- 一首背景音樂（.mp3，可選）
- 記下你想保留的精彩時間點

不需要：
- 剪輯經驗
- 寫程式（只需編輯一個設定檔）

---

## Step 1：放入素材

打開資料夾 `public/`：

```
public/
├── ff14_raid.mp4      ← 把你的影片放這裡
└── audio/
    └── bgm.mp3        ← 把 BGM 放這裡（可選）
```

檔名可以自訂，之後在設定檔裡對應就好。

> **提示**：影片太大？可以先用 FFmpeg 壓縮：
> ```bash
> ffmpeg -i 原始檔.mp4 -crf 23 -preset fast ff14_raid.mp4
> ```

---

## Step 2：記錄時間軸

看一遍影片，記下精彩片段的時間點。

### 推薦方式：MPV + Clip Marker

安裝 MPV 播放器後搭配 clip-marker.lua 腳本，邊看邊按 `M` 標記時間點，最後 `Ctrl+S` 自動輸出 `clips.txt`。

詳見 [MPV Clip Marker 使用指南](../../docs/mpv-clip-marker.md)。

### 手動記錄

用任何播放器暫停記時間，格式像這樣：

```
00:02:15 ~ 00:02:45  開場集合
00:08:30 ~ 00:09:10  DPS Check 差點滅團
00:15:00 ~ 00:15:30  Tank LB3 救場
00:22:10 ~ 00:22:50  First Clear！
```

> **提示**：時間不用很精確，之後預覽時可以微調。建議前後多抓 2-3 秒緩衝，讓觀眾有反應時間。

---

## Step 3：編輯設定檔

用 VS Code 或任何編輯器打開：

```
src/config/highlight-config.ts
```

### 3a. 設定影片來源

```typescript
source: 'ff14_raid.mp4',  // 對應 public/ 裡的檔名
```

### 3b. 設定片頭（可關閉）

```typescript
titleCard: {
  enabled: true,           // false = 不要片頭
  durationSeconds: 4,      // 片頭顯示秒數
  headline: 'FF14 副本精華',
  subheadline: 'Raid Highlight Reel',
},
```

### 3c. 編輯片段（核心！）

把你記錄的時間軸填進 `clips` 陣列：

```typescript
clips: [
  // 基本用法
  {
    label: '開場',              // 名稱（給自己看的）
    start: '00:02:15',          // 開始時間
    end: '00:02:45',            // 結束時間
    subtitle: 'Phase 1 — 全員集合',  // 字幕（留空或刪掉 = 不顯示）
    transition: 'fade',         // 轉場：'none' | 'fade' | 'crossfade'
    transitionFrames: 15,       // 轉場長度（15 幀 = 0.5 秒）
  },

  // 進階：調整字幕位置和時間
  {
    label: 'Tank LB',
    start: '00:15:00',
    end: '00:15:30',
    subtitle: 'Tank LB3 救場！',
    subtitleStyle: {
      x: 50,                   // 水平位置 0-100（50=置中）
      y: 70,                   // 垂直位置 0-100（0=最上, 100=最下）
      fontSize: 48,            // 字體大小
      delaySeconds: 2,         // 延遲 2 秒才出字幕
      durationSeconds: 4,      // 字幕顯示 4 秒
    },
    transition: 'fade',
  },

  // 進階：同一片段內多段字幕
  {
    label: '最終 Phase',
    start: '00:20:00',
    end: '00:20:30',
    subtitles: [
      { text: '最後一波！', x: 50, y: 40, durationSeconds: 4 },
      { text: '通關啦！', x: 50, y: 60, delaySeconds: 5, fontSize: 64 },
    ],
    transition: 'none',
  },
],
```

#### 每個欄位說明

| 欄位 | 必填 | 說明 |
|------|------|------|
| `label` | 是 | 片段名稱，顯示在 Studio 時間軸上 |
| `start` | 是 | 開始時間，格式 `MM:SS` 或 `HH:MM:SS` |
| `end` | 是 | 結束時間 |
| `subtitle` | 否 | 字幕文字（簡易模式，置中顯示） |
| `subtitleStyle` | 否 | 字幕位置/大小/時間控制 |
| `subtitles` | 否 | 多段字幕陣列（取代 subtitle） |
| `transition` | 否 | `'none'`、`'fade'`、`'crossfade'` |
| `transitionFrames` | 否 | 轉場幀數，預設 15（0.5 秒） |
| `playbackRate` | 否 | `0.5` = 慢動作、`1` = 正常、`2` = 快轉 |
| `focus` | 否 | 畫面放大（見下方） |

### 3d. Focus Zoom（放大畫面、裁掉 UI）

遊戲畫面通常有很多 UI（技能列、小地圖等），可以 zoom 進去只看角色：

```typescript
{
  label: 'Boss 搶開',
  start: '00:03:35',
  end: '00:03:45',
  subtitle: '搶開了！',
  focus: {
    scale: 2,     // 放大 2 倍（只顯示 50% 畫面）
    x: 50,        // 焦點水平位置 (0=左, 50=中, 100=右)
    y: 40,        // 焦點垂直位置 (0=上, 50=中, 100=下)
  },
},
```

調整 focus 的方式：在 `npm run studio` 預覽中，改 config 存檔即時看效果。

| 參數 | 說明 |
|------|------|
| `x: 30` | 焦點往左移 |
| `x: 70` | 焦點往右移 |
| `y: 30` | 焦點往上移 |
| `y: 60` | 焦點往下移 |
| `scale: 3` | 放更大（只看 33% 區域） |
| `scale: 1.5` | 放小一點（看 67% 區域） |

### 3e. 設定音訊

```typescript
audio: {
  bgmFile: 'audio/bgm.mp3',   // BGM 檔名（刪掉 = 不加 BGM）
  bgmVolume: 0.3,              // BGM 音量（0~1）
  keepOriginalAudio: true,     // true = 保留遊戲原音
  originalAudioVolume: 0.7,    // 原音音量（0~1）
},
```

> **音量建議**：BGM 0.2~0.3 + 原音 0.7~0.8 通常聽起來最舒服。
> 不需要遊戲音的話設 `keepOriginalAudio: false`。

### 3f. 片尾（可關閉）

```typescript
endCard: {
  enabled: true,
  durationSeconds: 3,
  headline: 'Thanks for Watching',
},
```

### 3g. FPS 設定

預設 30fps。想要更流暢可以改成 60fps（render 時間加倍）：

```typescript
export const videoConfig: VideoConfig = {
  fps: 60,
  width: 1920,
  height: 1080,
};
```

---

## Step 4：預覽

在終端機執行：

```bash
npm run studio
```

瀏覽器會自動打開 Remotion Studio（通常在 `http://localhost:3000`）：

- **播放/暫停**：空白鍵
- **逐幀**：左右方向鍵
- **時間軸**：底部可以拖動
- **左側面板**：可以看到每個片段（Sequence）

### 預覽時調整

不滿意？直接改 `highlight-config.ts`，儲存後 Studio 會**自動熱更新**，不需要重啟。

常見調整：
- 時間不對 → 修改 `start` / `end`
- 字幕位置不對 → 調 `subtitleStyle` 的 `x` / `y`
- 字幕太快消失 → 加 `durationSeconds`
- 畫面 zoom 位置不對 → 調 `focus` 的 `x` / `y`
- BGM 太大聲 → 降低 `bgmVolume`
- 想要慢動作 → 加 `playbackRate: 0.5`

---

## Step 5：輸出影片

確認預覽沒問題後：

```bash
# 完整品質（1920x1080）
npm run render

# 快速預覽（半解析度，速度快很多）
npm run render:preview
```

輸出檔案在：`out/highlight.mp4`

> **輸出時間**：依片段總長度而定，通常 1~5 分鐘的精華需要 2~10 分鐘 render。
> 60fps 會比 30fps 慢一倍。

---

## 進階技巧

### 用 Claude Code 幫你做

你可以直接在 Claude Code 中告訴我：

```
「幫我把 clips.txt 轉成 highlight-config.ts」

「第二段字幕改成左上角、延遲 3 秒出現」

「所有片段都加 focus zoom 放大 2 倍在畫面中間」
```

我會直接幫你改設定檔。

### 多來源影片

目前模板設計為單一來源影片。如果需要多來源，告訴我，我可以擴充。

### 更花俏的效果

toolkit 內建更多轉場效果（glitch、RGB split、zoom blur 等），如果基本的 fade 不夠用，我可以幫你加入。

---

## 完整流程 TL;DR

```
1. 影片放 public/
2. BGM 放 public/audio/（可選）
3. 用 MPV + Clip Marker 標記時間點 → clips.txt
4. 編輯 src/config/highlight-config.ts（填時間軸、字幕、focus）
5. npm run studio（預覽 + 即時調整）
6. npm run render（輸出）
```

就這樣。不用學剪輯軟體。
