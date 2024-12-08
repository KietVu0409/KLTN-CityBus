import axiosClient from "./axiosClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

class PriceListApi {
  getPrice = (params) => {
    const url = `price-list/price-detail/booking`;
    const res = axiosClient.get(url, {
      params: {
        sort: "ASC",
        ...params,
      },
    });
    return res;
  };
}

const priceListApi = new PriceListApi();
export default priceListApi;
