import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://testnet.binancefuture.com/fapi/v1",
});
