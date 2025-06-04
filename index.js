function createCarouselEntry({ name, alt, height, artSrc, artScale, artOffset }) {
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
  image.src = "student-sprites/" + artSrc;
  image.style.setProperty("--artScale", artScale);
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

  return entry;
}

const carousel = document.querySelector("#carousel");

for (student of students) {
  const c = createCarouselEntry(student);
  carousel.appendChild(c);
}