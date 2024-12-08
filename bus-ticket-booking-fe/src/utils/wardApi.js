import axiosClient from "./axios";

class WardApi {
    getWardByDistrictId(id,params) {
        const url = `ward/district-code/${id}?isAll=true`;
        const res = axiosClient.get(url,{
          params: {
            ...params,
          },
        });
        return res;
      }

      getDetailWardByCode(code,params) {
        const url = `ward/code/4${code}`;
        const res = axiosClient.get(url,{
          params: {
            ...params,
          },
        });
        return res;
      }
  }
  
  export { WardApi };
  