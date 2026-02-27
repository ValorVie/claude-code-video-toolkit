# 遊戲精華剪輯工作流

從錄影到成品的完整流程，每一步都有對應的工具和指令。

---

## 工作流總覽

```
錄影 → 標記時間軸 → 建立專案 → 編輯設定 → 預覽調整 → 輸出
```

| 階段 | 工具 | 產出 |
|------|------|------|
| 1. 錄影 | OBS / GeForce Experience | gameplay.mp4 |
| 2. 標記時間軸 | MPV + clip-marker.lua | clips.txt |
| 3. 建立專案 | 複製 template | projects/my-highlight/ |
| 4. 編輯設定 | VS Code / Claude Code | highlight-config.ts |
| 5. 預覽調整 | Remotion Studio | 即時熱更新 |
| 6. 輸出 | Remotion CLI | out/highlight.mp4 |

---

## Step 1：錄影

用 OBS、GeForce Experience、或任何錄影軟體錄下遊戲畫面。

建議設定：
- 解析度：1920x1080
- FPS：60（輸出時可選 30 或 60）
- 格式：.mp4 或 .webm

---

## Step 2：標記時間軸

### 使用 MPV + Clip Marker（推薦）

```bash
mpv "path/to/gameplay.mp4"
```

| 按鍵 | 功能 |
|------|------|
| `M` | 標記開始/結束 |
| `Ctrl+M` | 輸入字幕 |
| `Ctrl+L` | 顯示已標記清單 |
| `Ctrl+S` | 儲存 clips.txt |
| `Ctrl+Z` | 撤銷 |

詳見 [MPV Clip Marker 使用指南](../../docs/mpv-clip-marker.md)。

### 輸出格式

```
# clips.txt
00:03:35 ~ 00:03:37 | 第一支王搶開
00:07:56 ~ 00:07:59 | 同一個人第二支王搶開
00:13:03 ~ 00:13:06 | 又是他，第三支王搶開
```

> **重要**：建議每段前後多抓 2-3 秒緩衝，讓觀眾有反應時間，也讓字幕有足夠顯示時間。

---

## Step 3：建立專案

```bash
# 從 template 複製
cp -r templates/game-highlight projects/my-highlight
cd projects/my-highlight
npm install
```

把素材放進去：

```bash
# 影片
cp /path/to/gameplay.mp4 public/

# BGM（可選）
cp /path/to/bgm.mp3 public/audio/
```

---

## Step 4：編輯設定

打開 `src/config/highlight-config.ts`。

### 4a. 設定影片來源

```typescript
source: 'gameplay.mp4',
```

### 4b. 轉換 clips.txt → clips 陣列

直接在 Claude Code 中說：

```
幫我把 clips.txt 轉成 highlight-config.ts
```

或手動對照：

```
clips.txt:                           config:
00:03:35 ~ 00:03:37 | 搶開    →    { label: '搶開', start: '00:03:32', end: '00:03:40', subtitle: '搶開' }
```

### 4c. 加入進階設定

根據需要添加：

**字幕定位** — 不想放在正中央：
```typescript
subtitleStyle: { x: 30, y: 70, fontSize: 48, delaySeconds: 2, durationSeconds: 4 }
```

**多段字幕** — 同一片段內多句話：
```typescript
subtitles: [
  { text: '第一句', durationSeconds: 3 },
  { text: '第二句', delaySeconds: 4 },
]
```

**Focus Zoom** — 放大角色、裁掉 UI：
```typescript
focus: { scale: 2, x: 50, y: 40 }
```

**慢動作**：
```typescript
playbackRate: 0.5
```

### 4d. 音訊設定

| 情境 | 設定 |
|------|------|
| 保留遊戲音 + BGM | `keepOriginalAudio: true, bgmVolume: 0.3, originalAudioVolume: 0.7` |
| 只要 BGM | `keepOriginalAudio: false, bgmFile: 'audio/bgm.mp3'` |
| 純影片無聲 | `keepOriginalAudio: false`（不設 bgmFile） |

---

## Step 5：預覽調整

```bash
npm run studio
```

這是迭代最密集的階段。改 config → 存檔 → Studio 即時更新。

### 調整清單

- [ ] 每段時間點是否準確（start/end）
- [ ] 字幕文字、位置、出現時間是否合適
- [ ] Focus zoom 是否對準想看的角色/區域
- [ ] 轉場是否順暢
- [ ] BGM 音量是否適中
- [ ] 片頭/片尾文字

---

## Step 6：輸出

```bash
# 完整品質
npm run render

# 快速預覽（半解析度）
npm run render:preview
```

輸出在 `out/highlight.mp4`。

---

## 常見情境與解法

### 片段太短，字幕一閃而過

前後多抓 2-3 秒緩衝：
```
原本: 00:03:35 ~ 00:03:37 (2秒)
調整: 00:03:32 ~ 00:03:40 (8秒)
```

### 想讓字幕晚一點出現

```typescript
subtitleStyle: { delaySeconds: 3 }  // 片段開始 3 秒後才出字幕
```

### 同一段想要兩句不同的字幕

```typescript
subtitles: [
  { text: '搶開了', durationSeconds: 4 },
  { text: '沒死真可惜', delaySeconds: 5 },
]
```

### 遊戲 UI 太多想裁掉

```typescript
focus: { scale: 2, x: 50, y: 40 }  // 放大 2 倍，聚焦中上方
```

### 兩段 clip 之間有短暫黑屏

這是因為拆成了兩個獨立 clip。改成一個 clip + `subtitles` 陣列就不會有黑屏。

### 想要 60fps 更流暢

```typescript
export const videoConfig: VideoConfig = {
  fps: 60,   // 改成 60
  width: 1920,
  height: 1080,
};
```

---

## 快速參考卡

```
MPV 標記:    M=標記  Ctrl+M=字幕  Ctrl+S=儲存  Ctrl+Z=撤銷
Studio:      npm run studio
輸出:        npm run render
設定檔:      src/config/highlight-config.ts
字幕位置:    subtitleStyle: { x, y, fontSize, delaySeconds, durationSeconds }
多段字幕:    subtitles: [{ text, x, y, delaySeconds, durationSeconds }]
畫面放大:    focus: { scale, x, y }
慢動作:      playbackRate: 0.5
音訊:        audio: { bgmFile, bgmVolume, keepOriginalAudio, originalAudioVolume }
```
