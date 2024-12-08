import {
  Button,
  Divider,
  Grid,
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import FormControlCustom from "../../../components/FormControl";
import SelectCustom from "../../../components/SelectCustom";
import InputField from "../../../components/InputField";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PrintIcon from "@mui/icons-material/Print";
import {
  convertCurrency,
  currencyMark,
  numberFormat,
} from "../../../data/curren";
import "./AdminOrderRefund.scss";
import { useNavigate, useParams } from "react-router-dom";
import { OrderApi } from "../../../utils/orderApi";
import customToast from "../../../components/ToastCustom";
import { CustomerApi } from "../../../utils/customerApi";
import ModalAlert from "../../../components/Modal";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import TicketOrderListOrderRefund from "./components/TicketOrderListOrderRefund";

const OrderRefundDetail = (props) => {
  const [orderDetail, setOrderDetail] = useState();
  const dateNow = moment(new Date()).format("DD-MM-YYYY hh:mm");
  const [value, setValueChange] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const idOrder = useParams();
  console.log(idOrder);
  const [dataOrder, setDataOrder] = useState();
  const [dataOrderRefund, setDataOrderRefund] = useState();
  const [dataPayment, setDataPayment] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [noteRefund, setNoteRefund] = useState();
  console.log(noteRefund);

  const navigate = useNavigate();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @media all {
        .page-break {
          display: none;
        }
      }
      
      @media print {
        html, body {
          // width: 200mm;
          height: initial !important;
          overflow: initial !important;
          -webkit-print-color-adjust: exact;
        }
      }
      
      @media print {
        .page-break {
          margin-top: 1rem;
          display: block;
          page-break-before: none;
        }
      }
      
      @page {
        size: 80mm auto;
        margin: 10mm;
      }
      `,
  });
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleChangeNoteRefund = (event) => {
    setNoteRefund(event.target.value);
  };
  const getDataPayment = async () => {
    try {
      const orderApi = new OrderApi();
      const res = await orderApi.getPaymentOrder(dataOrder?.code);
      setDataPayment(res?.data.data);
    } catch (error) {
      customToast.error(error);
    }
  };

  useEffect(() => {
    getDataPayment();
  }, [dataOrder]);

  const bankData = [
    {
      id: 1,
      name: "Thanh toán tiền mặt",
    },
    {
      id: 2,
      name: "Chuyển khoản ngân hàng",
    },
    {
      id: 3,
      name: "Thanh toán qua momo",
    },
  ];

  const bankBanking = [
    {
      id: 1,
      name: "Vietcombank Phan Đình Phương",
    },
    {
      id: 2,
      name: "Teckcombank Phan Đình Phương",
    },
    {
      id: 3,
      name: "Agribank Phan Đình Phương",
    },
  ];

  const getDetailOrder = async () => {
    try {
      const orderApi = new OrderApi();
      const res = await orderApi.getOrderByCode(idOrder.id);
      setDataOrder(res?.data.data);
    } catch (error) {
      customToast.error(error);
    }
  };
  const getDetailOrderRefund = async () => {
    try {
      const orderApi = new OrderApi();
      const res = await orderApi.getOrderRefundByCode(idOrder.id);
      setDataOrderRefund(res?.data.data);
    } catch (error) {
      customToast.error(error);
    }
  };

  useEffect(() => {
    getDetailOrder();
    getDetailOrderRefund();
  }, [idOrder]);

  const schema = yup.object().shape({
    paymentPrice: yup
      .string()
      .typeError("Vui lòng nhập thành tiền")
      .required("Vui lòng nhập thành tiền"),
    paymentType: yup
      .object()
      .typeError("Vui lòng chọn phương thức thanh toán")
      .required("Vui lòng chọn phương thức thanh toán"),
    paymentBank: yup
      .object()
      .typeError("Vui lòng chọn phương thức thanh toán")
      .required("Vui lòng chọn phương thức thanh toán"),
  });

  const defaultValues = {
    note: "",
    paymentPrice: "",
    createdDate: dateNow,
    paymentType: "",
    paymentBank: "",
  };

  const methods = useForm({
    mode: "onSubmit",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { formState, watch, setValue, handleSubmit, reset } = methods;
  const { errors } = formState;
  const paymentTypeWatch = watch("paymentType");
  const watchPrice = watch("paymentPrice");

  useEffect(() => {
    setValue("paymentPrice", currencyMark(watchPrice));
  }, [watchPrice]);
  const handleChange = (event, newValue) => {
    setValueChange(newValue);
  };

  const onClickCancel = () => {
    customToast.warning("Coming soon...");
  };
  const onClickUpdateStatus = async () => {
    try {
      const orderApi = new OrderApi();
      const res = await orderApi.updateStatusOrderRefund(dataOrder?.code, {
        status: "Hoàn thành",
        note: noteRefund
      });
      customToast.success("Cập nhật thành công");
      getDetailOrder();
      getDetailOrderRefund();
      setOpenModal(false);
    } catch (error) {
      console.log(error);
      customToast.error(error.response.data.message);
    }
  };

  const onSubmit = async (value) => {
    const amount = numberFormat(value?.paymentPrice);
    const note = value?.note;
    if (paymentTypeWatch.id == 3) {
      window.location.href = `https://momofree.apimienphi.com/api/QRCode?phone=0354043344&amount=${amount}&note=${note}`;
    } else {
      customToast.warning("Coming soon...");
    }
  };
  const handlePrintOrder = () => {
    window.print();
  };
  const checkPayment = () => {
    return (
      <div
        className={"page-layout"}
        style={{ marginLeft: "0px", marginTop: 10 }}
      >
        <Grid container overflow={"hidden"}>
          <Grid flexDirection={{ xs: "column", md: "row" }} item>
            <Tabs value={value} onChange={handleChange} textColor="primary">
              <Tab label="Lịch sử" className="left-border" />
            </Tabs>
          </Grid>
        </Grid>
        <Divider />
        {tabPayment()}
      </div>
    );
  };

  const tabPayment = () => {
    return (
      <FormProvider {...methods}>
        <form>
          <div className="content mt-2" style={{ width: 380 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TableContainer component={Paper} style={{ width: "100%" }}>
                  <Table
                    size="small"
                    aria-label="a dense table"
                    padding="none"
                    style={{ width: "100%" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align={"center"}
                          padding="none"
                          style={{ width: "100px" }}
                        >
                          Thời gian
                        </TableCell>
                        <TableCell
                          align={"center"}
                          padding="none"
                          style={{ width: "100px" }}
                        >
                          Phương thức
                        </TableCell>
                        <TableCell
                          align={"center"}
                          padding="none"
                          style={{ width: "100px" }}
                        >
                          Số tiền
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell align={"center"}>
                          {moment(dataPayment?.createdAt).format(
                            "DD/MM/YYYY HH:MM"
                          )}
                        </TableCell>
                        <TableCell align={"center"}>
                          {dataPayment?.paymentMethod}
                        </TableCell>
                        <TableCell align={"center"}>
                          {convertCurrency(dataPayment?.amount)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </div>
        </form>
      </FormProvider>
    );
  };

  const checkPaymentOrder = () => {
    return (
      <Grid container md={12}>
        <div
          className={"page-layout"}
          style={{
            marginLeft: "0px",
            border: "3px solid #F5F5F5",
            padding: 10,
          }}
        >
          <Grid item className={"align-items-center header_title"}>
            <Grid item md={7}>
              <h2 className={"txt-title"}>THANH TOÁN</h2>
            </Grid>
          </Grid>
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className={"order-custom-title"}>Tổng tiền VND</span>
              <span className={"order-field-value"}>
                {convertCurrency(dataOrder?.total)}
              </span>
            </div>
            <Divider style={{ borderStyle: "dashed", margin: "10px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className={"order-custom-title"}>Giảm giá</span>
              <span className={"order-field-value"}>
                {convertCurrency(dataOrder?.total - dataOrder?.finalTotal)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "12px 0",
              }}
            >
              <span className={"order-custom-title"}>Thành tiền</span>
              <span className={"order-field-value"}>
                {convertCurrency(dataOrder?.finalTotal)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "12px 0",
              }}
            >
              <span className={"order-custom-title"}>Đã thanh toán</span>
              <span className={"order-field-value"}>
                {convertCurrency(dataPayment?.amount || 0)}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "12px 0",
              }}
            >
              <span className={"order-custom-title"}>
                Số tiền cần thanh toán
              </span>
              <span className={"order-field-value"}>
                {convertCurrency(dataOrder?.finalTotal - (dataPayment?.amount || 0))}
              </span>
            </div>
          </div>
          <Divider />
          {checkPayment()}
        </div>
      </Grid>
    );
  };

  return (
    <div className={"page-layout-blank"}>
      <Helmet>
        <title> CITY BUS - Chi tiết hóa đơn</title>
      </Helmet>
      <Grid container spacing={1}>
        <Grid item md={8}>
          <div
            className={"page-layout"}
            style={{ border: "3px solid #F5F5F5", padding: 10 }}
          >
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
                    HÓA ĐƠN TRẢ #{dataOrderRefund?.code}
                  </h2>
                </div>
                <div style={{ padding: "2px 5px" }}>
                  <div
                    style={{
                      backgroundColor:
                        dataOrderRefund?.status == "Hoàn thành"
                          ? "#0e9315"
                          : "#ff7b00",
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
                      {dataOrderRefund?.status}
                    </span>
                  </div>
                </div>
              </div>
              {dataOrderRefund?.status == "Chờ xử lý" ? (
                <div>
                  <Button
                    style={{
                      backgroundColor: "#0e9315",
                      padding: "1px 4px",
                      textTransform: "none",
                    }}
                    onClick={() => handleOpenModal()}
                  >
                    <span
                      style={{
                        color: "white",
                        fontSize: "0.7rem",
                        fontWeight: "600",
                        padding: "2px 5px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      Xác nhận hoàn vé
                    </span>
                  </Button>
                </div>
              ) : null}
            </Grid>

            <Divider style={{ marginTop: 10 }} />

            <FormProvider {...methods}>
              <form>
                <div className="content mt-2">
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <FormControlCustom
                        label={"Khách hàng*"}
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        fullWidth
                      >
                        <TextField
                          className={"disabled-field input-detail"}
                          style={{ width: "100%" }}
                          disabled={disabled}
                          value={dataOrder?.customer?.fullName}
                        />
                      </FormControlCustom>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControlCustom
                        label={"Địa chỉ"}
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        fullWidth
                      >
                        <TextField
                          className={"disabled-field input-detail"}
                          style={{ width: "100%" }}
                          disabled={disabled}
                          value={dataOrder?.customer?.fullAddress}
                        />
                      </FormControlCustom>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Điện thoại"}
                        fullWidth
                      >
                        <TextField
                          className={"disabled-field input-detail"}
                          style={{ width: "100%" }}
                          disabled={disabled}
                          value={dataOrder?.customer?.phone}
                        />
                      </FormControlCustom>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Email"}
                        fullWidth
                      >
                        <TextField
                          style={{ width: "100%" }}
                          disabled={disabled}
                          className={"disabled-field input-detail"}
                          value={dataOrder?.customer?.email}
                        />
                      </FormControlCustom>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Mã khuyến mãi"}
                        fullWidth
                      >
                        <TextField
                          style={{ width: "100%" }}
                          disabled={disabled}
                          className={"disabled-field input-detail"}
                          value={dataOrder?.promotionHistories
                            ?.map((item) => item.promotionLineCode)
                            .join(", ")}
                        />
                      </FormControlCustom>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Nhân viên"}
                        fullWidth
                      >
                        <TextField
                          style={{ width: "100%" }}
                          disabled={disabled}
                          className={"disabled-field input-detail"}
                          value={dataOrder?.staff?.fullName}
                        />
                      </FormControlCustom>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          " mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Ghi chú"}
                        fullWidth
                      >
                        <TextField
                          style={{ width: "100%" }}
                          disabled={disabled}
                          className={"disabled-field input-detail"}
                          value={dataOrderRefund?.note}
                          multiline
                          rows={3}
                        />
                      </FormControlCustom>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Thời gian trả"}
                        fullWidth
                      >
                        <TextField
                          style={{ width: "100%" }}
                          disabled={disabled}
                          className={"disabled-field input-detail"}
                          value={moment(dataOrderRefund?.createdAt).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        />
                      </FormControlCustom>
                    </Grid>
                  </Grid>
                </div>
              </form>
            </FormProvider>
          </div>
          <div
            className={"page-layout"}
            style={{ border: "3px solid #F5F5F5", padding: 10, marginTop: 20 }}
          >
            <Grid item className={"align-items-center header_title"}>
              <Grid item md={7}>
                <h2 className={"txt-title"}>DANH SÁCH VÉ ĐÃ ĐẶT</h2>
              </Grid>
            </Grid>
            <TicketOrderListOrderRefund
              data={dataOrder?.orderDetails || []}
              onClickPrint={onClickCancel}
            ></TicketOrderListOrderRefund>
          </div>
        </Grid>
        <Grid item md={4}>
          {checkPaymentOrder()}
        </Grid>
      </Grid>

      <ModalAlert
        open={openModal}
        handleClose={() => handleCloseModal()}
        handleCancel={() => handleCloseModal()}
        handleConfirm={() => onClickUpdateStatus()}
        title={"Xác nhận hoàn vé"}
        description={
          "Thao tác sẽ không thể hoàn tác, bạn có chắc chắn muốn tiếp tục không?"
        }
        type={"information"}
        icon={true}
        renderContentModal={
          <div>
            <div className="view-input-discount">
              <span>Mã đơn: {dataOrderRefund?.code} </span>
            </div>
            <div className="view-input-discount" style={{marginTop:10}}>
              <span style={{width:70}}>Ghi chú:</span>
              <TextField
                style={{
                  display: "flex",
                  width:250
                }}
                // multiline={true}
                className="input-discount"
                onChange={handleChangeNoteRefund}
              />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default OrderRefundDetail;
