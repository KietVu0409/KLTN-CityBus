import axios from "axios";
import Cookies from "js-cookie";

const base_url = process.env.REACT_APP_BASE_URL;
const axiosClient = axios.create({
  baseURL: base_url,
});

axiosClient.interceptors.request.use(
  async (config) => {
    let token = Cookies.get("access_token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
