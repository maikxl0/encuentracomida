const COMMONS_API_URL = "https://commons.wikimedia.org/w/api.php";
const RANDOM_FOOD_CATEGORIES = [
  "Food",
  "Cuisine",
  "Meals",
  "Desserts",
  "Street food",
  "Fruit",
  "Vegetables",
  "Seafood",
  "Pasta",
  "Baked goods",
];

function stripHtml(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

function titleToAlt(title) {
  if (typeof title !== "string") {
    return "Comida";
  }

  const withoutPrefix = title.replace(/^File:/i, "");
  return withoutPrefix.replace(/\.[A-Za-z0-9]+$/, "").replace(/_/g, " ").trim() || "Comida";
}

async function fetchCommonsApi(params) {
  const url = new URL(COMMONS_API_URL);
  url.search = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    ...params,
  }).toString();

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Fallo la peticion de imagenes.");
  }

  const json = await response.json();
  if (json?.error) {
    throw new Error(json.error.info || "La API devolvio un error.");
  }

  return json;
}

function normalizePhoto(page) {
  const info = page?.imageinfo?.[0];
  if (!info || (typeof info.mime === "string" && !info.mime.startsWith("image/"))) {
    return null;
  }

  return {
    id: String(page.pageid),
    alt_description: titleToAlt(page.title),
    urls: {
      small: info.thumburl || info.url || "",
      regular: info.url || info.thumburl || "",
    },
    user: {
      name: stripHtml(info.extmetadata?.Artist?.value) || "Desconocido",
    },
    width: info.width || 0,
    height: info.height || 0,
  };
}

function normalizePagesToPhotos(pages) {
  const list = Object.values(pages || {});
  return list.map(normalizePhoto).filter(Boolean);
}

function pickRandom(items) {
  if (!items.length) {
    return null;
  }

  return items[Math.floor(Math.random() * items.length)];
}

async function fetchCategoryPhotos(category) {
  const data = await fetchCommonsApi({
    generator: "categorymembers",
    gcmtitle: `Category:${category}`,
    gcmnamespace: "6",
    gcmlimit: "50",
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "800",
  });

  return normalizePagesToPhotos(data?.query?.pages);
}

export async function searchFoodPhotos(query, page = 1, perPage = 20) {
  const limit = Math.max(1, Math.min(50, Number(perPage) || 20));
  const offset = Math.max(0, ((Number(page) || 1) - 1) * limit);
  const searchTerm = `${query} food`;

  const data = await fetchCommonsApi({
    generator: "search",
    gsrsearch: searchTerm,
    gsrnamespace: "6",
    gsrlimit: String(limit),
    gsroffset: String(offset),
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "800",
  });

  return {
    results: normalizePagesToPhotos(data?.query?.pages),
  };
}

export async function getRandomFoodPhoto() {
  const categories = [...RANDOM_FOOD_CATEGORIES].sort(() => Math.random() - 0.5);

  for (const category of categories) {
    const photos = await fetchCategoryPhotos(category);
    const randomPhoto = pickRandom(photos);
    if (randomPhoto?.id) {
      return randomPhoto;
    }
  }

  const fallback = await searchFoodPhotos("food", 1, 30);
  const fallbackPhoto = pickRandom(fallback.results || []);
  if (fallbackPhoto?.id) {
    return fallbackPhoto;
  }

  throw new Error("No encontre imagen aleatoria.");
}

export async function getFoodPhotoById(photoId) {
  const data = await fetchCommonsApi({
    pageids: String(photoId),
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "1200",
  });

  const page = data?.query?.pages?.[photoId];
  const photo = normalizePhoto(page);
  if (!photo?.urls?.regular) {
    throw new Error("Imagen no encontrada.");
  }

  return photo;
}
