import Cookies from "js-cookie";
import axiosClient from "./axios";

class PriceListApi {
  getAll(params) {
    const url = "price-list";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }

  create(params) {
    const url = `price-list`;
    const res = axiosClient.post(url, {
      ...params,
    });
    return res;
  }

  getPriceListById(id, params) {
    const url = `price-list/id/${id}`;
    const res = axiosClient.get(url, {
      ...params,
    });
    return res;
  }

  getPriceListByCode(id, params) {
    const url = `price-list/code/${id}`;
    const res = axiosClient.get(url, {
      ...params,
    });
    return res;
  }

  updateByCode(code, params) {
    const url = `price-list/code/${code}`;
    const res = axiosClient.patch(url, {
      ...params,
    });
    return res;
  }

  deleteById(id, params) {
    const url = `price-list/id/${id}`;
    const res = axiosClient.delete(url, params);
    return res;
  }

  getPriceListDetails(params) {
    const url = `price-list/price-detail`;
    const res = axiosClient.get(url, {
      params: {
        sort: "ASC",
        ...params,
      },
    });
    return res;
  }

  createPriceListDetail(params){
    const url = `price-list/price-detail`;
    const res = axiosClient.post(url, {
      ...params,
    });
    return res;
  }

  deletePriceListDetail(id,params){
    const url = `price-list/price-detail/id/${id}`;
    const res = axiosClient.delete(url, {
      ...params,
    });
    return res;
  }

  getPrice(params){
    const url = `price-list/price-detail/booking`;
    const res = axiosClient.get(url, {
      params: {
        sort: "ASC",
        ...params,
      },
    });
    return res;
  }
}
export { PriceListApi };
