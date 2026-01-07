function createCarouselEntry({ name, alt, height, heightOverride, artSrc, artScale, artOffset, artShift }) {
  const surround = document.createElement("div");
  surround.className = "carousel-entry-surround";

  const entry = document.createElement("div");
  entry.className = "carousel-entry";

  const heightDiv = document.createElement("div");
  heightDiv.className = "student-height";
  heightDiv.textContent = heightOverride || height.toString();

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

  entry.appendChild(heightDiv);
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

window.addEventListener("load", () => {
  const url = new URL(window.location);
  // const scrollLeft = parseInt(url.searchParams.get("scrl") || "0");

  for (const student of students) {
    const c = createCarouselEntry(student);
    carousel.appendChild(c);
  }

  // carousel.scrollLeft = scrollLeft;
});

// carousel.addEventListener("scroll", updateScrollParam);
