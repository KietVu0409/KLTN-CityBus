import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button, Divider, Drawer, Grid, Typography } from "@mui/material";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { FormProvider, useForm } from "react-hook-form";

import * as yup from "yup";

import { useEffect, useState } from "react";
import InputField from "../../../../components/InputField";
import FormControlCustom from "../../../../components/FormControl";
import "../../../../assets/scss/default.scss";
import { LoadingButton } from "@mui/lab";
import customToast from "../../../../components/ToastCustom";
import { GroupCusApi } from "../../../../utils/groupCusApi";
import CustomerList from "./ListCustomer";
import EditGroupUser from "./EditGroupUser";
import Cookies from "js-cookie";

const InfoGroupUser = (props) => {
  const {
    setShowDrawerDetail,
    showDrawerDetail,
    dataGroupCustomer,
    handleGetData,
  } = props;
  const [showDrawerEdit, setShowDrawerEdit] = useState(false);
  const isManager = Cookies.get("isManager");
  return (
    <Drawer
      PaperProps={{
        sx: { width: "45%", minWidth: "39rem" },
      }}
      anchor={"right"}
      open={showDrawerDetail}
      className="drawer"
      onClose={() => setShowDrawerDetail(false)}
    >
      <div className="title-drawer">
        <div className="btn-close" onClick={() => setShowDrawerDetail(false)}>
          <ArrowBackIosIcon className="icon-back" />
        </div>
        <div>
          <span>Chi tiết</span>
        </div>
      </div>
      <div className="content-drawer">
        <div className="title-group">
          <span>Thông tin nhóm khách hàng</span>
          {isManager == "true" && (
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              onClick={() => setShowDrawerEdit(true)}
            >
              sửa thông tin
            </Button>
          )}
        </div>
      </div>
      <div
        className="row"
        style={{ marginLeft: 20, marginTop: 20, width: "97%" }}
      >
        <div className="col-3">
          <span style={{ color: "#000", fontSize: 16 }}>Mã nhóm:</span>{" "}
        </div>
        <div className="col-8">
          <span variant="h6" style={{ fontSize: 16 }}>
            {dataGroupCustomer.code}
          </span>
        </div>

        <div className="col-12"></div>
        <div className="col-3" style={{ marginTop: 10 }}>
          <span style={{ color: "#000", fontSize: 16, marginTop: 20 }}>
            Tên nhóm:
          </span>{" "}
        </div>
        <div className="col-8" style={{ marginTop: 10 }}>
          <Typography style={{ fontSize: 16 }}>
            {dataGroupCustomer.name}
          </Typography>
        </div>
        <div className="col-12"></div>
        <div className="col-3" style={{ marginTop: 10 }}>
          <span style={{ color: "#000", fontSize: 16 }}>Mô tả:</span>{" "}
        </div>
        <div className="col-8" style={{ marginTop: 10 }}>
          <span style={{ fontSize: 16 }}>{dataGroupCustomer.description}</span>
        </div>
        <div className="col-12"></div>
        <div className="col-3" style={{ marginTop: 10 }}>
          <span style={{ color: "#000", fontSize: 16 }}>Ghi chú:</span>{" "}
        </div>
        <div className="col-8" style={{ marginTop: 10 }}>
          <Typography style={{ fontSize: 16 }}>
            {dataGroupCustomer.note}
          </Typography>
        </div>
        <div className="col-12"></div>
      </div>
      <div className="content-drawer" style={{ marginTop: 50 }}>
        <div className="title-group">
          <span>Danh sách khách hàng</span>
        </div>
      </div>
      <div>
        <CustomerList
          idGroup={dataGroupCustomer.id}
          data={dataGroupCustomer.customers}
        ></CustomerList>
      </div>

      <EditGroupUser
        setShowDrawer={setShowDrawerEdit}
        showDrawer={showDrawerEdit}
        dataGroupCustomer={dataGroupCustomer}
        setShowDrawerDetail={setShowDrawerDetail}
        handleGetData={handleGetData}
      ></EditGroupUser>
    </Drawer>
  );
};

export default InfoGroupUser;
