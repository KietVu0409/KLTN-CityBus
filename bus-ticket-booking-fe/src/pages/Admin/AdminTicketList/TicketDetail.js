// import {
//   Button,
//   Divider,
//   Grid,
//   Input,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
// } from "@mui/material";
// import React, { useEffect, useMemo, useState } from "react";
// import { Helmet } from "react-helmet";
// import FormControlCustom from "../../../components/FormControl";
// import SelectCustom from "../../../components/SelectCustom";
// import InputField from "../../../components/InputField";
// import { FormProvider, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import moment from "moment";
// import TicketBookingList from "../AdminAddTicket/TicketBookingList";
// import Tab from "@mui/material/Tab";
// import Tabs from "@mui/material/Tabs";
// import {
//   convertCurrency,
//   currencyMark,
//   numberFormat,
// } from "../../../data/curren";
// import "./AdminTicketList.scss";
// import { useNavigate, useParams } from "react-router-dom";
// import { OrderApi } from "../../../utils/orderApi";
// import customToast from "../../../components/ToastCustom";
// import { CustomerApi } from "../../../utils/customerApi";
// import TicketListDetail from "./components/TicketListDetail";
// import ModalAlert from "../../../components/Modal";

// const TicketDetail = (props) => {
//   const [orderDetail, setOrderDetail] = useState();
//   const dateNow = moment(new Date()).utcOffset(7).format("DD-MM-YYYY hh:mm");
//   const [value, setValueChange] = useState(0);
//   const [disabled, setDisabled] = useState(true);
//   const idOrder = useParams();
//   const [dataOrder, setDataOrder] = useState();
//   const navigate = useNavigate();
//   const [openModal, setOpenModal] = useState(false);
//   const [disabledPTTT, setDisabledPTTT] = useState(false);
//   const [optionPTTT, setOptionPTTT] = useState([]);

//   const handleCloseModal = () => {
//     setOpenModal(false);
//   };
//   const handleOpenModal = () => {
//     setOpenModal(true);
//   };

//   const bankData = [
//     {
//       id: 1,
//       name: "tiền mặt",
//     },
//   ];

//   const bankBanking = [
//     {
//       id: 1,
//       name: "Vietcombank Phan Đình Phương",
//     },
//     {
//       id: 2,
//       name: "Teckcombank Phan Đình Phương",
//     },
//     {
//       id: 3,
//       name: "Agribank Phan Đình Phương",
//     },
//   ];

//   const getDetailOrder = async () => {
//     try {
//       const orderApi = new OrderApi();
//       const res = await orderApi.getOrderById(idOrder.id);
//       setDataOrder(res?.data.data);
//     } catch (error) {
//       customToast.error(error);
//     }
//   };

//   useEffect(() => {
//     getDetailOrder();
//   }, [idOrder]);

//   const schema = yup.object().shape({
//     paymentPrice: yup
//       .string()
//       .typeError("Vui lòng nhập thành tiền")
//       .required("Vui lòng nhập thành tiền"),
//     paymentType: yup
//       .object()
//       .typeError("Vui lòng chọn phương thức thanh toán")
//       .required("Vui lòng chọn phương thức thanh toán"),
//   });

//   const defaultValues = useMemo(
//     () => ({
//       // note: "",
//       paymentPrice: dataOrder?.finalTotal,
//       createdDate: dateNow,
//       paymentType: "",
//     }),
//     [dataOrder]
//   );

//   const methods = useForm({
//     mode: "onSubmit",
//     defaultValues,
//     resolver: yupResolver(schema),
//   });

//   const { formState, watch, setValue, handleSubmit, reset } = methods;
//   const { errors } = formState;
//   const paymentTypeWatch = watch("paymentType");
//   const watchPrice = watch("paymentPrice");
//   const paymentBankWatch = watch("paymentBank");

//   useEffect(() => {
//     setValue("paymentPrice", convertCurrency(dataOrder?.finalTotal));
//   }, [dataOrder]);

//   useEffect(() => {
//     if (paymentTypeWatch.id == 1) {
//       setDisabledPTTT(true);
//     } else if (paymentTypeWatch.id == 2) {
//       setOptionPTTT(bankBanking);
//       setDisabledPTTT(false);
//     }
//   }, [paymentTypeWatch]);

//   const handleChange = (event, newValue) => {
//     setValueChange(newValue);
//   };

//   const onClickCancel = () => {
//     customToast.warning("Coming soon...");
//   };

//   const onSubmit = async (value) => {
//     const amount = numberFormat(value?.paymentPrice);
//     const note = value?.note;
//     if (paymentTypeWatch.id == 1) {
//       try {
//         const params = {
//           orderCode: dataOrder?.code,
//           // note: value?.note,
//         };

