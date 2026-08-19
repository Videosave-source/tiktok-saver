const API_BASE = "https://api.azbry.com/api/download/tiktok";

const urlInput = document.getElementById("tiktokUrl");
const downloadBtn = document.getElementById("downloadBtn");
const pasteBtn = document.getElementById("pasteBtn");

const message = document.getElementById("message");
const resultSection = document.getElementById("resultSection");
const videoPreview = document.getElementById("videoPreview");
const saveBtn = document.getElementById("saveBtn");

let currentVideoUrl = "";

function showMessage(text) {
  if (message) {
    message.textContent = text;
  }
}

function isTikTokUrl(url) {
  try {
    const parsed = new URL(url);

    return (
      parsed.hostname.includes("tiktok.com") ||
      parsed.hostname.includes("vm.tiktok.com") ||
      parsed.hostname.includes("vt.tiktok.com")
    );
  } catch {
    return false;
  }
}

function findVideoUrl(data) {
  const possibleUrls = [
    data?.result?.download?.nowm,
    data?.result?.download,
    data?.result?.video,
    data?.result?.video_url,
    data?.result?.play,
    data?.result?.nowm,
    data?.download?.nowm,
    data?.download,
    data?.video,
    data?.video_url,
    data?.url
  ];

  return possibleUrls.find(
    (url) => typeof url === "string" && url.startsWith("http")
  ) || "";
}

function getTitle(data) {
  return (
    data?.result?.title ||
    data?.result?.desc ||
    data?.title ||
    "Video TikTok"
  );
}

async function downloadTikTok() {
  const url = urlInput?.value.trim();

  if (!url) {
    showMessage("Tempel URL TikTok terlebih dahulu.");
    return;
  }

  if (!isTikTokUrl(url)) {
    showMessage("URL yang dimasukkan bukan URL TikTok.");
    return;
  }

  showMessage("⏳ Sedang mengambil video...");
  currentVideoUrl = "";

  if (resultSection) {
    resultSection.style.display = "none";
  }

  try {
    const apiUrl = `${API_BASE}?url=${encodeURIComponent(url)}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.status === false || data.success === false) {
      throw new Error(
        data.message ||
        data.error ||
        "API gagal mengambil video."
      );
    }

    const videoUrl = findVideoUrl(data);

    if (!videoUrl) {
      console.log("Respons API:", data);
      throw new Error(
        "Video berhasil ditemukan, tetapi URL download tidak ditemukan."
      );
    }

    currentVideoUrl = videoUrl;

    if (videoPreview) {
      videoPreview.src = videoUrl;
      videoPreview.style.display = "block";
    }

    if (resultSection) {
      resultSection.style.display = "block";
    }

    showMessage(`✅ ${getTitle(data)}`);

  } catch (error) {
    console.error(error);
    showMessage(
      "❌ Gagal mengambil video. Coba URL TikTok lain."
    );
  }
}

pasteBtn?.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();

    if (text) {
      urlInput.value = text;
      showMessage("URL berhasil ditempel.");
    }
  } catch {
    showMessage("Tidak bisa membaca clipboard. Silakan tempel URL secara manual.");
  }
});

downloadBtn?.addEventListener("click", downloadTikTok);

saveBtn?.addEventListener("click", () => {
  if (!currentVideoUrl) {
    showMessage("Belum ada video yang siap diunduh.");
    return;
  }

  const link = document.createElement("a");
  link.href = currentVideoUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.download = "videosave.mp4";

  document.body.appendChild(link);
  link.click();
  link.remove();
});
