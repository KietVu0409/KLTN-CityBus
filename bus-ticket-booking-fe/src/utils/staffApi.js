import Cookies from "js-cookie";
import axiosClient from "./axios";

class StaffApi {
  getAll(params) {
    const url = "staff";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }

  create(params){
    const url = `staff`;
    const res = axiosClient.post(url, {
      ...params,
    });
    return res;
  }
  getByCode(id, params) {
    const url = `staff/code/${id}`;
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }
  deleteByCode(id, params) {
    const url = `staff/code/${id}`;
    const res = axiosClient.delete(url, params);
    return res;
  }
  editByCode(id, params) {
    const url = `staff/code/${id}`
    const res = axiosClient.patch(url, params);
    return res;
  }
}
export { StaffApi };
