import Cookies from "js-cookie";
import axiosClient from "./axios";

class StatisticsApi {
  statistics(params) {
    const url = "statistics";
    const res = axiosClient.get(url, {
      params: {
        type: "week",
        ...params,
      },
    });
    return res;
  }

  topCustomers(params) {
    const url = "statistics/top-customers";
    const res = axiosClient.get(url, {
      params: {
        type: "week",
        limit: 5,
        ...params,
      },
    });
    return res;
  }

  revenue(params) {
    const url = "statistics/revenue-by-day";
    const res = axiosClient.get(url, {
      params: {
        type: "week",
        ...params,
      },
    });
    return res;
  }

  revenueByCustomer(params) {
    const url = "statistics/revenue-by-customer";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }
  revenueByEmployees(params) {
    const url = "statistics/revenue-by-employees";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }

  ticketByRoute(params) {
    const url = "statistics/ticket-sold-by-route";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }

  promotionLine(params){
    const url = "statistics/promotion-lines";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }
}
export { StatisticsApi };