//         const orderApi = new OrderApi();
//         const response = await orderApi.payment(params);
//         customToast.success("Thanh toán thành công");
//         navigate(`/admin/order/detail/${response.data.data.order.id}`);
//       } catch (error) {
//         customToast.error(error.response.data.message);
//       }
//     } else {
//       if (paymentBankWatch == null) {
//         customToast.warning("Vui lòng chọn phương thức thanh toán");
//         return;
//       }
//       try {
//         const params = {
//           orderCode: dataOrder?.code,
//           // paymentMethod: paymentTypeWatch?.name,
//           note: value?.note,
//         };

//         const orderApi = new OrderApi();
//         const response = await orderApi.payment(params);
//         customToast.success("Thanh toán thành công");
//         navigate(`/admin/order/detail/${response.data.data.order.id}`);
//       } catch (error) {
//         customToast.error(error.response.data.message);
//       }
//     }
//   };

//   const onClickUpdateStatus = async () => {
//     try {
//       const orderApi = new OrderApi();
//       const res = await orderApi.updateStatusOrder(dataOrder?.code, {
//         status: "Hủy đặt vé",
//       });
//       customToast.success("Cập nhật thành công");
//       getDetailOrder();
//       setOpenModal(false);
//     } catch (error) {
//       console.log(error);
//       customToast.error(error.response.data.message);
//     }
//   };
//   const checkPayment = () => {
//     return (
//       <div
//         className={"page-layout"}
//         style={{ marginLeft: "0px", marginTop: 10 }}
//       >
//         <Grid container overflow={"hidden"}>
//           <Grid flexDirection={{ xs: "column", md: "row" }} item>
//             <Tabs value={value} onChange={handleChange} textColor="primary">
//               <Tab label="Thanh toán" className="left-border" />
//             </Tabs>
//           </Grid>
//         </Grid>
//         <Divider />
//         {tabPayment()}
//       </div>
//     );
//   };

//   const tabPayment = () => {
//     if (value === 0) {
//       return (
//         <FormProvider {...methods}>
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <div className="content mt-2">
//               <Grid container spacing={2}>
//                 <Grid item xs={12}>
//                   <FormControlCustom
//                     classNameLabel={
//                       "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
//                     }
//                     className={"flex-direction-row"}
//                     label={"Thời gian"}
//                     fullWidth
//                   >
//                     <InputField
//                       disabled
//                       style={{ width: "100%" }}
//                       name={"createdDate"}
//                       placeholder={"Nhập thời gian"}
//                       error={Boolean(errors.createdDate)}
//                       helperText={""}
//                     />
//                   </FormControlCustom>
//                 </Grid>

//                 <Grid item xs={12}>
//                   <FormControlCustom
//                     classNameLabel={
//                       "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
//                     }
//                     className={"flex-direction-row"}
//                     label={"Số tiền"}
//                     fullWidth
//                   >
//                     <InputField
//                       disabled
//                       style={{ width: "100%" }}
//                       name={"paymentPrice"}
//                       placeholder={"Nhập thành tiền"}
//                       error={Boolean(errors.paymentPrice)}
//                       helperText={""}
//                     />
//                   </FormControlCustom>
//                 </Grid>

//                 <Grid item xs={12}>
//                   <FormControlCustom
//                     label={"PTTT"}
//                     classNameLabel={
//                       "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
//                     }
//                     className={"flex-direction-row"}
//                     fullWidth
//                   >
//                     <SelectCustom
//                       style={{ width: "100%" }}
//                       name={"paymentType"}
//                       placeholder={"Chọn PTTT"}
//                       options={bankData}
//                       error={Boolean(errors.paymentType)}
//                       helperText={""}
//                     />
//                   </FormControlCustom>
//                 </Grid>

