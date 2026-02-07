const generateBtn = document.getElementById("generate");
const spinBtn = document.getElementById("spin");
const result = document.getElementById("result");

let restaurants = [];

generateBtn.addEventListener("click", async () => {
  const checked = [...document.querySelectorAll("input:checked")].map(
    (c) => c.value.toLowerCase()
  );

  if (checked.length === 0) {
    alert("Select at least one cuisine!");
    return;
  }

  restaurants = [];

  // Overpass query for ALL restaurants in NYC
  const query = `
    [out:json][timeout:25];
    area["name"="New York"]["admin_level"="4"]->.searchArea;
    (
      node["amenity"="restaurant"](area.searchArea);
      way["amenity"="restaurant"](area.searchArea);
      relation["amenity"="restaurant"](area.searchArea);
    );
    out center;
  `;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });

    const data = await res.json();

    // Filter by cuisine manually
    data.elements.forEach((el) => {
      if (!el.tags || !el.tags.name) return;

      const cuisineTag = (el.tags.cuisine || "").toLowerCase();

      // Check if any selected cuisine matches
      if (checked.some((c) => cuisineTag.includes(c))) {
        restaurants.push({
          name: el.tags.name,
          lat: el.lat || el.center?.lat,
          lon: el.lon || el.center?.lon,
        });
      }
    });

    console.log("Restaurants loaded:", restaurants);
    alert(`Loaded ${restaurants.length} restaurants`);
  } catch (err) {
    console.error(err);
    alert("Error loading restaurants. Try again later.");
  }
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