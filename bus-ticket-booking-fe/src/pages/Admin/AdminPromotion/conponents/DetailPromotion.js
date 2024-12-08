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
import { PromotionApi } from "../../../../utils/promotionApi";
import GroupDetailPriceList from "../../AdminPriceList/components/GroupDetailPriceList";
import AddPromotionLine from "./AddPromotionLine";
import EditPromotion from "./EditPromotion";
import PromotionDetailList from "./PromotionDetailList";
import EditPromotionLine from "./EditPromotionLine";
import Cookies from "js-cookie";

const DetailPromotion = (props) => {
  const [dataCustomer, setData] = useState();
  const dateNow = moment(new Date()).format("DD-MM-YYYY hh:mm");
  const navigate = useNavigate();
  const codePromotion = useParams();
  const [detailPromotion, setDetailPromotion] = useState({});
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDrawerAdd, setShowDrawerAdd] = useState(false);
  const [showDrawerEdit, setShowDrawerEdit] = useState(false);
  const [idPromotionLine, setIdPromotionLine] = useState(null);
  const [detailPromotionLine, setDetailPromotionLine] = useState("");
  const isManager = Cookies.get("isManager");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPromotion, setTotalPromotion] = useState(0);

  const [promotionLine, setPromotionLine] = useState([]);

  const handleShowDetail = (id) => {
    setShowDrawerEdit(true);
    setIdPromotionLine(id);
  };
  useEffect(() => {
    if (!showDrawerEdit) {
      setIdPromotionLine("");
    }
  }, [showDrawerEdit]);

  const getDetailPromotionLine = async (id) => {
    if (!id) return;
    const promotionApi = new PromotionApi();
    const response = await promotionApi.getPromotionLineById(id);
    setDetailPromotionLine(response.data.data);
  };
  useEffect(() => {
    getDetailPromotionLine(idPromotionLine);
  }, [idPromotionLine]);

  const getDetailPromotion = async () => {
    try {
      const promotionApi = new PromotionApi();
      const res = await promotionApi.getByCode(codePromotion.id);
      setDetailPromotion(res?.data.data);
    } catch (error) {
      customToast.error(error);
    }
  };

  const getPromotionLine = async () => {
    try {
      const promotionApi = new PromotionApi();
      const res = await promotionApi.getPromotionLine({
        promotionCode: codePromotion.id,
        page: page + 1,
        pageSize: pageSize,
      });
      console.log(res);
      setPromotionLine(res?.data.data);
      setTotalPromotion(res?.data?.pagination?.total)
    } catch (error) {
      customToast.error(error);
    }
  };

  useEffect(() => {
    getDetailPromotion();
    getPromotionLine();
  }, [codePromotion]);

  useEffect(() => {
    getPromotionLine();
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
        <title> CITY BUS - Chi tiết chương trình khuyến mãi</title>
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
                    Chương trình khuyến mãi #{detailPromotion?.code}
                  </h2>
                </div>
                <div style={{ padding: "2px 5px" }}>
                  <div
                    style={{
                      backgroundColor:
                        detailPromotion?.status == "Ngừng hoạt động"
                          ? "red"
                          : detailPromotion?.status == "Đang hoạt động"
                          ? "green"
                          : "#f27932",
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
                      {detailPromotion?.status}
                    </span>
                  </div>
                </div>
              </div>
              {isManager == "true" && <div>
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
            </div>}
              
            </Grid>
            <Divider />
            <FormProvider {...methods}>
              <form>
                <div className="content mt-2">
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControlCustom
                        label={"Mã khuyến mãi*"}
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        fullWidth
                      >
                        <TextField
                          style={{ width: "100%" }}
                          name={"code"}
                          placeholder={""}
                          className={"input-detail"}
                          disabled
                          value={detailPromotion?.code}
                        />
                      </FormControlCustom>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControlCustom
                        label={"Tên khuyến mãi"}
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        fullWidth
                      >
                        <TextField
                          style={{ width: "100%" }}
                          name={"name"}
                          placeholder={""}
                          className={"input-detail"}
                          disabled
                          value={detailPromotion?.name}
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
                          name={"startDate"}
                          helperText={""}
                          placeholder={""}
                          className={"input-detail"}
                          disabled
                          value={moment(detailPromotion?.startDate).format("DD-MM-YYYY") }
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
                          name={"endDate"}
                          helperText={""}
                          placeholder={""}
                          className={"input-detail"}
                          disabled
                          value={moment(detailPromotion?.endDate).format("DD-MM-YYYY")}
                        />
                      </FormControlCustom>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Mô tả"}
                        fullWidth
                      >
                        <TextField
                          style={{ width: "100%" }}
                          multiline
                          rows={3}
                          name={"description"}
                          helperText={""}
                          className={"input-detail"}
                          disabled
                          value={detailPromotion?.description}
                        />
                      </FormControlCustom>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Hình ảnh"}
                        fullWidth
                      >
                        <div>
                          <img
                            src={detailPromotion?.image}
                            alt=""
                            style={{
                              aspectRatio: 1,
                              width: "100px",
                              backgroundSize: "cover",
                            }}
                          />
                        </div>
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
                <h2 className={"txt-title"}>DÒNG KHUYẾN MÃI</h2>
              </Grid>
              {isManager == "true" && <div
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
                <span className={"txt"}>Thêm mới</span>
              </Button>
            </div>}
              
            </Grid>
            <PromotionDetailList
              data={promotionLine}
              getPromotionLine={getPromotionLine}
              handleShowDetail={handleShowDetail}
              handleChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              total={totalPromotion}
              page={page}
              pageSize={pageSize}
            />
          </div>
        </Grid>
      </Grid>
      <EditPromotion
        setShowDrawer={setShowDrawer}
        showDrawer={showDrawer}
        dataPromotion={detailPromotion}
        getDetailPromotion={getDetailPromotion}
      ></EditPromotion>
      <AddPromotionLine
        setShowDrawer={setShowDrawerAdd}
        showDrawer={showDrawerAdd}
        codePromotion={detailPromotion.code}
        getPromotionLine={getPromotionLine}
        detailPromotion={detailPromotion}
      ></AddPromotionLine>

      <EditPromotionLine
        setShowDrawer={setShowDrawerEdit}
        showDrawer={showDrawerEdit}
        detailPromotionLine={detailPromotionLine}
        getPromotionLine={getPromotionLine}
      ></EditPromotionLine>
    </div>
  );
};

export default DetailPromotion;
