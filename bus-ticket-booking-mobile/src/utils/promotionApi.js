import axiosClient from "./axiosClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

class PromotionApi {
  findAll = (params) => {
    const url = "promotion";
    return axiosClient.get(url, {
      params: {
        ...params,
      },
    });
  };

  getPromotionAvailable(params){
    const url = "promotion-line/available";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }

  calculatePromotionLine(params){
    const url = "promotion-history/calculate-promotion-line";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }

  getPromotionLine(codePromotion) {
    const url = `promotion-line?promotionCode=${codePromotion}&sort=ASC&isAll=true`;

    const res = axiosClient.get(url);
    return res;
  }
}

const promotionApi = new PromotionApi();
export default promotionApi;
