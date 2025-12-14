/* ======================================================
   CHIẾN BINH DU MỤC – STORY ENGINE
   Author: Zlatan Mode
   ====================================================== */

let currentIndex = 0;

const headerChapter = document.getElementById("headerChapter");
const chapterMeta   = document.getElementById("chapterMeta");
const chapterTitle  = document.getElementById("chapterTitle");
const chapterQuote  = document.getElementById("chapterQuote");
const storyArea     = document.getElementById("story");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

/* ================= UTILS ================= */

function clearStory() {
  storyArea.innerHTML = "";
}

function scrollBottom() {
  storyArea.scrollTop = storyArea.scrollHeight;
}

/* ================= TYPE EFFECT ================= */

function typeText(element, text, speed = 18, callback) {
  let i = 0;
  element.classList.add("typing");
  const timer = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    scrollBottom();
    if (i >= text.length) {
      clearInterval(timer);
      element.classList.remove("typing");
      if (callback) callback();
    }
  }, speed);
}

/* ================= RENDER BLOCKS ================= */

function renderNarrative(text, callback) {
  const block = document.createElement("div");
  block.className = "narrative";

  const p = document.createElement("p");
  block.appendChild(p);
  storyArea.appendChild(block);

  typeText(p, text.trim(), 14, callback);
}

function renderDialogue(who, text, callback) {
  const msg = document.createElement("div");
  msg.className = `dialogue ${who === "Z" ? "zlatan" : "system"}`;

  const sender = document.createElement("div");
  sender.className = "sender";
  sender.textContent = who === "Z" ? "CHIẾN BINH" : "HỆ THỐNG";

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  msg.appendChild(sender);
  msg.appendChild(bubble);
  storyArea.appendChild(msg);

  typeText(bubble, text, 20, callback);
}

/* ================= MAIN RENDER ================= */

function renderChapter(index) {
  const chapter = window.ZLATAN_CHAPTERS[index];
  if (!chapter) return;

  clearStory();

  headerChapter.textContent = `CHƯƠNG ${chapter.id}`;
  chapterTitle.textContent = chapter.title || "";
  chapterMeta.textContent =
    `${chapter.location || ""} ${chapter.time ? "• " + chapter.time : ""}`;
  chapterQuote.textContent = chapter.quote || "";

  let queue = [];

  if (chapter.narrative) {
    queue.push({ type: "narrative", text: chapter.narrative });
  }

  if (chapter.dialogue && chapter.dialogue.length) {
    chapter.dialogue.forEach(d => {
      queue.push({ type: "dialogue", who: d[0], text: d[1] });
    });
  }

  function nextBlock() {
    if (!queue.length) return;
    const block = queue.shift();

    if (block.type === "narrative") {
      renderNarrative(block.text, nextBlock);
    } else {
      renderDialogue(block.who, block.text, nextBlock);
    }
  }

  nextBlock();
  updateButtons();
}

/* ================= NAV ================= */

function updateButtons() {
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === window.ZLATAN_CHAPTERS.length - 1;
}

prevBtn.onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderChapter(currentIndex);
  }
};

nextBtn.onclick = () => {
  if (currentIndex < window.ZLATAN_CHAPTERS.length - 1) {
    currentIndex++;
    renderChapter(currentIndex);
  }
};

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  if (!window.ZLATAN_CHAPTERS || !window.ZLATAN_CHAPTERS.length) {
    storyArea.innerHTML =
      "<p style='opacity:.6'>Không tìm thấy dữ liệu chương.</p>";
    return;
  }
  renderChapter(currentIndex);
});
