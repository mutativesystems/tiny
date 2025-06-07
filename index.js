function createCarouselEntry({ name, alt, height, artSrc, artScale, artOffset, artShift }) {
  const surround = document.createElement("div");
  surround.className = "carousel-entry-surround";

  const entry = document.createElement("div");
  entry.className = "carousel-entry";

  const heightDiv = document.createElement("div");
  heightDiv.className = "student-height";
  heightDiv.textContent = height.toString();

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

window.addEventListener("load", () => {
  const url = new URL(window.location);
  const scrollLeft = parseInt(url.searchParams.get("scrl") || "0");

  for (student of students) {
    const c = createCarouselEntry(student);
    carousel.appendChild(c);
  }

  requestAnimationFrame(() => {
    carousel.scrollLeft = scrollLeft;
  });
});

let carouselScrollTimeout;

carousel.addEventListener("scroll", () => {
  clearTimeout(carouselScrollTimeout);
  carouselScrollTimeout = setTimeout(() => {
    const scrollLeft = carousel.scrollLeft;
    const url = new URL(window.location);
    url.searchParams.set("scrl", scrollLeft.toString());
    history.replaceState(null, '', url);
  }, 200);
});