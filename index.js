function createCarouselEntry({ name, height, artworkSrc, artworkScaling }) {
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
  image.src = artworkSrc;
  image.style.height = `${Math.round(480 * height * artworkScaling / 230)}px`;

  fillDiv.appendChild(image);

  entry.appendChild(nameDiv);
  entry.appendChild(heightDiv);
  entry.appendChild(fillDiv);

  return entry;
}

const carousel = document.querySelector("#carousel");

for (student of students) {
  const c = createCarouselEntry(student);
  carousel.appendChild(c);
}