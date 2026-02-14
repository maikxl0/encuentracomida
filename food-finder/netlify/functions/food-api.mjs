const UNSPLASH_API_BASE_URL = "https://api.unsplash.com";

function getApiKey() {
  return process.env.UNSPLASH_ACCESS_KEY || "";
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

export async function handler(event) {
  const endpoint = event.queryStringParameters?.endpoint;

  if (!endpoint || typeof endpoint !== "string") {
    return json(400, { error: "Falta el endpoint." });
  }

  if (!endpoint.startsWith("/") || endpoint.includes("://") || endpoint.startsWith("//")) {
    return json(400, { error: "Endpoint invalido." });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return json(500, { error: "UNSPLASH_ACCESS_KEY no esta configurada." });
  }

  try {
    const upstreamResponse = await fetch(`${UNSPLASH_API_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Client-ID ${apiKey}`,
        "Accept-Version": "v1",
      },
    });

    const responseBody = await upstreamResponse.text();
    return {
      statusCode: upstreamResponse.status,
      headers: {
        "Content-Type": upstreamResponse.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
      body: responseBody,
    };
  } catch {
    return json(502, { error: "No se pudo conectar con Unsplash." });
  }
}