//                 {/* <Grid item xs={12}>
//                   <FormControlCustom
//                     classNameLabel={
//                       "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
//                     }
//                     className={"flex-direction-row"}
//                     label={"Ghi chú"}
//                     fullWidth
//                   >
//                     <InputField
//                       style={{ width: "100%" }}
//                       multiline
//                       rows={3}
//                       name={"note"}
//                       placeholder={"Nhập ghi chú"}
//                       error={Boolean(errors.note)}
//                       helperText={""}
//                     />
//                   </FormControlCustom>
//                 </Grid> */}
//               </Grid>
//             </div>
//             <Grid
//               container
//               spacing={2}
//               className={`mt-1`}
//               justifyContent="center"
//             >
//               <Grid item xs={7}>
//                 <Button
//                   variant="contained"
//                   size="medium"
//                   className={`btn-tertiary-normal`}
//                   style={{ height: "2rem" }}
//                   type="submit"
//                   disabled={dataOrder?.status == "Đã hủy" ? true : false}
//                 >
//                   Thanh toán
//                 </Button>
//               </Grid>
//             </Grid>
//           </form>
//         </FormProvider>
//       );
//     } else {
//       return (
//         <FormProvider {...methods}>
//           <form>
//             <div className="content mt-2" style={{ width: 380 }}>
//               <Grid container spacing={2}>
//                 <Grid item xs={12}>
//                   <TableContainer component={Paper} style={{ width: "100%" }}>
//                     <Table
//                       size="small"
//                       aria-label="a dense table"
//                       padding="none"
//                       style={{ width: "100%" }}
//                     >
//                       <TableHead>
//                         <TableRow>
//                           <TableCell
//                             align={"center"}
//                             padding="none"
//                             style={{ width: "100px" }}
//                           >
//                             Thời gian
//                           </TableCell>
//                           <TableCell
//                             align={"center"}
//                             padding="none"
//                             style={{ width: "100px" }}
//                           >
//                             Nội dung
//                           </TableCell>
//                           <TableCell
//                             align={"center"}
//                             padding="none"
//                             style={{ width: "100px" }}
//                           >
//                             Số tiền
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         <TableRow>
//                           <TableCell align={"center"}>30/04/2023</TableCell>
//                           <TableCell align={"center"}>
//                             Phương chuyển khoản
//                           </TableCell>
//                           <TableCell align={"center"}>330.000đ</TableCell>
//                         </TableRow>
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </Grid>
//               </Grid>
//             </div>
//           </form>
//         </FormProvider>
//       );
//     }
//   };

//   const checkPaymentOrder = () => {
//     return (
//       <Grid container md={12}>
//         <div
//           className={"page-layout"}
//           style={{
//             marginLeft: "0px",
//             border: "3px solid #F5F5F5",
//             padding: 10,
//           }}
//         >
//           <Grid item className={"align-items-center header_title"}>
//             <Grid item md={7}>
//               <h2 className={"txt-title"}>THANH TOÁN</h2>
//             </Grid>
//           </Grid>
//           <Divider style={{ marginTop: 10, marginBottom: 10 }} />
//           <div>
//             <div style={{ display: "flex", justifyContent: "space-between" }}>
//               <span className={"order-custom-title"}>Tổng tiền VND</span>
//               <span className={"order-field-value"}>
//                 {convertCurrency(dataOrder?.total)}
//               </span>
//             </div>
//             <Divider style={{ borderStyle: "dashed", margin: "10px 0" }} />
//             <div style={{ display: "flex", justifyContent: "space-between" }}>
//               <span className={"order-custom-title"}>Giảm giá</span>
//               <span className={"order-field-value"}>
//                 {convertCurrency(dataOrder?.total - dataOrder?.finalTotal)}
//               </span>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 margin: "12px 0",
//               }}
//             >
//               <span className={"order-custom-title"}>Thành tiền</span>
//               <span className={"order-field-value"}>
//                 {convertCurrency(dataOrder?.finalTotal)}
//               </span>
//             </div>
//             <div style={{ display: "flex", justifyContent: "space-between" }}>
//               <span className={"order-custom-title"}>Đã thanh toán</span>
//               <span className={"order-field-value"}>0</span>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 margin: "12px 0",
//               }}
//             >
//               <span className={"order-custom-title"}>
//                 Số tiền cần thanh toán
//               </span>
//               <span className={"order-field-value"}>
//                 {convertCurrency(dataOrder?.finalTotal)}
//               </span>
//             </div>
//           </div>
//           <Divider />
//           {checkPayment()}
//         </div>
//       </Grid>
//     );
//   };

