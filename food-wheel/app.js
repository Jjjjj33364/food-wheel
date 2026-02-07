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

  const cuisines = checked.join(",");

  const res = await fetch(
    `https://YOUR-VERCEL-URL.vercel.app/api/restaurants?cuisines=${cuisines}`
  );

  restaurants = await res.json();

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
    ⭐ ${pick.rating}<br>
    <a href="${pick.url}" target="_blank">View on Yelp</a>
  `;
});