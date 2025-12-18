import axios from "axios";

const instance = axios.create({
  baseURL: "https://egroots-innovate-shop-production.up.railway.app", // your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
