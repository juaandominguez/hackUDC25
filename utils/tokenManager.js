let cachedToken = null;
let tokenExpirationTime = null;

import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

const TOKEN_EXPIRY_BUFFER = 300; // 5 minutes buffer to refresh token before it expires

// Function to get the token (caching it if it's still valid)
export const getToken = async () => {
  const now = Math.floor(Date.now() / 1000);

  // If the token is still valid, return the cached token
  if (
    cachedToken &&
    tokenExpirationTime &&
    now < tokenExpirationTime - TOKEN_EXPIRY_BUFFER
  ) {
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
  const CLIENT_ID = process.env.INDITEX_CLIENT_ID;
  const CLIENT_SECRET = process.env.INDITEX_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error(
      "Missing CLIENT_ID or CLIENT_SECRET in environment variables"
    );
  }

  const curlCommand = `curl -s -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36" -X POST -u "${CLIENT_ID}:${CLIENT_SECRET}" -d "grant_type=client_credentials&scope=technology.catalog.read" https://auth.inditex.com:443/openam/oauth2/itxid/itxidmp/access_token`;

  try {
    const { stdout, stderr } = await execPromise(curlCommand);
    if (stderr && stderr.trim() !== "") {
      console.error("Stderr output:", stderr);
      throw new Error(`Curl error in auth: ${stderr}`);
    }
    const data = JSON.parse(stdout);
    return {
      token: data.id_token,
      expires_in: data.expires_in,
    };
  } catch (error) {
    console.error("Full error:", error);
    throw new Error(`Token request failed: ${error.message}`);
  }
};

// Function to fetch product data from the Inditex API using the token
export const fetchProductData = async (query) => {
  const token = await getToken();

  const encodedQuery = encodeURIComponent(query);
  const curlCommand = `curl -s -A "Mozilla/5.0" -X GET \
    "${process.env.PUBLIC_INDITEX_URL}/searchpmpa/products?query=${encodedQuery}" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json"`;

  try {
    const { stdout, stderr } = await execPromise(curlCommand);
    if (stderr && stderr.trim() !== "") {
      throw new Error(`Curl error: ${stderr}`);
    }
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(`API request failed: ${error.message}`);
  }
};

// Add new function to make authenticated API requests
export const makeAuthenticatedRequest = async (
  endpoint,
  method = "GET",
  query = ""
) => {
  const token = await getToken();

  let url = endpoint;
  if (query) {
    url += `?${query}`;
  }

  const curlCommand = `curl -s -A "Mozilla/5.0" -X ${method} \
    "${url}" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" \
    -H "User-Agent: postman/1.0" `;

  try {
    const { stdout, stderr } = await execPromise(curlCommand);
    if (stderr && stderr.trim() !== "") {
      throw new Error(`Curl error: ${stderr}`);
    }
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(`API request failed: ${error.message}`);
  }
};
