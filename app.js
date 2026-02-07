const generateBtn = document.getElementById("generate");
const spinBtn = document.getElementById("spin");
const result = document.getElementById("result");

let restaurants = [];

generateBtn.addEventListener("click", async () => {
  const checked = [...document.querySelectorAll("input:checked")].map(c => c.value.toLowerCase());

  if (checked.length === 0) {
    alert("Select at least one cuisine!");
    return;
  }

  try {
    // Load local JSON
    const res = await fetch("restaurants.json");
    const data = await res.json();

    // Filter by selected cuisines
    restaurants = data.filter(r => checked.includes(r.cuisine.toLowerCase()));

    alert(`Loaded ${restaurants.length} restaurants`);
  } catch (err) {
    console.error(err);
    alert("Failed to load restaurants.");
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