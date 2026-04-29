function convertCmToFeetInches(cm) {
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return { feet, inches };
}

function createCarouselEntry({ name, alt, height, heightOverride, artSrc, artScale, artOffset, artShift }) {
  const surround = document.createElement("div");
  surround.className = "carousel-entry-surround";

  const entry = document.createElement("div");
  entry.className = "carousel-entry";

  const metricHeightDiv = document.createElement("div");
  metricHeightDiv.classList.add("student-height");
  metricHeightDiv.classList.add("student-height-metric");
  metricHeightDiv.textContent = heightOverride || height.toString();

  const imperialHeightDiv = document.createElement("div");
  imperialHeightDiv.classList.add("student-height");
  imperialHeightDiv.classList.add("student-height-imperial");
  if (heightOverride === undefined) {
    const { feet, inches } = convertCmToFeetInches(height);
    imperialHeightDiv.textContent = `${feet}'${inches}"`;
  } else {
    imperialHeightDiv.textContent = heightOverride;
  }

  const nameDiv = document.createElement("div");
  nameDiv.className = "student-name";
  nameDiv.textContent = name;

  const fillDiv = document.createElement("div");
  fillDiv.className = "height-fill";
  fillDiv.style.height = `${Math.round(480 * height / 230)}px`;

  const image = document.createElement("img");
  image.className = "student-artwork";
  image.src = "student-sprites/" + artSrc + "_00.png";
  image.style.setProperty("--artScale", artScale);
  if (artShift !== undefined) {
    image.style.setProperty("--artShift", `${artShift}px`);
  }
  image.style.setProperty("--artOffset", artOffset);
  image.style.setProperty("--height", height);

  fillDiv.appendChild(image);

  entry.appendChild(nameDiv);

  if (alt !== undefined) {
    const altDiv = document.createElement("div");
    altDiv.className = "student-alt-name";
    altDiv.textContent = `(${alt})`;
    entry.appendChild(altDiv);
  }

  entry.appendChild(metricHeightDiv);
  entry.appendChild(imperialHeightDiv);
  entry.appendChild(fillDiv);

  surround.appendChild(entry);

  return surround;
}

const carousel = document.querySelector("#carousel");
let carouselScrollTimeout;

let scrollVelocity = 0;
const easingCap = 3.2;
const velocityStep = 12;
let velocityStepping = 1;
let lastFrameTime = null;
let animationFrameId = null;

function smoothScrollStep(timestamp) {
  if (lastFrameTime === null) lastFrameTime = timestamp;

  if (Math.abs(scrollVelocity) >= 0.5) {
    const actualScrollAmount = Math.pow(0.5 * velocityStepping, 0.5) * 2.7 * velocityStep;
    if (scrollVelocity > easingCap) {
      carousel.scrollLeft += actualScrollAmount;
    } else if (scrollVelocity < -easingCap) {
      carousel.scrollLeft -= actualScrollAmount;
    } else {
      carousel.scrollLeft += scrollVelocity;
      velocityStepping = 1;
    }

    scrollVelocity *= 0.6;
    animationFrameId = requestAnimationFrame(smoothScrollStep);
  } else {
    scrollVelocity = 0;
    lastFrameTime = null;
    animationFrameId = null;
    velocityStepping = 1;
  }

  // updateScrollParam();
}

carousel.addEventListener("wheel", (event) => {
  if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) return;

  event.preventDefault();
  scrollVelocity += event.deltaY;

  if (animationFrameId === null) {
    requestAnimationFrame(smoothScrollStep);
  } else {
    velocityStepping += Math.abs(event.deltaY * 0.01);
  }
});

// ?scrl=... is disabled until I implement a better solution.

// function updateScrollParam() {
//   clearTimeout(carouselScrollTimeout);
//   carouselScrollTimeout = setTimeout(() => {
//     const scrollLeft = Math.round(carousel.scrollLeft);
//     const url = new URL(window.location);
//     url.searchParams.set("scrl", scrollLeft.toString());
//     history.replaceState(null, '', url);
//   }, 50);
// }

function getFilteredSortedStudents() {
  const query = document.getElementById("search-input").value.toLowerCase().trim();
  const sortOrder = document.getElementById("sort-select").value;
  const showBase = document.getElementById("filter-base").checked;
  const showAlts = document.getElementById("filter-alts").checked;

  let filtered = students.filter((s) => {
    const isAlt = s.alt !== undefined;
    if (isAlt && !showAlts) return false;
    if (!isAlt && !showBase) return false;

    if (query) {
      const nameMatch = s.name.toLowerCase().includes(query);
      const altMatch = s.alt && s.alt.toLowerCase().includes(query);
      if (!nameMatch && !altMatch) return false;
    }

    return true;
  });

  filtered.sort((a, b) => {
    switch (sortOrder) {
      case "height-asc":
        return a.height - b.height;
      case "height-desc":
        return b.height - a.height;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  return filtered;
}

function renderEntries() {
  carousel.innerHTML = "";
  const filtered = getFilteredSortedStudents();

  carousel.replaceChildren(...
    filtered.map(student => {
      let c = student.cachedDOM;
      if (!c) {
        c = createCarouselEntry(student);
        student.cachedDOM = c;
      }
      return c;
    })
  );
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.activeElement === document.getElementById("search-input")) {
    document.getElementById("search-input").blur();
  } else if ((event.ctrlKey || event.metaKey) && event.key === "f") {
    event.preventDefault();
    document.getElementById("search-input").focus();
  }
});

function updateUnitVisibility() {
  const unitSelect = document.getElementById("unit-select");
  const carousel = document.getElementById("carousel");
  carousel.classList.remove("show-metric", "show-imperial");
  carousel.classList.add(`show-${unitSelect.value}`);
}

window.addEventListener("load", () => {
  const url = new URL(window.location);
  // const scrollLeft = parseInt(url.searchParams.get("scrl") || "0");

  document.getElementById("search-input").addEventListener("input", renderEntries);
  document.getElementById("sort-select").addEventListener("change", renderEntries);
  document.getElementById("filter-base").addEventListener("change", renderEntries);
  document.getElementById("filter-alts").addEventListener("change", renderEntries);
  document.getElementById("unit-select").addEventListener("change", updateUnitVisibility);

  updateUnitVisibility();
  renderEntries();

  // carousel.scrollLeft = scrollLeft;
});

// carousel.addEventListener("scroll", updateScrollParam);
