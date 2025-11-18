export const API_URL = "https://orka-autowas.onrender.com/api";

const fetcher = async (url: string, options: RequestInit = {}) => {
  const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}`;
  console.log("📡 Fetching:", fullUrl);

  try {
    const res = await fetch(fullUrl, options);

    const text = await res.text(); // read response once
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Invalid JSON from ${fullUrl}: ${text}`);
    }

    if (!res.ok) throw new Error(data?.message || `HTTP error ${res.status}`);
    return data;
  } catch (err) {
    console.error("❌ Fetch error:", err);
    throw err;
  }
};


export default fetcher;
