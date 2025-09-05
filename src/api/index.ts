import axios from "axios";

const api = axios.create({
  baseURL: "http://10.139.200.65:4000/api", // ⚠️ Android Emulator
  // If real device: replace with your PC IP, like "http://10.0.2.2:4000/api"
});

export default api;
