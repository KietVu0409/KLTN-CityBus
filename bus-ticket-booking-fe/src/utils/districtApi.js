import axiosClient from "./axios";

class DistrictApi {
    getDistrictByProvinceId(id,params) {
        const url = `district/province-code/${id}?isAll=true`;
        const res = axiosClient.get(url,{
          params: {
            ...params,
          },
        });
        return res;
      }
  }
  
  export { DistrictApi };
  