//   return (
//     <div className={"page-layout-blank"}>
//       <Helmet>
//         <title> CITY BUS - Chi tiết hóa đơn</title>
//       </Helmet>
//       <Grid container spacing={1}>
//         <Grid item md={8}>
//           <div
//             className={"page-layout"}
//             style={{ border: "3px solid #F5F5F5", padding: 10 }}
//           >
//             <Grid
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <div style={{ display: "flex", alignItems: "center" }}>
//                 <div>
//                   <h2 className={"txt-title"}>ĐƠN #{dataOrder?.code}</h2>
//                 </div>
//                 <div style={{ padding: "2px 5px" }}>
//                   <div
//                     style={{
//                       backgroundColor:
//                         dataOrder?.status == "Chờ thanh toán"
//                           ? "#949b36"
//                           : "#e54242",
//                       borderRadius: "15px",
//                     }}
//                   >
//                     <span
//                       style={{
//                         color: "white",
//                         fontSize: "0.73rem",
//                         fontWeight: "600",
//                         padding: "2px 5px",
//                         display: "flex",
//                         alignItems: "center",
//                       }}
//                     >
//                       {dataOrder?.status}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               {dataOrder?.status == "Chờ thanh toán" ? (
//                 <div>
//                   <Button
//                     style={{
//                       backgroundColor: "#27c24c",
//                       padding: "1px 4px",
//                       textTransform: "none",
//                     }}
//                     onClick={() => handleOpenModal()}
//                   >
//                     <span
//                       style={{
//                         color: "white",
//                         fontSize: "0.7rem",
//                         fontWeight: "600",
//                         padding: "2px 5px",
//                         display: "flex",
//                         alignItems: "center",
//                       }}
//                     >
//                       Hủy vé
//                     </span>
//                   </Button>
//                 </div>
//               ) : null}
//             </Grid>

//             <Divider style={{ marginTop: 10 }} />

//             <FormProvider {...methods}>
//               <form>
//                 <div className="content mt-2">
//                   <Grid container spacing={1}>
//                     <Grid item xs={6}>
//                       <FormControlCustom
//                         label={"Khách hàng*"}
//                         classNameLabel={
//                           "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
//                         }
//                         className={"flex-direction-row"}
//                         fullWidth
//                       >
//                         <TextField
//                           className={"disabled-field input-detail"}
//                           style={{ width: "100%" }}
//                           disabled={disabled}
//                           value={dataOrder?.customer?.fullName}
//                         />
//                       </FormControlCustom>
//                     </Grid>

//                     <Grid item xs={6}>
//                       <FormControlCustom
//                         label={"Địa chỉ"}
//                         classNameLabel={
//                           "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
//                         }
//                         className={"flex-direction-row"}
//                         fullWidth
//                       >
//                         <TextField
//                           className={"disabled-field input-detail"}
//                           style={{ width: "100%" }}
//                           disabled={disabled}
//                           value={dataOrder?.customer?.fullAddress}
//                         />
//                       </FormControlCustom>
//                     </Grid>

//                     <Grid item xs={6}>
//                       <FormControlCustom
//                         classNameLabel={
//                           "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
//                         }
//                         className={"flex-direction-row"}
//                         label={"Điện thoại"}
//                         fullWidth
//                       >
//                         <TextField
//                           className={"disabled-field input-detail"}
//                           style={{ width: "100%" }}
//                           disabled={disabled}
//                           value={dataOrder?.customer?.phone}
//                         />
//                       </FormControlCustom>
//                     </Grid>

//                     <Grid item xs={6}>
//                       <FormControlCustom
//                         classNameLabel={
//                           "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
//                         }
//                         className={"flex-direction-row"}
//                         label={"Email"}
//                         fullWidth
//                       >
//                         <TextField
//                           style={{ width: "100%" }}
//                           disabled={disabled}
//                           className={"disabled-field input-detail"}
//                           value={dataOrder?.customer?.email}
//                         />
//                       </FormControlCustom>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <FormControlCustom
//                         classNameLabel={
//                           "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
//                         }
//                         className={"flex-direction-row"}
//                         label={"Mã khuyến mãi"}
//                         fullWidth
//                       >
//                         <TextField
//                           style={{ width: "100%" }}
//                           disabled={disabled}
//                           className={"disabled-field input-detail"}
//                           value={dataOrder?.promotionHistories
//                             ?.map((item) => item.promotionLineCode)
//                             .join(", ")}
//                         />
//                       </FormControlCustom>
//                     </Grid>

