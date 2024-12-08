import Cookies from "js-cookie";
import axiosClient from "./axios";

class AdminApi {
  login(params) {
    const url = "auth/admin/login/";
    const res = axiosClient.post(url, params);
    return res;
  }
  logout() {
    const url = "auth/admin/logout";
    const res = axiosClient.post(url);
    return res;
  }

  profile() {
    const url ="admin/profile";
    const res = axiosClient.get(url);
    return res;
  }
  changePassword(params) {
    const url ="admin/password";
    const res = axiosClient.patch(url, params);
    return res;
  }
  save_token(data) {
    Cookies.set("access_token", data.data.access_token);
    Cookies.set("refresh_token", data.data.refresh_token);
  }

  save_info(data) {
    Cookies.set("id", data.id);
    Cookies.set("email", data.email);
    Cookies.set("phone", data.phone);
    Cookies.set("fullName", data.fullName);
    Cookies.set("gender", data.gender);
    Cookies.set("address", data.address);
    Cookies.set("note", data.note);
    Cookies.set("birthDay", data.birthDay);
    Cookies.set("code", data.code);
    Cookies.set("createdAt", data.createdAt);
    Cookies.set("createdBy", data.createdBy);
    Cookies.set("updatedBy", data.updatedBy);
    Cookies.set("isActive", data.isActive);
    Cookies.set("lastLogin", data.lastLogin);
    Cookies.set("isManager", data.isManage);
  }
  remove_token(response) {
    Cookies.remove("access_token");
    Cookies.remove("access_token");
  }

  get_token() {
    return {
      access: Cookies.get("access_token"),
      refresh: Cookies.get("access_token"),
    };
  }
  sendOtp(params) {
    const url = "auth/admin/send-otp";
    return axiosClient.post(url, params);
  };
  activeAccount(params)  {
    const url = "admin/active";
    return axiosClient.post(url, params);
  };
  resetPassword(params) {
    const url ="admin/reset-password";
    const res = axiosClient.patch(url, params);
    return res;
  }
}

export { AdminApi };
