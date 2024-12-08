import Cookies from "js-cookie";
import axiosClient from "./axios";

class VehicleApi {
  getAll(params) {
    const url = "vehicle";
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }

  getList(){
    const url = "vehicle?isAll=true";
    const res = axiosClient.get(url);
    return res;
  }


  createVehicle(params) {
    const url = `vehicle`;
    const res = axiosClient.post(url, {
      ...params,
    });
    return res;
  }

  getById(id, params) {
    const url = `vehicle/id/${id}`;
    const res = axiosClient.get(url, {
      params: {
        ...params,
      },
    });
    return res;
  }

  deleteVehicle(id, params) {
    const url = `vehicle/id/${id}`;
    const res = axiosClient.delete(url, {
      params: {
        ...params,
      },
    });
    return res;
  }
  updateVehicle(id, params) {
    const url = `vehicle/id/${id}`;
    const res = axiosClient.patch(url, {
      ...params,
    });
    return res;
    
  }

  getType() {
    const url = "vehicle/vehicle-type";
    const res = axiosClient.get(url);
    return res;
  }
}
export { VehicleApi };
