import axios from "axios"

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "https://jsonplaceholder.typicode.com",
  headers: {
    "Content-Type": "application/json"
  }
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
)
