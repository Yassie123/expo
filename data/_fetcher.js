export const API_URL = "https://orka-autowas.onrender.com/api"; // base API

const fetcher = async (url, options = {}) => {
  // Use full URL if provided, otherwise append relative path to API_URL
  const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}`;
  console.log("📡 Fetching:", fullUrl);
  console.log("📤 Request body:", options.body); // Add this to see what you're sending

  try {
    const res = await fetch(fullUrl, options);

    const text = await res.text();
    console.log("📥 Response status:", res.status); // Add this
    console.log("📥 Response body:", text); // Add this

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      throw new Error(`Invalid JSON from ${fullUrl}: ${text}`);
    }

    if (!res.ok) {
      // Improved error message
      const errorMsg = data?.message || data?.error || `HTTP ${res.status}: ${text}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error("❌ Fetch error:", err);
    throw err;
  }
};

export default fetcher;