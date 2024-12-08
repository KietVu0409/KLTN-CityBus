import axiosClient from "./axios";

class UploadApi {
    uploadMutiFile = async (params) =>{
        const url = `upload/uploadMutiFile`;
        const res =  await axiosClient.post(url,params);
        return res;
      }
  }
  
  export { UploadApi };
  