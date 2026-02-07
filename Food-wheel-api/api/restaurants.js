export default async function handler(req, res) {
  const { cuisines } = req.query;

  if (!cuisines) {
    return res.status(400).json({ error: "Missing cuisines" });
  }

  const response = await fetch(
    `https://api.yelp.com/v3/businesses/search?location=New York City&categories=${cuisines}&limit=20`,
    {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
    }
  );

  const data = await response.json();

  const restaurants = data.businesses.map((b) => ({
    name: b.name,
    rating: b.rating,
    url: b.url,
  }));

  res.status(200).json(restaurants);
}