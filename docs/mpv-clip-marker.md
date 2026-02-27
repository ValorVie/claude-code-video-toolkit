# MPV + Clip Marker 時間軸標記指南

使用 MPV 播放器搭配自訂腳本，邊看影片邊標記精彩時間點，一鍵輸出時間軸檔案。

---

## 安裝 MPV

### Windows（Scoop）

```bash
scoop bucket add extras
scoop install extras/mpv
```

安裝完畢後**重開終端機**讓 PATH 生效，然後確認：

```bash
mpv --version
# mpv v0.41.0 ...
```

### 其他安裝方式

| 方法 | 指令 |
|------|------|
| Chocolatey | `choco install mpv` |
| 手動下載 | https://mpv.io/installation/ |

---

## 安裝 Clip Marker 腳本

將 `clip-marker.lua` 放到 MPV 的腳本目錄：

### Scoop 安裝的 MPV

```
C:\Users\<你的用戶名>\scoop\apps\mpv\current\portable_config\scripts\clip-marker.lua
```

### 手動安裝的 MPV

```
C:\Users\<你的用戶名>\AppData\Roaming\mpv\scripts\clip-marker.lua
```

腳本原始碼在本 repo 的 `tools/mpv/clip-marker.lua`（見下方「腳本備份」一節）。

---

## 使用方式

### 開啟影片

```bash
mpv "C:\path\to\your\ff14_raid.mp4"
```

或者直接把影片檔案**拖到 MPV 視窗/捷徑上**。

影片載入後，畫面上會顯示：

```
[Clip Marker] 已載入
M=標記  Ctrl+L=清單  Ctrl+S=儲存
```

### MPV 基本操作

先熟悉這些，瀏覽影片會很快：

| 按鍵 | 功能 |
|------|------|
| `Space` | 暫停 / 播放 |
| `←` / `→` | 快退 / 快進 5 秒 |
| `↑` / `↓` | 快退 / 快進 60 秒 |
| `Shift+←` / `Shift+→` | 快退 / 快進 1 秒（精確微調） |
| `.` | 逐幀前進（暫停狀態下） |
| `,` | 逐幀後退（暫停狀態下） |
| `[` / `]` | 減速 / 加速播放（0.5x、1x、2x…） |
| `Backspace` | 恢復正常播放速度 |
| `f` | 全螢幕切換 |
| `q` | 離開 |

> **技巧**：用 `→` 快速跳過無聊的部分，看到精彩的先按 `Space` 暫停，再用 `,` 逐幀後退找到準確的起點。

---

## Clip Marker 快捷鍵

| 按鍵 | 功能 | 說明 |
|------|------|------|
| `M` | 標記開始/結束 | 第一次按 = 標記開始，第二次按 = 標記結束 |
| `Ctrl+M` | 輸入字幕 | 標記結束後，為這段輸入字幕文字 |
| `Ctrl+L` | 顯示片段清單 | 畫面上列出所有已標記的片段 |
| `Ctrl+S` | 儲存 | 輸出 `clips.txt` 到影片同目錄 |
| `Ctrl+Z` | 撤銷 | 撤銷最後一個標記（開始或整段） |

---

## 標記流程（Step by Step）

### 1. 找到精彩片段的起點

播放影片，看到想要的瞬間，按 `Space` 暫停。可以用 `,` 和 `.` 逐幀微調。

### 2. 按 `M` 標記開始

畫面顯示：
```
[Clip] 開始: 00:02:15
再按 M 標記結束
```

### 3. 移動到結束位置，再按 `M`

可以繼續播放或用 `→` 跳轉。到了結束點按 `M`：
```
[Clip #1] 00:02:15 ~ 00:02:45
按 Ctrl+M 輸入字幕，或按 M 繼續標記下一段
```

影片會**自動暫停**，方便你決定要不要加字幕。

### 4.（可選）按 `Ctrl+M` 輸入字幕

MPV 底部會出現輸入框，打字後按 `Enter`：
```
[Clip #1] 00:02:15 ~ 00:02:45 | Phase 1 開場
```

> 字幕可以之後再加，不影響標記流程。

### 5. 重複步驟 1~4

繼續標記更多片段。按 `Ctrl+L` 隨時檢查已標記的清單：

```
=== 已標記片段 ===
#1  00:02:15 ~ 00:02:45 | Phase 1 開場
#2  00:08:30 ~ 00:09:10 | DPS Check 差點滅團
#3  00:15:00 ~ 00:15:30 | Tank LB3 救場
#4  00:22:10 ~ 00:22:50 | First Clear！

共 4 段，按 Ctrl+S 儲存
```

### 6. 按 `Ctrl+S` 儲存

輸出到影片同目錄的 `clips.txt`：

```
# Clip markers - 2026-02-27 16:30
# 格式: 開始 ~ 結束 | 字幕
#
00:02:15 ~ 00:02:45 | Phase 1 開場
00:08:30 ~ 00:09:10 | DPS Check 差點滅團
00:15:00 ~ 00:15:30 | Tank LB3 救場
00:22:10 ~ 00:22:50 | First Clear！
```

---

## 從 clips.txt 到影片成品

拿到 `clips.txt` 後，有兩種方式轉成 Remotion 設定：

### 方法 A：交給 Claude Code

直接在 Claude Code 中說：

```
幫我把這個 clips.txt 轉成 highlight-config.ts
```

Claude Code 會自動讀取並更新設定檔。

### 方法 B：手動對照

`clips.txt` 的格式和 `highlight-config.ts` 幾乎一樣：

```
clips.txt:
00:02:15 ~ 00:02:45 | Phase 1 開場

對應到:
{
  label: 'Phase 1 開場',
  start: '00:02:15',
  end: '00:02:45',
  subtitle: 'Phase 1 開場',
  transition: 'fade',
},
```

---

## 常見問題

### Q: `Ctrl+M` 沒有出現輸入框？

MPV 的 console 腳本需要啟用。確認 MPV 版本 >= 0.36。較舊版本可能需要手動安裝 `console.lua`。

替代方案：跳過 `Ctrl+M`，標記完所有片段後，直接編輯 `clips.txt` 手動加字幕。

### Q: 標記錯了怎麼辦？

按 `Ctrl+Z` 撤銷最後一個標記。可以連續撤銷多次。

### Q: 可以在播放中標記嗎？還是要暫停？

兩者都可以。播放中按 `M` 會記錄當下的時間。暫停後按 `M` 也可以。建議：

- **開始點**：暫停後標記（比較精準）
- **結束點**：播放中標記也行（之後可以微調）

### Q: clips.txt 存在哪裡？

存在**影片檔案所在的目錄**。例如影片在 `D:\Videos\ff14.mp4`，`clips.txt` 就在 `D:\Videos\clips.txt`。

### Q: 換一個影片看，之前的標記會消失嗎？

會。每次載入新影片，腳本會重設。記得在換影片前先按 `Ctrl+S` 儲存。

---

## 腳本備份

腳本安裝位置：

```
C:\Users\jack3\scoop\apps\mpv\current\portable_config\scripts\clip-marker.lua
```

如需重新安裝或分享給其他人，腳本原始碼見 repo 中的對應路徑。
