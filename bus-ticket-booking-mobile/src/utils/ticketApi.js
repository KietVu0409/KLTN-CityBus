import axiosClient from "./axiosClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

class TicketApi {
  findAllTicket = (params) => {
    const url = "ticket/ticket-detail";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  };
}

const ticketApi = new TicketApi();
export default ticketApi;
