feather.replace();

let level = localStorage.getItem("level") || .5;

const cover = document.getElementById("cover");
const title = document.getElementById("title");
const author = document.getElementById("author");
const progress = document.getElementById("progress");

const audio = new Audio("https://stream.gensokyoradio.net/3");

audio.play();

audio.volume = level;

async function getCurrent() {
    const current = await (await fetch("https://gensokyoradio.net/api/station/playing")).json();

    return current;
}

let time = {
    duration: null,
    played: null
}

async function setSong() {
    const song = await getCurrent();

    cover.src = song.MISC.ALBUMART ? `https://gensokyoradio.net/images/albums/500/${song.MISC.ALBUMART}` : "./img/undefined.png";
    title.innerText = song.SONGINFO.TITLE;
    author.innerText = song.SONGINFO.ARTIST;

    progress.style.width = `${song.SONGTIMES.PLAYED / song.SONGTIMES.DURATION * 100}%`;

    time.duration = song.SONGTIMES.DURATION;
    time.played = song.SONGTIMES.PLAYED;
}

setSong();

setInterval(async () => {
    time.played++;

    progress.style.width = `${time.played / time.duration * 100}%`;

    if (time.played >= time.duration) await setSong();
}, 1000);

const control = document.getElementById("control");
const volume = document.getElementById("volume");
const theme = document.getElementById("theme");

volume.addEventListener("click", () => {
    openModal("modal");
});

control.addEventListener("click", () => {
    if (audio.volume === 0) {
        control.innerHTML = `<i data-feather="pause"></i>`;
        audio.volume = level;
    } else {
        control.innerHTML = `<i data-feather="play"></i>`;
        audio.volume = 0;
    }

    feather.replace();
});

let style = localStorage.getItem("style") || "dark";
theme.addEventListener("click", () => {
    const root = document.documentElement;

    if (style === "light") {
        root.style.setProperty("--background-color", "#26292a");
        root.style.setProperty("--forground-color", "#1e2122");
        root.style.setProperty("--text-color", "#ffffff");
        root.style.setProperty("--progress-bg", "#cccccc50");
        root.style.setProperty("--progress-fg", "#eeeeee");

        theme.innerHTML = `<i data-feather="moon"></i>`;
        style = "dark";

        localStorage.setItem("style", "dark");
    } else {
        root.style.setProperty("--background-color", "#ffffff");
        root.style.setProperty("--forground-color", "#cccccc");
        root.style.setProperty("--text-color", "#000000");
        root.style.setProperty("--progress-bg", "#24242450");
        root.style.setProperty("--progress-fg", "#000000");

        theme.innerHTML = `<i data-feather="sun"></i>`;
        style = "light";

        localStorage.setItem("style", "light");
    }

    feather.replace();
});

const modal = document.getElementById("modal");

modal.addEventListener("click", (event) => event.target === modal ? closeModal("modal") : null);

document.addEventListener("keydown", (event) => event.key === "Escape" ? closeModal("modal") : null);

const range = document.getElementById("range");

range.value = level * 100;

range.addEventListener("change", (event) => {
    level = range.value / 100;

    audio.volume = level;

    localStorage.setItem("level", level);
});