import axiosClient from "./axios";

class ProvinceApi {
    getAllProvince(params) {
        const url = "province?isAll=true";
        const res = axiosClient.get(url,{
          params: {
            ...params,
          },
        });
        return res;
      }
  }
  
  export { ProvinceApi };
  