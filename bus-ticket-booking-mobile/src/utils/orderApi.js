import axiosClient from './axiosClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

class OrderApi {
  getOrderAvailable = (params) => {
    const url = `order/customer/bill/available`;
    const res = axiosClient.get(url, {
      params: {
        ...params,
        isAll: true,
      },
    });
    return res;
  };
  getOrderHistory = (params) => {
    const url = `order/customer/bill/history`;
    const res = axiosClient.get(url, {
      params: {
        ...params,
        isAll: true,
      },
    });
    return res;
  };

  getOrderById(id, params) {
    const url = `order/id/${id}`;
    const res = axiosClient.get(url, {
      ...params,
    });
    return res;
  }

  booking(params) {
    const url = `booking`;
    const res = axiosClient.post(url, params);
    return res;
  }

  updateStatusOrder(code, params) {
    const url = `order/code/${code}`;
    const res = axiosClient.patch(url, params);
    return res;
  }

  bookingZalo(params) {
    const url = `payment/zalopay/${params?.orderCode}/url`;

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
    const url = `payment/zalopay/check-status`; // Endpoint API
    const res = axiosClient.post(url, params); // POST request với dữ liệu từ params
    return res;
  }
}

const orderApi = new OrderApi();
export default orderApi;
