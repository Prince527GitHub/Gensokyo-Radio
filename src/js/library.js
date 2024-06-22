function createRipple(event) {
    const button = event.currentTarget;

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.offsetX - radius}px`;
    circle.style.top = `${event.offsetY - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.querySelector(".ripple");
    if (ripple) ripple.remove();

    button.appendChild(circle);
}

const buttons = document.querySelectorAll("button[data-ripple]");
for (const button of buttons) {
    if (!button.classList.contains("tooltip")) button.addEventListener("click", createRipple);
}

const openModalButtons = document.querySelectorAll("button[data-modal]")
for (const button of openModalButtons) {
    button.addEventListener("click", () => {
        const id = button.getAttribute("data-modal");
        openModal(id);
    });
}

const closeButtons = document.querySelectorAll(".close-btn");
for (const button of closeButtons) {
    button.addEventListener("click", () => {
        const id = button.getAttribute("data-modal");
        closeModal(id);
    });
}

function closeModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = "none";
}

function openModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = "block";
}