// =========================
// 基本常數
// =========================

// 預覽區沒有內容時顯示的預設文字
const DEFAULT_PREVIEW_TEXT = "你的文案會顯示在這裡";

// 零寬字元：用來幫助平台保留空行 / 換行
const ZERO_WIDTH_SPACE = "\u200B";

// 預設 action 列（Threads / IG）
const DEFAULT_ACTIONS_HTML = `
  <button class="icon-btn" type="button" aria-label="Like">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.1 20.2s-7.1-4.4-8.8-8.1c-1.3-2.9.1-6.1 3.2-7.1 2-.7 4.1 0 5.5 1.7 1.4-1.7 3.5-2.4 5.5-1.7 3.1 1 4.5 4.2 3.2 7.1-1.7 3.7-8.8 8.1-8.8 8.1z"></path>
    </svg>
  </button>

  <button class="icon-btn" type="button" aria-label="Reply">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11.5c0 4.1-3.8 7.5-8.5 7.5-1.1 0-2.2-.2-3.1-.6L4 20l1.4-3.6c-1.2-1.3-1.9-3-1.9-4.9C3.5 7.4 7.3 4 12 4s8 3.4 8 7.5z"></path>
    </svg>
  </button>

  <button class="icon-btn" type="button" aria-label="Repost">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7h8.5l-2.4-2.4 1.4-1.4L19.3 8l-4.8 4.8-1.4-1.4L15.5 9H7a3 3 0 0 0-3 3v1H2v-1a5 5 0 0 1 5-5zm10 4v1a5 5 0 0 1-5 5H3.5l2.4 2.4-1.4 1.4L-.3 16l4.8-4.8 1.4 1.4L3.5 15H12a3 3 0 0 0 3-3v-1h2z"></path>
    </svg>
  </button>

  <button class="icon-btn" type="button" aria-label="Share">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 3L10 14"></path>
      <path d="M21 3l-7 18-3.2-7.8L3 10l18-7z"></path>
    </svg>
  </button>
`;

const FACEBOOK_ACTIONS_HTML = `
  <button class="fb-action-btn" type="button">按讚</button>
  <button class="fb-action-btn" type="button">留言</button>
  <button class="fb-action-btn" type="button">傳送</button>
`;

// =========================
// 狀態
// =========================

const state = {
  platform: "threads", // threads / ig / fb
  pasteMode: "fixed",  // fixed / raw
};

// =========================
// DOM 元素
// =========================

const elements = {
  inputText: document.getElementById("inputText"),
  platformSelect: document.getElementById("platformSelect"),
  segmentButtons: document.querySelectorAll(".segment-btn"),
  charCount: document.getElementById("charCount"),
  lineCount: document.getElementById("lineCount"),
  copyBtn: document.getElementById("copyBtn"),
  clearBtn: document.getElementById("clearBtn"),
  copyFeedback: document.getElementById("copyFeedback"),

  previewTitle: document.getElementById("previewTitle"),
  previewModeBadge: document.getElementById("previewModeBadge"),
  previewScreen: document.getElementById("previewScreen"),
  previewUsername: document.getElementById("previewUsername"),
  previewTime: document.getElementById("previewTime"),
  previewVerified: document.getElementById("previewVerified"),
  previewMeta: document.getElementById("previewMeta"),
  previewContent: document.getElementById("previewContent"),
  previewDot: document.getElementById("previewDot"),
  previewActions: document.getElementById("previewActions"),
  igTopBar: document.getElementById("igTopBar"),
};

// =========================
// 基礎工具
// =========================

function normalizeLineEndings(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderEmptyPreview() {
  return `<div id="previewContent" class="post-content is-empty">${DEFAULT_PREVIEW_TEXT}</div>`;
}

function splitIntoParagraphs(text) {
  const normalized = normalizeLineEndings(text);
  return normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n+$/g, ""))
    .filter((paragraph) => paragraph !== "");
}

function renderParagraphStyleContent(paragraphs) {
  const html = paragraphs
    .map((paragraph) => {
      const lines = paragraph
        .split("\n")
        .map((line) => `<span class="preview-line">${escapeHtml(line) || "&nbsp;"}</span>`)
        .join("");

      return `<p class="preview-paragraph">${lines}</p>`;
    })
    .join("");

  return `<div id="previewContent" class="post-content">${html}</div>`;
}

// =========================
// Threads 邏輯
// =========================

