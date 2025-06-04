function createCarouselEntry(nameText, heightInt) {
  const entry = document.createElement("div");
  entry.className = "carousel-entry";

  const heightDiv = document.createElement("div");
  heightDiv.className = "student-height";
  heightDiv.textContent = heightInt.toString();

  const nameDiv = document.createElement("div");
  nameDiv.className = "student-name";
  nameDiv.textContent = nameText;

  const fillDiv = document.createElement("div");
  fillDiv.className = "height-fill";
  fillDiv.style.height = `${Math.round(480 * heightInt / 230)}px`;

  const image = document.createElement("img");

  entry.appendChild(nameDiv);
  entry.appendChild(heightDiv);
  entry.appendChild(fillDiv);

  return entry;
}

const carousel = document.querySelector("#carousel");

for (student of students) {
  const c = createCarouselEntry(student.name, student.height);
  carousel.appendChild(c);
}