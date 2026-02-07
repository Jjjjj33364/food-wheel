const generateBtn = document.getElementById("generate");
const spinBtn = document.getElementById("spin");
const result = document.getElementById("result");

let restaurants = [];

generateBtn.addEventListener("click", async () => {
  const checked = [...document.querySelectorAll("input:checked")].map(
    (c) => c.value
  );

  if (checked.length === 0) {
    alert("Select at least one cuisine!");
    return;
  }

  restaurants = [];

  for (const cuisine of checked) {
    const query = `
      [out:json];
      area["name"="New York"]->.searchArea;
      (
        node["amenity"="restaurant"]["cuisine"~"${cuisine}", i](area.searchArea);
      );
      out;
    `;

    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });

    const data = await res.json();

    const places = data.elements.map((el) => ({
      name: el.tags.name || "Unknown",
      lat: el.lat,
      lon: el.lon,
    }));

    restaurants.push(...places);
  }

  alert(`Loaded ${restaurants.length} restaurants`);
});

spinBtn.addEventListener("click", () => {
  if (restaurants.length === 0) {
    alert("Load restaurants first!");
    return;
  }

  const pick = restaurants[Math.floor(Math.random() * restaurants.length)];

  result.innerHTML = `
    Winner: <strong>${pick.name}</strong><br>
    <a href="https://www.openstreetmap.org/?mlat=${pick.lat}&mlon=${pick.lon}" target="_blank">
      View on map
    </a>
  `;
});