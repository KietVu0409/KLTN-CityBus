import Cookies from "js-cookie";
import axiosClient from "./axios";

class TicketApi {
  findAllTicket(params) {
    const url = "ticket/ticket-detail";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }

}
export { TicketApi };
