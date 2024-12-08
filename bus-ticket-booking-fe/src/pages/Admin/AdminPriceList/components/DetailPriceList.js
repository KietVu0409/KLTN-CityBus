import { yupResolver } from "@hookform/resolvers/yup";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Button, Divider, Grid, TextField } from "@mui/material";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import "../../../../assets/scss/default.scss";
import FormControlCustom from "../../../../components/FormControl";
import customToast from "../../../../components/ToastCustom";
import { PriceListApi } from "../../../../utils/priceListApi";
import CreatePriceListDetail from "./AddPriceDetailList";
import EditPriceList from "./EditPriceList";
import GroupDetailPriceList from "./GroupDetailPriceList";
import Cookies from "js-cookie";

const DetailPriceList = (props) => {
  const [dataCustomer, setData] = useState();
  const dateNow = moment(new Date()).format("DD-MM-YYYY hh:mm");
  const navigate = useNavigate();
  const codePriceList = useParams();
  const [detailPriceList, setDetailPriceList] = useState({});
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDrawerAdd, setShowDrawerAdd] = useState(false);
  const isManager = Cookies.get("isManager");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPrice, setTotalPrice] = useState(0);

  const [priceListDetails, setPriceListDetails] = useState([]);

  const getDetailPriceList = async () => {
    try {
      const priceListApi = new PriceListApi();
      const res = await priceListApi.getPriceListByCode(codePriceList.id);
      setDetailPriceList(res?.data.data);
    } catch (error) {
      customToast.error(error);
    }
  };

  const getPriceListDetails = async () => {
    try {
      const priceListApi = new PriceListApi();
      const res = await priceListApi.getPriceListDetails({
        priceListCode: codePriceList.id,
        page: page + 1,
        pageSize: pageSize,
      });
      setPriceListDetails(res?.data?.data);
      setTotalPrice(res?.data?.pagination?.total);
    } catch (error) {
      customToast.error(error);
    }
  };

  useEffect(() => {
    getDetailPriceList();
    getPriceListDetails();
  }, [codePriceList]);

  useEffect(() => {
    getPriceListDetails();
  }, [page, pageSize]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    setPage(0);
  };

  const defaultValues = useMemo(
    () => ({
      province: dataCustomer?.citiesId || "",
      email: dataCustomer?.email || "",
      address: dataCustomer?.address || "",
      phone: dataCustomer?.phone || "",
      district: dataCustomer?.districtId || "",
      customer: dataCustomer || "",
      note: "",
      price: "",
      createdDate: dateNow,
      placePickOrder: "",
      branch: "",
      userReview: "",
      paymentTime: dateNow,
      paymentPrice: "",
    }),
    [dataCustomer]
  );
  const schema = yup.object().shape({
    customer: yup
      .object()
      .typeError("Vui lòng chọn khách hàng")
      .required("Vui lòng chọn khách hàng"),
    phone: yup.string().required("Vui lòng nhập số điện thoại"),
    address: yup.string().required("Vui lòng nhập địa chỉ"),
    branch: yup
      .object()
      .typeError("Vui lòng chọn chi nhánh")
      .required("Vui lòng chọn chi nhánh"),
  });
  const methods = useForm({
    mode: "onSubmit",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { formState, watch, setValue, handleSubmit, reset, getValues } =
    methods;
  return (
    <div className={"page-layout-blank"} style={{ width: "100%" }}>
      <Helmet>
        <title> CITY BUS - Chi tiết bảng giá</title>
      </Helmet>
      <Grid container spacing={1}>
        <Grid md={12}>
          <div className={"page-layout"}>
            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <h2 className={"txt-title"}>
                    Bảng giá #{detailPriceList?.code}
                  </h2>
                </div>
                <div style={{ padding: "2px 5px" }}>
                  <div
                    style={{
                      backgroundColor:
                        detailPriceList?.status == "Tạm ngưng"
                          ? "red"
                          : "green",
                      borderRadius: "15px",
                    }}
                  >
                    <span
                      style={{
                        color: "white",
                        fontSize: "0.73rem",
                        fontWeight: "600",
                        padding: "2px 5px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {detailPriceList?.status == "Tạm ngưng"
                        ? "Tạm ngưng"
                        : "Hoạt động"}
                    </span>
                  </div>
                </div>
              </div>
              {isManager == "true" && (
                <div>
                  <Button
                    style={{
                      padding: "1px 4px",
                      textTransform: "none",
                    }}
                    onClick={() => setShowDrawer(true)}
                  >
                    <BorderColorIcon color="primary" fontSize="small" />
                    <span
                      style={{
                        color: "#00354e ",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        padding: "2px 5px",
                        display: "flex",
                        alignItems: "center",
                        marginRight: "5px",
                      }}
                    >
                      Cập nhật
                    </span>
                  </Button>
                </div>
              )}
            </Grid>
            <Divider />
            <FormProvider {...methods}>
              <form>
                <div className="content mt-2">
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControlCustom
                        label={"Mã bảng giá*"}
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        fullWidth
                      >
                        <TextField
                          style={{ width: "100%" }}
                          name={"address"}
                          placeholder={""}
                          className={"input-detail"}
                          disabled
                          value={detailPriceList?.code}
                        />
                      </FormControlCustom>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControlCustom
                        label={"Tên bảng giá"}
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        fullWidth
                      >
                        <TextField
                          style={{ width: "100%" }}
                          name={"address"}
                          placeholder={""}
                          className={"input-detail"}
                          disabled
                          value={detailPriceList?.name}
                        />
                      </FormControlCustom>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Ngày bắt đầu"}
                        fullWidth
                      >
                        <TextField
                          style={{ width: "100%" }}
                          name={"phone"}
                          helperText={""}
                          placeholder={""}
                          className={"input-detail"}
                          disabled
                          value={detailPriceList?.startDate}
                        />
                      </FormControlCustom>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Ngày kết thúc"}
                        fullWidth
                      >
                        <TextField
                          style={{ width: "100%" }}
                          name={"phone"}
                          helperText={""}
                          placeholder={""}
                          className={"input-detail"}
                          disabled
                          value={detailPriceList?.endDate}
                        />
                      </FormControlCustom>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Ghi chú"}
                        fullWidth
                      >
                        <TextField
                          style={{ width: "100%" }}
                          multiline
                          rows={3}
                          name={"note"}
                          helperText={""}
                          className={"input-detail"}
                          disabled
                          value={detailPriceList?.note}
                        />
                      </FormControlCustom>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Ngày tạo"}
                        fullWidth
                      >
                        <TextField
                          disabled
                          style={{ width: "100%" }}
                          name={"createdAt"}
                          placeholder={"Nhập ngày tạo bảng giá"}
                          helperText={""}
                          className={"input-detail"}
                          value={moment(detailPriceList?.createdAt).format(
                            "DD/MM/YYYY HH:MM"
                          )}
                        />
                      </FormControlCustom>
                    </Grid>
                  </Grid>
                </div>
              </form>
            </FormProvider>
          </div>

          <div className={"page-layout"} style={{ marginTop: 50 }}>
            <Grid className={"align-items-center header_title"}>
              <Grid md={7}>
                <h2 className={"txt-title"}>DANH SÁCH GIÁ</h2>
              </Grid>
              {isManager == "true" && (
                <div
                  className="item-btn-right"
                  style={{ float: "right", marginBottom: 20 }}
                >
                  <Button
                    className={"btn-create"}
                    variant="outlined"
                    size="medium"
                    style={{ height: "2rem" }}
                    onClick={() => setShowDrawerAdd(true)}
                  >
                    <span className={"txt"}>Thêm nhóm</span>
                  </Button>
                </div>
              )}
            </Grid>
            <GroupDetailPriceList
              data={priceListDetails}
              getPriceListDetails={getPriceListDetails}
              handleChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              total={totalPrice}
              page={page}
              pageSize={pageSize}
            />
          </div>
        </Grid>
      </Grid>

      <EditPriceList
        setShowDrawer={setShowDrawer}
        showDrawer={showDrawer}
        dataPriceList={detailPriceList}
        getDetailPriceList={getDetailPriceList}
      ></EditPriceList>

      <CreatePriceListDetail
        setShowDrawer={setShowDrawerAdd}
        showDrawer={showDrawerAdd}
        idPriceList={detailPriceList.id}
        getPriceListDetails={getPriceListDetails}
      ></CreatePriceListDetail>
    </div>
  );
};

export default DetailPriceList;