//                     <Grid item xs={6}>
//                       <FormControlCustom
//                         classNameLabel={
//                           "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
//                         }
//                         className={"flex-direction-row"}
//                         label={"Nhân viên"}
//                         fullWidth
//                       >
//                         <TextField
//                           style={{ width: "100%" }}
//                           disabled={disabled}
//                           className={"disabled-field input-detail"}
//                           value={dataOrder?.staff?.fullName}
//                         />
//                       </FormControlCustom>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <FormControlCustom
//                         classNameLabel={
//                           " mr-1 w-100 justify-content-start order-custom-title"
//                         }
//                         className={"flex-direction-row"}
//                         label={"Ghi chú"}
//                         fullWidth
//                       >
//                         <TextField
//                           style={{ width: "100%" }}
//                           disabled={disabled}
//                           className={"disabled-field input-detail"}
//                           value={dataOrder?.note}
//                           multiline
//                           rows={3}
//                         />
//                       </FormControlCustom>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <FormControlCustom
//                         classNameLabel={
//                           "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
//                         }
//                         className={"flex-direction-row"}
//                         label={"Thời gian"}
//                         fullWidth
//                       >
//                         <TextField
//                           style={{ width: "100%" }}
//                           disabled={disabled}
//                           className={"disabled-field input-detail"}
//                           value={moment(dataOrder?.createdAt).format('DD/MM/YYYY hh:mm') }
//                           // value={dataOrder?.createdAt}
//                         />
//                       </FormControlCustom>
//                     </Grid>
//                   </Grid>
//                 </div>
//               </form>
//             </FormProvider>
//           </div>
//           <div
//             className={"page-layout"}
//             style={{ border: "3px solid #F5F5F5", padding: 10, marginTop: 20 }}
//           >
//             <Grid item className={"align-items-center header_title"}>
//               <Grid item md={7}>
//                 <h2 className={"txt-title"}>DANH SÁCH VÉ ĐÃ ĐẶT</h2>
//               </Grid>
//             </Grid>
//             <TicketListDetail
//               data={dataOrder?.orderDetails || []}
//               onClickPrint={onClickCancel}
//             ></TicketListDetail>
//           </div>
//         </Grid>
//         <Grid item md={4}>
//           {checkPaymentOrder()}
//         </Grid>
//       </Grid>
//       <ModalAlert
//         open={openModal}
//         handleClose={() => handleCloseModal()}
//         handleCancel={() => handleCloseModal()}
//         handleConfirm={() => onClickUpdateStatus()}
//         title={"Xác nhận hủy"}
//         description={
//           "Thao tác sẽ không thể hoàn tác, bạn có chắc chắn muốn tiếp tục không?"
//         }
//         type={"error"}
//         icon={true}
//         renderContentModal={
//           <div className="view-input-discount">
//             <span>Mã đơn: {dataOrder?.code} </span>
//           </div>
//         }
//       />
//     </div>
//   );
// };

// export default TicketDetail;

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
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import FormControlCustom from "../../../components/FormControl";
import SelectCustom from "../../../components/SelectCustom";
import InputField from "../../../components/InputField";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";
import TicketBookingList from "../AdminAddTicket/TicketBookingList";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import {
  convertCurrency,
  currencyMark,
  numberFormat,
} from "../../../data/curren";
import "./AdminTicketList.scss";
import { useNavigate, useParams } from "react-router-dom";
import { OrderApi } from "../../../utils/orderApi";
import customToast from "../../../components/ToastCustom";
import { CustomerApi } from "../../../utils/customerApi";
import TicketListDetail from "./components/TicketListDetail";
import ModalAlert from "../../../components/Modal";

