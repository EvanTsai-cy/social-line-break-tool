# 🧩 Social Line Break Tool  
社群換行工具（Threads / Instagram / Facebook）

---

## 📌 專案介紹

這是一個用來處理社群貼文「換行與空行」的工具，  
支援 **Threads、Instagram（IG）與 Facebook（FB）**。

你可以在這裡編輯文案、加入空行，並預覽貼上後的實際效果，  
同時一鍵複製可用版本，避免貼文排版跑掉。

---

## 💡 為什麼會做這個工具？

在備忘錄裡排好的文案，貼到不同平台後常常會出現：

- 開頭空行消失
- 多行空白被壓縮
- 段落間距不一致

而且：

👉 Threads / IG / FB 的行為都不一樣

這個工具就是為了解決這個問題。

---

## ⚙️ 功能特色

### ✍️ 文案編輯
- 支援多行輸入
- 即時顯示字數 / 行數

### 🔄 換行模式切換
- **原始貼上效果**
- **修正後效果（保留空行）**

### 👀 平台預覽
- Threads
- Instagram
- Facebook

可直接看到不同平台的排版差異

### 📋 一鍵複製
- 自動加入零寬字元（zero-width space）
- 幫助保留空行與段落

---

## 🧠 各平台換行邏輯（核心差異）

### Threads
- 原始：空行會轉成段落樣式
- 修正後：可保留空行與段落

### Instagram
- 原始：
  - 開頭空行會消失
  - 無法保留多行空白
- 修正後：
  - 可保留開頭空行
  - 可保留段落間距

### Facebook
- 原始：
  - 開頭空行消失
  - 多空行會被壓縮
- 修正後：
  - 中間空行可保留
  - 開頭空行仍可能消失

---

## 🛠️ 使用技術

- HTML
- CSS
- Vanilla JavaScript

---

## 🚀 使用方式

1. 輸入你的文案
2. 選擇平台（Threads / IG / FB）
3. 切換「原始貼上」或「修正後」
4. 預覽效果
5. 點擊「一鍵複製」貼到社群

---

## 📌 備註

Preview results are based on observed platform behavior and may vary slightly depending on device or app version.
