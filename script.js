function detectTheme(imgUrl) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imgUrl;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const size = 8;
    canvas.width = size;
    canvas.height = size;

    ctx.drawImage(
      img,
      img.width / 2 - size / 2,
      img.height / 2 - size / 2,
      size,
      size,
      0,
      0,
      size,
      size
    );

    const data = ctx.getImageData(0, 0, size, size).data;

    let brightness = 0;
    let pixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      brightness +=
        0.299 * data[i] +
        0.587 * data[i + 1] +
        0.114 * data[i + 2];
      pixels++;
    }

    brightness /= pixels;

    if (brightness > 140) {
      setthemedark();
    } else {
      setthemelight();
    }
  };
}

function setthemedark() {
  document.documentElement.style.setProperty("--ui-bg", "rgba(0, 0, 0, 0.65)");
  document.documentElement.style.setProperty("--ui-text", "#ffffff");
}

function setthemelight() {
  document.documentElement.style.setProperty("--ui-bg", "rgba(255, 255, 255, 0.55)");
  document.documentElement.style.setProperty("--ui-text", "#000000");
}

detectTheme("background.png");

function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  document.getElementById("time").textContent = `${hours}:${minutes}`;
}

updateTime();
setInterval(updateTime, 1000);

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("todo-query");
  const list = document.getElementById("todo-itemlist");

  function saveList() {
    const items = [...list.querySelectorAll("li")].map(li => ({
      text: li.querySelector(".todo-text").textContent,
      checked: li.classList.contains("checked")
    }));
    localStorage.setItem("todo-list", JSON.stringify(items));
  }

  function loadList() {
    const saved = localStorage.getItem("todo-list");
    if (!saved) return;

    const items = JSON.parse(saved);
    list.innerHTML = "";

    items.forEach(item => {
      const li = document.createElement("li");
      if (item.checked) li.classList.add("checked");

      const span = document.createElement("span");
      span.className = "todo-text";
      span.textContent = item.text;

      const button = document.createElement("button");
      button.className = "close-btn";
      button.innerHTML = '<span class="close-btn-icon">✕</span>';

      button.addEventListener("click", () => {
        li.remove();
        saveList();
      });

      li.addEventListener("click", e => {
        if (!e.target.closest(".close-btn")) {
          li.classList.toggle("checked");
          saveList();
        }
      });

      li.appendChild(span);
      li.appendChild(button);
      list.appendChild(li);
    });
  }

  function newElement() {
    const value = input.value.trim();
    if (!value) {
      alert("You must write something");
      return;
    }

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = value;

    const button = document.createElement("button");
    button.className = "close-btn";
    button.innerHTML = '<span class="close-btn-icon">✕</span>';

    button.addEventListener("click", () => {
      li.remove();
      saveList();
    });

    li.addEventListener("click", e => {
      if (!e.target.closest(".close-btn")) {
        li.classList.toggle("checked");
        saveList();
      }
    });

    li.appendChild(span);
    li.appendChild(button);
    list.appendChild(li);

    input.value = "";
    saveList();
  }

  document.getElementById("add-btn").addEventListener("click", newElement);

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      newElement();
    }
  });

  loadList();
});

document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("search").value;
  if (query) {
    window.location.href =
      "https://www.google.com/search?q=" + encodeURIComponent(query);
  } else {
    alert("empty search query, please enter something!");
  }
});

document.getElementById("search").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    const query = e.target.value;
    if (query) {
      window.location.href =
        "https://www.google.com/search?q=" + encodeURIComponent(query);
    } else {
      alert("empty search query, please enter something!");
    }
  }
});

document
  .getElementById("settings-btn")
  .addEventListener("click", togglesettingsview);

function togglesettingsview() {
  document.getElementById("settings-pnl").classList.toggle("open");
  document.getElementById("settings-btn").classList.toggle("active");
}
