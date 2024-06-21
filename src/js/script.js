const info = document.getElementById('info');
const title = document.getElementById('title');
const img = document.getElementById('image');
const volumeInner = document.getElementById('volume-inner-dropdown');
const progressBar = document.getElementById('audio-progress-control');
const audioMax = document.getElementById('audio-progress-value');
const btnTheme = document.getElementById('btn-theme');
const volumeSlider = document.getElementById("volume-control");
const root = document.documentElement;

if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'dark');

if (localStorage.getItem('theme') === "dark") {
    btnTheme.classList.add("bi-moon");
    root.style.setProperty("--bg-color", "#1A1818");
    root.style.setProperty("--text-color", "#ffffff");
    volumeInner.classList.add("dark");
    color = '#fff';
    colorClass = 'dark';
} else {
    btnTheme.classList.add("bi-sun");
    root.style.setProperty("--bg-color", "#ffffff");
    root.style.setProperty("--text-color", "#000000");
}

let audio = null;
let volume = 100;

async function audioLoad() {
    try {
        title.innerHTML = "";
        info.innerHTML = "";
        audio = new Audio("https://stream.gensokyoradio.net/3");
        audio.play();
        volumeSlider.value = volume;
        audioVolume(volume);
        audioProgress();
    } catch (err) {
        console.error(err);
        alert("An error has occurred while trying to play the audio.");
    }

    img.style.imageRendering = "pixelated";
    img.src = "./img/undefined.png";
    title.innerHTML = "loading...";
    info.innerHTML = "loading...";

    getCurrent();
};

audioLoad();

async function getCurrent() {
    const current = await (await fetch("https://gensokyoradio.net/api/station/playing/")).json();

    img.style.imageRendering = "auto";
    img.src = `https://gensokyoradio.net/images/albums/500/${current.MISC.ALBUMART}`;
    title.innerHTML = current.SONGINFO.TITLE;
    info.innerHTML = current.SONGINFO.ARTIST;
}

async function audioControl() {
    if (audio === null) return;

    const icon = document.getElementById("icon-control");

    if (audio.paused) {
        audio.play();
        icon.classList.remove("bi-play");
        icon.classList.add("bi-pause");
    } else {
        audio.pause();
        icon.classList.remove("bi-pause");
        icon.classList.add("bi-play");
    }
}

async function audioVolume(val) {
    if (audio === null) return;

    const sliderValue = document.getElementById("volume-value");

    audio.volume = val / 100;
    const valPercent = (volumeSlider.value / volumeSlider.max)*100;

    volumeSlider.value = valPercent;
    sliderValue.innerHTML = volumeSlider.value;
}

async function audioProgress() {
    if (audio === null) return;

    progressBar.disabled = true;

    await updateProgress();

    setInterval(async() => {
        progressBar.value++;

        if (progressBar.value === progressBar.max) {
            progressBar.value = 0;
            getCurrent();
            updateProgress();
        }
    }, 1000);
}

async function updateProgress() {
    const current = await (await fetch("https://gensokyoradio.net/api/station/playing/")).json();

    progressBar.max = current.SONGTIMES.DURATION;
    progressBar.value = current.SONGTIMES.PLAYED;

    audioMax.innerHTML = convertTime(current.SONGTIMES.DURATION);
}

function convertTime(seconds) {
    const minutes = Math.floor(seconds / 60);

    let remaining = seconds % 60;

    remaining = remaining.toString().padStart(2, '0');

    return `${minutes}:${remaining}`;
}

async function theme() {
    if (localStorage.getItem('theme') === "dark") {
        btnTheme.classList.remove("bi-moon");
        btnTheme.classList.add("bi-sun");
        root.style.setProperty("--bg-color", "#ffffff");
        root.style.setProperty("--text-color", "#000000");
        volumeInner.classList.remove("dark");
        localStorage.setItem("theme", "light");
    } else {
        btnTheme.classList.remove("bi-sun");
        btnTheme.classList.add("bi-moon");
        root.style.setProperty("--bg-color", "#1A1818");
        root.style.setProperty("--text-color", "#ffffff");
        volumeInner.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }
}