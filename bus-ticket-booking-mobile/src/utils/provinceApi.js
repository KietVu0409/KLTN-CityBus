import axiosClient from "./axiosClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

class ProvinceApi {
  getAll = (params) => {
    const url = "province?isAll=true";
    return axiosClient.get(url, params);
  };
}

const provinceApi = new ProvinceApi();
export default provinceApi;