// 原始貼上：
// 1. 開頭空行無效
// 2. 空一行或空兩行以上，都一律視為分段
function normalizeThreadsRawText(text) {
  return normalizeLineEndings(text).replace(/^\n+/, "");
}

// 修正後：保留原始內容
function normalizeThreadsFixedText(text) {
  return normalizeLineEndings(text);
}

function renderThreadsPreview(text, mode) {
  if (mode === "fixed") {
    const normalized = normalizeThreadsFixedText(text);

    if (!normalized.trim() && !normalized.includes("\n")) {
      return renderEmptyPreview();
    }

    return `<div id="previewContent" class="post-content">${escapeHtml(normalized || ZERO_WIDTH_SPACE)}</div>`;
  }

  const normalized = normalizeThreadsRawText(text);

  if (!normalized.trim() && !normalized.includes("\n")) {
    return renderEmptyPreview();
  }

  const paragraphs = splitIntoParagraphs(normalized);

  if (paragraphs.length === 0) {
    return renderEmptyPreview();
  }

  return renderParagraphStyleContent(paragraphs);
}

function getThreadsCopyText(text, mode) {
  if (mode === "fixed") {
    const normalized = normalizeThreadsFixedText(text);
    return ZERO_WIDTH_SPACE + normalized.replace(/\n/g, "\n" + ZERO_WIDTH_SPACE);
  }

  return normalizeThreadsRawText(text);
}

// =========================
// Instagram 邏輯
// =========================

// 原始貼上：
// 1. 開頭空行不見
// 2. 可空一行，但不會空兩行以上
function normalizeInstagramRawText(text) {
  return normalizeLineEndings(text)
    .replace(/^\n+/, "")
    .replace(/\n{3,}/g, "\n\n");
}

// 修正後：保留原始內容
function normalizeInstagramFixedText(text) {
  return normalizeLineEndings(text);
}

function renderInstagramPreview(text, mode) {
  const normalized =
    mode === "fixed"
      ? normalizeInstagramFixedText(text)
      : normalizeInstagramRawText(text);

  if (!normalized.trim() && !normalized.includes("\n")) {
    return renderEmptyPreview();
  }

  return `<div id="previewContent" class="post-content">${escapeHtml(normalized || ZERO_WIDTH_SPACE)}</div>`;
}

function getInstagramCopyText(text, mode) {
  if (mode === "fixed") {
    const normalized = normalizeInstagramFixedText(text);
    return ZERO_WIDTH_SPACE + normalized.replace(/\n/g, "\n" + ZERO_WIDTH_SPACE);
  }

  return normalizeInstagramRawText(text);
}

// =========================
// Facebook 邏輯
// =========================

// 原始貼上：
// 1. 開頭空行不見
// 2. 不管空幾行，最後都只剩單純換行
function normalizeFacebookRawText(text) {
  return normalizeLineEndings(text)
    .replace(/^\n+/, "")
    .replace(/\n{2,}/g, "\n");
}

// 修正後：
// 1. 開頭空行仍先移除
// 2. 中間空行保留
function normalizeFacebookFixedText(text) {
  return normalizeLineEndings(text).replace(/^\n+/, "");
}

function renderFacebookPreview(text, mode) {
  const normalized =
    mode === "fixed"
      ? normalizeFacebookFixedText(text)
      : normalizeFacebookRawText(text);

  if (!normalized.trim() && !normalized.includes("\n")) {
    return renderEmptyPreview();
  }

  return `<div id="previewContent" class="post-content">${escapeHtml(normalized || ZERO_WIDTH_SPACE)}</div>`;
}

function getFacebookCopyText(text, mode) {
  if (mode === "fixed") {
    const normalized = normalizeFacebookFixedText(text);
    return normalized.replace(/\n/g, "\n" + ZERO_WIDTH_SPACE);
  }

  return normalizeFacebookRawText(text);
}

// =========================
// 平台設定
// =========================

const PLATFORM_CONFIG = {
  threads: {
    title: "Threads 換行效果",
    username: "evlearning.92",
    time: "2h",
    verified: true,
    metaText: "View all replies",
    screenClass: "platform-threads",
    renderPreview: renderThreadsPreview,
    getCopyText: getThreadsCopyText,
  },
  ig: {
    title: "Instagram 換行效果",
    username: "evlearning.92",
    time: "剛剛",
    verified: false,
    metaText: "",
    screenClass: "platform-ig",
    renderPreview: renderInstagramPreview,
    getCopyText: getInstagramCopyText,
  },
  fb: {
    title: "Facebook 換行效果",
    username: "evlearning.92",
    time: "剛剛",
    verified: false,
    metaText: "",
    screenClass: "platform-fb",
    renderPreview: renderFacebookPreview,
    getCopyText: getFacebookCopyText,
  },
};

