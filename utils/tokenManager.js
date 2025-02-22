let cachedToken = null;
let tokenExpirationTime = null;

const TOKEN_EXPIRY_BUFFER = 300; // 5 minutes buffer to refresh token before it expires

// Function to get the token (caching it if it's still valid)
export const getToken = async () => {
  const now = Math.floor(Date.now() / 1000);

  // If the token is still valid, return the cached token
  if (cachedToken && tokenExpirationTime && now < tokenExpirationTime - TOKEN_EXPIRY_BUFFER) {
    return cachedToken;
  }

  try {
    // Otherwise, fetch a new token
    const newToken = await fetchNewToken();
    cachedToken = newToken.token;
    tokenExpirationTime = now + newToken.expires_in; // Set the expiration time
    return cachedToken;
  } catch (error) {
    console.error("Failed to fetch a new token:", error);
    throw new Error("Authentication failed");
  }
};

// Function to request a new token using client credentials
const fetchNewToken = async () => {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Missing CLIENT_ID or CLIENT_SECRET in environment variables");
  }

  // Request the OAuth2 token
  const response = await fetch(
    "https://auth.inditex.com:443/openam/oauth2/itxid/itxidmp/sandbox/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Ensure proper format
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    token: data.access_token,
    expires_in: data.expires_in,
  };
};

// Function to fetch product data from the Inditex API using the token
export const fetchProductData = async (query) => {
  const token = await getToken(); // Get the token (fresh if expired)

  // Prepare the API request URL with the search query
  const url = `https://api-sandbox.inditex.com/searchpmpa-sandbox/products?query=${encodeURIComponent(query)}`;

  // Perform the API call using the token in the Authorization header
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`, // Add the Bearer token to the request header
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  // Parse and return the JSON data from the response
  const data = await response.json();
  return data;
};
