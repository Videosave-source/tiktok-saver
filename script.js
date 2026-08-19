const API_URL = "PASTE_YOUR_API_ENDPOINT_HERE";

const urlInput = document.getElementById("tiktokUrl");
const downloadBtn = document.getElementById("downloadBtn");
const pasteBtn = document.getElementById("pasteBtn");

const message = document.getElementById("message");
const resultSection = document.getElementById("resultSection");
const videoPreview = document.getElementById("videoPreview");
const saveBtn = document.getElementById("saveBtn");


function showMessage(text) {
  message.textContent = text;
}


function isTikTokUrl(url) {

  try {

    const parsed = new URL(url);

    return (
      parsed.hostname.includes("tiktok.com") ||
      parsed.hostname.includes("vm.tiktok.com")
    );

  } catch {

    return false;

  }

}


pasteBtn.addEventListener("click", async () => {

  try {

    const text = await navigator.clipboard.readText();

    urlInput.value = text;

    showMessage("");

  } catch {

    showMessage(
      "Please paste the TikTok link manually."
    );

  }

});


downloadBtn.addEventListener("click", async () => {

  const url = urlInput.value.trim();

  showMessage("");

  resultSection.classList.add("hidden");


  if (!url) {

    showMessage(
      "Please enter a TikTok video URL."
    );

    return;

  }


  if (!isTikTokUrl(url)) {

    showMessage(
      "Please enter a valid TikTok URL."
    );

    return;

  }


  if (
    !API_URL ||
    API_URL === "PASTE_YOUR_API_ENDPOINT_HERE"
  ) {

    showMessage(
      "Downloader API belum dipasang."
    );

    return;

  }


  try {

    downloadBtn.disabled = true;

    downloadBtn.textContent = "Processing...";


    const response = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        url: url
      })

    });


    if (!response.ok) {

      throw new Error(
        "Server error"
      );

    }


    const data = await response.json();


    if (
      !data.success ||
      !data.video_url
    ) {

      throw new Error(
        data.message ||
        "Video could not be processed."
      );

    }


    videoPreview.src = data.video_url;

    saveBtn.href = data.video_url;

    resultSection.classList.remove("hidden");


    resultSection.scrollIntoView({
      behavior: "smooth"
    });


  } catch (error) {

    console.error(error);

    showMessage(
      "Gagal memproses video. Silakan coba lagi."
    );

  } finally {

    downloadBtn.disabled = false;

    downloadBtn.innerHTML =
      "↓ Download Video";

  }

});


urlInput.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Enter") {

      downloadBtn.click();

    }

  }
);