const TicketDetail = (props) => {
  const [orderDetail, setOrderDetail] = useState();
  const dateNow = moment(new Date()).utcOffset(7).format("DD-MM-YYYY hh:mm");
  const [value, setValueChange] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const idOrder = useParams();
  const [dataOrder, setDataOrder] = useState();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [disabledPTTT, setDisabledPTTT] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const bankData = [
    {
      id: 1,
      name: "Tiền mặt",
    },
    {
      id: 2,
      name: "ZaloPay",
    },
  ];

  const getDetailOrder = async () => {
    try {
      const orderApi = new OrderApi();
      const res = await orderApi.getOrderById(idOrder.id);
      setDataOrder(res?.data.data);
    } catch (error) {
      customToast.error(error);
    }
  };

  useEffect(() => {
    getDetailOrder();
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
  });

  const defaultValues = useMemo(
    () => ({
      // note: "",
      paymentPrice: dataOrder?.finalTotal,
      createdDate: dateNow,
      paymentType: "",
    }),
    [dataOrder]
  );

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
    setValue("paymentPrice", convertCurrency(dataOrder?.finalTotal));
  }, [dataOrder]);

  useEffect(() => {
    if (paymentTypeWatch.id == 1) {
      setDisabledPTTT(true);
    } else if (paymentTypeWatch.id == 2) {
      setDisabledPTTT(true);
    }
  }, [paymentTypeWatch]);

  const handleChange = (event, newValue) => {
    setValueChange(newValue);
  };

  const onClickCancel = () => {
    customToast.warning("Coming soon...");
  };

  const onSubmit = async (value) => {
    const amount = numberFormat(value?.paymentPrice);
    const note = value?.note;
    if (paymentTypeWatch.id == 1) {
      try {
        const params = {
          orderCode: dataOrder?.code,
          // note: value?.note,
        };

        const orderApi = new OrderApi();
        const response = await orderApi.payment(params);
        customToast.success("Thanh toán thành công");
        navigate(`/admin/order/detail/${response.data.data.order.id}`);
      } catch (error) {
        customToast.error(error.response.data.message);
      }
    } else if(paymentTypeWatch.id == 2){

      console.log(paymentTypeWatch);
      
      try {
        console.log("dataOrder", dataOrder);
        console.log("dataOrderCus", dataOrder?.customer?.id);
        const orderApi = new OrderApi();
        const res = await orderApi.bookingZalo({ orderCode: dataOrder?.code });
        console.log("dataOrder-------", dataOrder);
        console.log("response?.data-------", res?.data?.data?.zalo?.order_url);
        const openZaloPayment = (url) => {
          const newWindow = window.open(url, '_blank');
          if (!newWindow) {
            // Nếu không thể mở cửa sổ mới (do popup bị chặn), bạn có thể thông báo cho người dùng.
            alert("Popup bị chặn! Vui lòng kiểm tra cài đặt trình duyệt.");
            return;
          }

          // const monitorInterval = setInterval(() => {
          //   try {
          //     // Kiểm tra URL hiện tại của cửa sổ
          //     const currentURL = newWindow.location.href;
          //     console.log("currentURL: ", currentURL);
      
          //     if (currentURL.includes("https://kltn-web-admin-city-bus.vercel.app/")) {
          //       // Nếu URL trỏ về link B, tự động đóng cửa sổ
          //       newWindow.close();
          //       clearInterval(monitorInterval);
          //       alert("Thanh toán hoàn tất và cửa sổ đã được đóng!");
          //     }
          //   } catch (err) {
          //     // Ignore cross-origin errors (nếu có)
          //   }
      
          //   // Kiểm tra nếu cửa sổ bị đóng thủ công
          //   if (newWindow.closed) {
          //     clearInterval(monitorInterval);
          //   }
          // }, 1000); // Kiểm tra mỗi giây

          const monitorInterval = setInterval(() => {
            try {
              // Kiểm tra xem cửa sổ vẫn tồn tại và chưa bị đóng
              if (newWindow && !newWindow.closed) {
                // Kiểm tra URL hiện tại của cửa sổ
                const currentURL = newWindow.location.href;
                console.log("currentURL: ", currentURL);
          
                // Nếu URL trỏ về link B, tự động đóng cửa sổ
                if (currentURL.includes("/check-status")) {
                  newWindow.close(); // Đóng cửa sổ
                  clearInterval(monitorInterval); // Ngừng kiểm tra
                  alert("Thanh toán hoàn tất và cửa sổ đã được đóng!");
                }
              } else {
                // Nếu cửa sổ đã bị đóng thủ công
                clearInterval(monitorInterval); // Ngừng kiểm tra
                console.log("Cửa sổ đã bị đóng.");
              }
            } catch (err) {
              // Bỏ qua lỗi Cross-Origin nếu không truy cập được URL
              console.error("Không thể truy cập URL của cửa sổ do Cross-Origin.");
            }
          }, 1000);
        
          // Chờ cửa sổ thanh toán ZaloPay đóng lại
          const checkPaymentStatus = async () => {
            const timer = setInterval(async () => {
              if (newWindow.closed) {
                clearInterval(timer); // Ngừng kiểm tra khi cửa sổ bị đóng
        
                // Cửa sổ thanh toán đã đóng, bắt đầu xử lý dữ liệu
                try {
                  const abc = await orderApi.getOrderById(dataOrder.id);
                  const order = abc.data.data;
                  console.log('order: ', order?.code);
                  console.log('paymentMethod: ', order?.paymentMethod);
        
                  const response = await orderApi.checkStatusZaloPay({
                    orderCode: order?.code,
                    paymentMethod: order?.paymentMethod,
                  });
                  console.log("Thanh toán ZaloPay thành công. Dữ liệu trạng thái: ", response);
        
                  const paymentStatus = response.data.data;
                  console.log("response.data: ", response.data);
                  console.log("payment: ", paymentStatus.id);
                  console.log("paymentStatus: ", paymentStatus?.status);
        
                  if (paymentStatus?.status === "Đã thanh toán") {
                    // Thanh toán thành công, thông báo và điều hướng về trang ban đầu
                    customToast.success("Thanh toán thành công");
                    // window.location.href = "/admin/order/detail/${paymentStatus.id}"; 
                    navigate(`/admin/order/detail/${paymentStatus.id}`);
                  } else {
                    // Xử lý trường hợp thanh toán chưa hoàn tất
                    customToast.error("Thanh toán không thành công hoặc đang được xử lý.");
                  }
                } catch (error) {
                  customToast.error(error.response?.data?.message || "Lỗi khi kiểm tra trạng thái thanh toán");
                }
              }
            }, 1000); // Kiểm tra mỗi giây
          };
        
          // Khởi động kiểm tra thanh toán khi mở cửa sổ
          checkPaymentStatus();
        };
        openZaloPayment(res.data.data.zalo.order_url);

        // console.log("dataOrder", dataOrder);
        // console.log("dataOrderCus", dataOrder?.customer?.id);

        // const orderApi = new OrderApi();
        // const res = await orderApi.bookingZalo({ orderCode: dataOrder?.code });
        // console.log("dataOrder-------", dataOrder);
        // console.log("response?.data-------", res?.data?.data?.zalo?.order_url);

        // const embedZaloPayment = async (url) => {
        //   try {
        //     // Hiển thị giao diện thanh toán bằng iframe
        //     const paymentContainer = document.getElementById("payment-container");
        //     paymentContainer.innerHTML = ""; // Xóa nội dung cũ (nếu có)
            
        //     const iframe = document.createElement("iframe");
        //     iframe.src = url; // URL thanh toán
        //     iframe.style.width = "100%";
        //     iframe.style.height = "600px"; // Điều chỉnh chiều cao tùy ý
        //     iframe.style.border = "none";
        //     iframe.allow = "payment"; // Cần thiết để nhúng thanh toán
        //     paymentContainer.appendChild(iframe);

        //     // Theo dõi trạng thái thanh toán
        //     const checkPaymentStatus = async () => {
        //       try {
        //         const abc = await orderApi.getOrderById(dataOrder.id);
        //         const order = abc.data.data;
        //         console.log("order: ", order?.code);
        //         console.log("paymentMethod: ", order?.paymentMethod);

        //         const response = await orderApi.checkStatusZaloPay({
        //           orderCode: order?.code,
        //           paymentMethod: order?.paymentMethod,
        //         });
        //         console.log("Dữ liệu trạng thái thanh toán: ", response);

        //         const paymentStatus = response.data.data;
        //         console.log("response.data: ", response.data);
        //         console.log("payment: ", paymentStatus.id);
        //         console.log("paymentStatus: ", paymentStatus?.status);

        //           if (paymentStatus?.status === "Đã thanh toán") {
        //             // Thanh toán thành công, thông báo và điều hướng
        //             customToast.success("Thanh toán thành công");
        //             navigate(`/admin/order/detail/${paymentStatus.id}`);
        //             const paymentContainer = document.getElementById("payment-container");
        //             if (paymentContainer) {
        //               paymentContainer.style.display = "none";
        //             }
        //           } else if (paymentStatus?.status === "Chờ thanh toán"){
        //             customToast.error("Thanh toán không thành công hoặc đang được xử lý.");
        //             navigate(`/admin/order/detail/${paymentStatus.id}`);
        //           }
        //       } catch (error) {
        //         customToast.error(error.response?.data?.message || "Lỗi khi kiểm tra trạng thái thanh toán");
        //         const paymentContainer = document.getElementById("payment-container");
        //         if (paymentContainer) {
        //           paymentContainer.style.display = "none";
        //         }
        //       }
        //     };

        //     // Theo dõi trạng thái sau một khoảng thời gian
        //     setTimeout(checkPaymentStatus, 50000); 
        //   } catch (error) {
        //     customToast.error("Lỗi khi thực hiện thanh toán: " + (error.message || "Không xác định"));
        //   }
        // };

        // // Nhúng thanh toán vào iframe
        // embedZaloPayment(res.data.data.zalo.order_url);
      } catch (error) {
        customToast.error(error.response.data.message);
      }

    }
  };

  const onClickUpdateStatus = async () => {
    try {
      const orderApi = new OrderApi();
      const res = await orderApi.updateStatusOrder(dataOrder?.code, {
        status: "Hủy đặt vé",
      });
      customToast.success("Cập nhật thành công");
      getDetailOrder();
      setOpenModal(false);
    } catch (error) {
      console.log(error);
      customToast.error(error.response.data.message);
    }
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
              <Tab label="Thanh toán" className="left-border" />
            </Tabs>
          </Grid>
        </Grid>
        <Divider />
        {tabPayment()}
      </div>
    );
  };

  const tabPayment = () => {
    if (value === 0) {
      return (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="content mt-2">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlCustom
                    classNameLabel={
                      "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                    }
                    className={"flex-direction-row"}
                    label={"Thời gian"}
                    fullWidth
                  >
                    <InputField
                      disabled
                      style={{ width: "100%" }}
                      name={"createdDate"}
                      placeholder={"Nhập thời gian"}
                      error={Boolean(errors.createdDate)}
                      helperText={""}
                    />
                  </FormControlCustom>
                </Grid>

                <Grid item xs={12}>
                  <FormControlCustom
                    classNameLabel={
                      "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                    }
                    className={"flex-direction-row"}
                    label={"Số tiền"}
                    fullWidth
                  >
                    <InputField
                      disabled
                      style={{ width: "100%" }}
                      name={"paymentPrice"}
                      placeholder={"Nhập thành tiền"}
                      error={Boolean(errors.paymentPrice)}
                      helperText={""}
                    />
                  </FormControlCustom>
                </Grid>

                <Grid item xs={12}>
                  <FormControlCustom
                    label={"PTTT"}
                    classNameLabel={
                      "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                    }
                    className={"flex-direction-row"}
                    fullWidth
                  >
                    <SelectCustom
                      style={{ width: "100%" }}
                      name={"paymentType"}
                      placeholder={"Chọn PTTT"}
                      options={bankData}
                      error={Boolean(errors.paymentType)}
                      helperText={""}
                    />
                  </FormControlCustom>
                </Grid>

                {/* <Grid item xs={12}>
                  <FormControlCustom
                    classNameLabel={
                      "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                    }
                    className={"flex-direction-row"}
                    label={"Ghi chú"}
                    fullWidth
                  >
                    <InputField
                      style={{ width: "100%" }}
                      multiline
                      rows={3}
                      name={"note"}
                      placeholder={"Nhập ghi chú"}
                      error={Boolean(errors.note)}
                      helperText={""}
                    />
                  </FormControlCustom>
                </Grid> */}
              </Grid>
            </div>
            <Grid
              container
              spacing={2}
              className={`mt-1`}
              justifyContent="center"
            >
              <Grid item xs={7}>
                <Button
                  variant="contained"
                  size="medium"
                  className={`btn-tertiary-normal`}
                  style={{ height: "2rem" }}
                  type="submit"
                  disabled={dataOrder?.status == "Đã hủy" ? true : false}
                >
                  Thanh toán
                </Button>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      );
    } else {
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
                            Nội dung
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
                          <TableCell align={"center"}>30/04/2023</TableCell>
                          <TableCell align={"center"}>
                            Phương chuyển khoản
                          </TableCell>
                          <TableCell align={"center"}>330.000đ</TableCell>
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
    }
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className={"order-custom-title"}>Đã thanh toán</span>
              <span className={"order-field-value"}>0</span>
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
                {convertCurrency(dataOrder?.finalTotal)}
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
        <title> VoYaCuw - Chi tiết hóa đơn</title>
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
                  <h2 className={"txt-title"}>ĐƠN #{dataOrder?.code}</h2>
                </div>
                <div style={{ padding: "2px 5px" }}>
                  <div
                    style={{
                      backgroundColor:
                        dataOrder?.status == "Chờ thanh toán"
                          ? "#949b36"
                          : "#e54242",
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
                      {dataOrder?.status}
                    </span>
                  </div>
                </div>
              </div>
              {dataOrder?.status == "Chờ thanh toán" ? (
                <div>
                  <Button
                    style={{
                      backgroundColor: "#27c24c",
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
                      Hủy vé
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
                          value={dataOrder?.note}
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
                        label={"Thời gian"}
                        fullWidth
                      >
                        <TextField
                          style={{ width: "100%" }}
                          disabled={disabled}
                          className={"disabled-field input-detail"}
                          value={moment(dataOrder?.createdAt).format('DD/MM/YYYY hh:mm') }
                          // value={dataOrder?.createdAt}
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
            <TicketListDetail
              data={dataOrder?.orderDetails || []}
              onClickPrint={onClickCancel}
            ></TicketListDetail>
          </div>

          {/* ------------------------------------------------------------- */}
          <div id="payment-container" style={{ marginTop: '20px', minHeight: '100px', backgroundColor: '#f5f5f5' }}></div>

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
        title={"Xác nhận hủy"}
        description={
          "Thao tác sẽ không thể hoàn tác, bạn có chắc chắn muốn tiếp tục không?"
        }
        type={"error"}
        icon={true}
        renderContentModal={
          <div className="view-input-discount">
            <span>Mã đơn: {dataOrder?.code} </span>
          </div>
        }
      />
    </div>
  );
};

export default TicketDetail;
