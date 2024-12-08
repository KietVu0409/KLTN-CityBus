import Cookies from "js-cookie";
import axiosClient from "./axios";

class PromotionApi {
  getStatus(params) {
    const url = "promotion/status";
    const res = axiosClient.get(url);
    return res;
  }
  getAll(params) {
    const url = "promotion";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }

  create(params) {
    const url = `promotion`;
    const res = axiosClient.post(url, {
      ...params,
    });
    return res;
  }
  getByCode(id, params) {
    const url = `promotion/code/${id}`;
    const res = axiosClient.get(url, {
      ...params,
    });
    return res;
  }
  updateById(code, params) {
    const url = `promotion/id/${code}`;
    const res = axiosClient.patch(url, {
      ...params,
    });
    return res;
  }

  deleteById(id, params) {
    const url = `promotion/id/${id}`;
    const res = axiosClient.delete(url, params);
    return res;
  }

  getPromotionLine(params) {
    const url = `promotion-line`;
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }

  createPromotionLine(params) {
    const url = `promotion-line`;
    const res = axiosClient.post(url, {
      ...params,
    });
    return res;
  }

  deletePromotionLine(id) {
    const url = `promotion-line/id/${id}`;
    const res = axiosClient.delete(url);
    return res;
  }

  getPromotionLineById(id, params) {
    const url = `promotion-line/id/${id}`;
    const res = axiosClient.get(url, {
      ...params,
    });
    return res;
  }

  updatePromotionLineById(code, params) {
    const url = `promotion-line/id/${code}`;
    const res = axiosClient.patch(url, {
      ...params,
    });
    return res;
  }

  getPromotionAvailable(params) {
    const url = "promotion-line/available";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }

  calculatePromotionLine(params) {
    const url = "promotion-history/calculate-promotion-line";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }
}
export { PromotionApi };
