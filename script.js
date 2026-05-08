const copyButton = document.querySelector("[data-copy-target]");
const copyStatus = document.querySelector(".copy-status");

function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.top = "-1000px";
  document.body.appendChild(textArea);
  textArea.select();

  const copied = document.execCommand("copy");
  textArea.remove();
  return copied;
}

async function copyCitation() {
  if (!copyButton) return;

  const targetId = copyButton.getAttribute("data-copy-target");
  const target = targetId ? document.getElementById(targetId) : null;
  const text = target?.innerText.trim();

  if (!text) return;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else if (!fallbackCopy(text)) {
      throw new Error("Clipboard copy failed");
    }
    copyStatus.textContent = "BibTeX copied.";
    window.setTimeout(() => {
      copyStatus.textContent = "";
    }, 2200);
  } catch {
    copyStatus.textContent = fallbackCopy(text)
      ? "BibTeX copied."
      : "Select the BibTeX text and copy it manually.";
  }
}

copyButton?.addEventListener("click", copyCitation);
