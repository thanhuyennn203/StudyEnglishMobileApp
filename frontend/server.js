const API_URL = "http://10.60.1.208:5130"; // Your backend IP

export const getData = async () => {
  try {
    const res = await fetch(`${API_URL}/api/getWords`);
    const json = await res.json();
    console.log(json);
  } catch (err) {
    console.error("Error:", err);
  }
};
