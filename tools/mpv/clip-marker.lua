-- clip-marker.lua — 遊戲精華時間軸標記工具
--
-- 快捷鍵：
--   M       標記開始/結束時間（交替）
--   Ctrl+M  輸入字幕（標記結束後自動觸發，也可手動補字幕）
--   Ctrl+L  顯示已標記的片段清單
--   Ctrl+S  儲存到 clips.txt
--   Ctrl+Z  撤銷最後一個標記
--
-- 輸出格式（clips.txt）：
--   00:02:15 ~ 00:02:45 | Phase 1 開場
--   00:08:30 ~ 00:09:10 | DPS Check

local utils = require("mp.utils")
local msg = require("mp.msg")

-- State
local clips = {}          -- { {start=, end_=, subtitle=}, ... }
local mark_start = nil     -- 暫存的開始時間（秒）
local waiting_subtitle = false
local output_file = nil    -- 自動設定為影片同目錄的 clips.txt

-- 格式化秒數為 HH:MM:SS
local function format_time(seconds)
    if not seconds then return "??:??:??" end
    local h = math.floor(seconds / 3600)
    local m = math.floor((seconds % 3600) / 60)
    local s = math.floor(seconds % 60)
    return string.format("%02d:%02d:%02d", h, m, s)
end

-- 取得輸出路徑
local function get_output_path()
    if output_file then return output_file end
    local path = mp.get_property("path", "")
    local dir = utils.split_path(path)
    if dir == "" then dir = "." end
    output_file = utils.join_path(dir, "clips.txt")
    return output_file
end

-- OSD 訊息
local function osd(text, duration)
    mp.osd_message(text, duration or 3)
    msg.info(text)
end

-- 標記開始或結束
local function toggle_mark()
    local pos = mp.get_property_number("time-pos")
    if not pos then
        osd("[Clip] 無法取得播放位置")
        return
    end

    if mark_start == nil then
        -- 標記開始
        mark_start = pos
        osd("[Clip] 開始: " .. format_time(pos) .. "\n再按 M 標記結束", 5)
    else
        -- 標記結束
        local start_time = mark_start
        local end_time = pos
        mark_start = nil

        -- 確保 start < end
        if end_time < start_time then
            start_time, end_time = end_time, start_time
        end

        local clip = {
            start = start_time,
            end_ = end_time,
            subtitle = "",
        }
        table.insert(clips, clip)

        local idx = #clips
        osd(string.format(
            "[Clip #%d] %s ~ %s\n按 Ctrl+M 輸入字幕，或按 M 繼續標記下一段",
            idx, format_time(start_time), format_time(end_time)
        ), 5)

        -- 自動暫停方便輸入字幕
        mp.set_property_bool("pause", true)
        waiting_subtitle = true
    end
end

-- 輸入字幕（用 MPV 的 input 功能）
local function input_subtitle()
    if #clips == 0 then
        osd("[Clip] 沒有片段可以加字幕")
        return
    end

    -- 使用 console input
    mp.commandv("script-message-to", "console", "type",
        "script-message clip-set-subtitle ")
    osd("[Clip] 在下方輸入字幕，按 Enter 確認", 5)
end

-- 接收字幕輸入
mp.register_script_message("clip-set-subtitle", function(...)
    local parts = {...}
    local subtitle = table.concat(parts, " ")
    if #clips == 0 then return end

    clips[#clips].subtitle = subtitle
    local c = clips[#clips]
    osd(string.format(
        "[Clip #%d] %s ~ %s | %s",
        #clips, format_time(c.start), format_time(c.end_), subtitle
    ), 3)
    waiting_subtitle = false
end)

-- 顯示所有片段
local function show_clips()
    if #clips == 0 then
        osd("[Clip] 還沒有標記任何片段\n按 M 開始標記")
        return
    end

    local lines = {"=== 已標記片段 ==="}
    for i, c in ipairs(clips) do
        local sub = c.subtitle ~= "" and (" | " .. c.subtitle) or ""
        table.insert(lines, string.format(
            "#%d  %s ~ %s%s",
            i, format_time(c.start), format_time(c.end_), sub
        ))
    end
    table.insert(lines, string.format("\n共 %d 段，按 Ctrl+S 儲存", #clips))
    osd(table.concat(lines, "\n"), 10)
end

-- 儲存到檔案
local function save_clips()
    if #clips == 0 then
        osd("[Clip] 沒有片段可儲存")
        return
    end

    local path = get_output_path()
    local f = io.open(path, "w")
    if not f then
        osd("[Clip] 無法寫入: " .. path)
        return
    end

    f:write("# Clip markers - " .. os.date("%Y-%m-%d %H:%M") .. "\n")
    f:write("# 格式: 開始 ~ 結束 | 字幕\n")
    f:write("#\n")

    for i, c in ipairs(clips) do
        local sub = c.subtitle ~= "" and c.subtitle or ("Clip " .. i)
        f:write(string.format("%s ~ %s | %s\n",
            format_time(c.start), format_time(c.end_), sub
        ))
    end

    f:close()
    osd(string.format("[Clip] 已儲存 %d 段到:\n%s", #clips, path), 5)
end

-- 撤銷最後一個
local function undo_last()
    if #clips == 0 and mark_start == nil then
        osd("[Clip] 沒有可撤銷的標記")
        return
    end

    if mark_start ~= nil then
        -- 撤銷未完成的開始標記
        mark_start = nil
        osd("[Clip] 已撤銷開始標記")
    else
        local removed = table.remove(clips)
        osd(string.format(
            "[Clip] 已撤銷 #%d (%s ~ %s)\n剩餘 %d 段",
            #clips + 1, format_time(removed.start), format_time(removed.end_), #clips
        ))
    end
end

-- 綁定快捷鍵
mp.add_key_binding("m", "clip-toggle-mark", toggle_mark)
mp.add_key_binding("Ctrl+m", "clip-input-subtitle", input_subtitle)
mp.add_key_binding("Ctrl+l", "clip-show-list", show_clips)
mp.add_key_binding("Ctrl+s", "clip-save", save_clips)
mp.add_key_binding("Ctrl+z", "clip-undo", undo_last)

-- 啟動提示
mp.register_event("file-loaded", function()
    output_file = nil  -- 重設
    osd("[Clip Marker] 已載入\nM=標記  Ctrl+L=清單  Ctrl+S=儲存", 4)
end)
