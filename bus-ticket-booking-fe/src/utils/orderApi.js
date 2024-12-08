import Cookies from "js-cookie";
import axiosClient from "./axios";

class OrderApi {
  searchCustomer(params) {
    const url = "customer/order/search";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }

  createOrder(params){
    const url = `order`;
    const res = axiosClient.post(url, {
      ...params,
    });
    return res;
  }

  getListOrder(params){
    const url = "order";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }

  getOrderById(id,params){
    const url = `order/id/${id}`;
    const res = axiosClient.get(url, {
      ...params,
    });
    return res;
  }
  getOrderByCode(id,params){
    const url = `order/code/${id}`;
    const res = axiosClient.get(url, {
      ...params,
    });
    return res;
  }
  

  getOrderStatus() {
    const url = "order/status";
    const res = axiosClient.get(url);
    return res;
  }

  getListOrderBill(params){
    const url = "order/bill";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }

  updateStatusOrder(code,params){
    const url = `order/code/${code}`;
    const res = axiosClient.patch(url,params);
    return res;
  }

  payment(params){
    const url = `order/payment`;
    const res = axiosClient.post(url,params);
    return res;
  }

  getListOrderRefund(params){
    const url = "order-refund";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }

  getOrderRefundByCode(id,params){
    const url = `order-refund/code/${id}`;
    const res = axiosClient.get(url, {
      ...params,
    });
    return res;
  }
  updateStatusOrderRefund(code,params){
    const url = `order-refund/code/${code}`;
    const res = axiosClient.patch(url,params);
    return res;
  }

  getPaymentOrder(code,params){
    const url = `payment-history/order-code/${code}`;
    const res = axiosClient.get(url,params);
    return res;
  }

  bookingZalo(params) {
    const url = `payment/zalopayAdmin/${params?.orderCode}/url`;

    // http://localhost:3001/order/payment
    // console.log("params", params);
    // return;
    //const url = `/order/payment`;
    const res = axiosClient.get(url, params);
    return res;
  }

  /**
   * Kiểm tra trạng thái thanh toán qua ZaloPay
   * @param {Object} params - Thông tin để kiểm tra trạng thái thanh toán
   * @returns {Promise} Kết quả từ backend
   */
  checkStatusZaloPay(params) {
    const url = `payment/zalopayAdmin/check-status`; // Endpoint API
    const res = axiosClient.post(url, params); // POST request với dữ liệu từ params
    return res;
  }
}
export { OrderApi };