// =========================
// UI 更新
// =========================

function updateStats(text) {
  const normalized = normalizeLineEndings(text);
  const characters = normalized.length;
  const lines = normalized === "" ? 1 : normalized.split("\n").length;

  elements.charCount.textContent = `字數 ${characters}`;
  elements.lineCount.textContent = `行數 ${lines}`;
}

function updatePreviewPlatform() {
  const config = PLATFORM_CONFIG[state.platform];

  elements.previewTitle.textContent = config.title;
  elements.previewUsername.textContent = config.username;
  elements.previewTime.textContent = config.time;
  elements.previewMeta.textContent = config.metaText;

  elements.previewVerified.style.display = config.verified ? "inline-flex" : "none";
  elements.previewDot.style.display = config.time ? "inline" : "none";

  Object.values(PLATFORM_CONFIG).forEach((platform) => {
    elements.previewScreen.classList.remove(platform.screenClass);
  });
  elements.previewScreen.classList.add(config.screenClass);

  elements.igTopBar.classList.toggle("is-hidden", state.platform !== "ig");

  if (state.platform === "fb") {
    elements.previewActions.innerHTML = FACEBOOK_ACTIONS_HTML;
  } else {
    elements.previewActions.innerHTML = DEFAULT_ACTIONS_HTML;
  }
}

function updateModeUI() {
  elements.segmentButtons.forEach((button) => {
    const isActive = button.dataset.pasteMode === state.pasteMode;
    button.classList.toggle("active", isActive);
  });

  elements.previewModeBadge.textContent =
    state.pasteMode === "fixed" ? "修正後效果" : "原始貼上效果";
}

function updatePreviewContent() {
  const rawText = elements.inputText.value;
  const config = PLATFORM_CONFIG[state.platform];
  const html = config.renderPreview(rawText, state.pasteMode);

  elements.previewContent.outerHTML = html;
  elements.previewContent = document.getElementById("previewContent");

  updateStats(rawText);
}

function updateAllUI() {
  updatePreviewPlatform();
  updateModeUI();
  updatePreviewContent();
}

// =========================
// 事件處理
// =========================

async function handleCopy() {
  const rawText = elements.inputText.value;
  const config = PLATFORM_CONFIG[state.platform];
  const processedText = config.getCopyText(rawText, state.pasteMode);

  if (!processedText.trim() && !processedText.includes("\n")) {
    elements.copyFeedback.textContent = "目前沒有可複製的內容";
    return;
  }

  try {
    await navigator.clipboard.writeText(processedText);
    elements.copyFeedback.textContent =
      state.pasteMode === "fixed"
        ? "已複製修正後版本"
        : "已複製原始貼上模擬版本";
  } catch (error) {
    elements.copyFeedback.textContent = "複製失敗，請手動複製";
  }
}

function handleClear() {
  elements.inputText.value = "";
  elements.copyFeedback.textContent = "";
  updatePreviewContent();
  elements.inputText.focus();
}

function handleInput() {
  elements.copyFeedback.textContent = "";
  updatePreviewContent();
}

function handlePlatformChange(event) {
  const nextPlatform = event.target.value;

  if (!PLATFORM_CONFIG[nextPlatform]) {
    return;
  }

  state.platform = nextPlatform;
  elements.copyFeedback.textContent = "";
  updateAllUI();
}

function handleModeChange(event) {
  const nextMode = event.currentTarget.dataset.pasteMode;

  if (!nextMode || nextMode === state.pasteMode) {
    return;
  }

  state.pasteMode = nextMode;
  elements.copyFeedback.textContent = "";
  updateAllUI();
}

// =========================
// 綁定事件
// =========================

function bindEvents() {
  elements.inputText.addEventListener("input", handleInput);
  elements.platformSelect.addEventListener("change", handlePlatformChange);
  elements.copyBtn.addEventListener("click", handleCopy);
  elements.clearBtn.addEventListener("click", handleClear);

  elements.segmentButtons.forEach((button) => {
    button.addEventListener("click", handleModeChange);
  });
}

// =========================
// 初始化
// =========================

function init() {
  bindEvents();
  updateAllUI();
}

init();