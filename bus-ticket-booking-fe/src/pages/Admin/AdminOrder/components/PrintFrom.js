// import { Box, Grid } from "@mui/material";
// import moment from "moment";
// import React, { useState } from "react";
// import { Helmet } from "react-helmet";
// import TicketOrderList from "./TicketOrderList";
// import { DataGrid } from "@mui/x-data-grid";
// import { convertCurrency } from "../../../../data/curren";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import QRCode from "qrcode.react";

// const PrintForm = React.forwardRef((props, ref) => {
//   const dataOrder = props.dataOrder;

//   return (
//     <div
//       ref={ref}
//       style={{
//         width: "100%",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         marginTop: 50,
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           flexDirection: "column",
//           width: "100%",
//         }}
//       >
//         <span
//           style={{
//             fontSize: 25,
//             textTransform: "uppercase",
//             fontWeight: "bold",
//           }}
//         >
//           Hệ thống đặt vé xe CITY BUS
//         </span>
//         <span>Dịa chỉ: Gò Vấp - Thành phố Hồ Chí Minh</span>
//         <span>Điện thoại: 0354.043.344</span>
//         <span
//           style={{
//             fontSize: 20,
//             textTransform: "uppercase",
//             fontWeight: "bold",
//             marginTop: 10,
//             marginBottom: 20,
//           }}
//         >
//           Hóa đơn đặt vé
//         </span>
//         <QRCode value={dataOrder?.code} style={{ marginBottom: 50 }} />
//       </div>
//       <div style={{ width: "100%" }}>
//         <Grid container spacing={1}>
//           <Grid item xs={6}>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//               }}
//             >
//               <p>Mã hóa đơn: {dataOrder?.code}</p>
//             </div>
//           </Grid>
//           <Grid item xs={6}>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//               }}
//             >
//               <p>
//                 Ngày đặt:{" "}
//                 {moment(dataOrder?.createdAt).format("DD/MM/YYYY HH:MM")}
//               </p>
//             </div>
//           </Grid>

//           <Grid item xs={6}>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//               }}
//             >
//               <p>Khách hàng: {dataOrder?.customer?.fullName}</p>
//             </div>
//           </Grid>

//           <Grid item xs={6}>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//               }}
//             >
//               <p>Điện thoại: {dataOrder?.customer?.phone}</p>
//             </div>
//           </Grid>
//           <Grid item xs={6}>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//               }}
//             >
//               <p>
//                 Nơi đi:{" "}
//                 {
//                   dataOrder?.orderDetails[0]?.ticketDetail.ticket.tripDetail
//                     .trip.fromStation.name
//                 }{" "}
//               </p>
//             </div>
//           </Grid>
//           <Grid item xs={6}>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//               }}
//             >
//               <p>
//                 Nơi đến:{" "}
//                 {
//                   dataOrder?.orderDetails[0]?.ticketDetail.ticket.tripDetail
//                     .trip.toStation.name
//                 }
//               </p>
//             </div>
//           </Grid>

//           <Grid item xs={6}>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//               }}
//             >
//               <p>
//                 Tên xe:{" "}
//                 {dataOrder?.orderDetails[0]?.ticketDetail.seat?.vehicle?.name}
//               </p>
//             </div>
//           </Grid>
//           <Grid item xs={6}>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//               }}
//             >
//               <p>
//                 Biển số xe:{" "}
//                 {
//                   dataOrder?.orderDetails[0]?.ticketDetail.seat?.vehicle
//                     ?.licensePlate
//                 }
//               </p>
//             </div>
//           </Grid>
//           <Grid item xs={6}>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//               }}
//             >
//               <p>
//                 Số ghế:{" "}
//                 {dataOrder?.orderDetails
//                   ?.map((item) => item.ticketDetail.seat.name)
//                   .join(",")}
//               </p>
//             </div>
//           </Grid>
//           <Grid item xs={6}>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//               }}
//             >
//               <p>
//                 Thời gian khởi hành:{" "}
//                 {moment(
//                   dataOrder?.orderDetails[0]?.ticketDetail?.ticket?.tripDetail
//                     ?.departureTime
//                 ).format("DD/MM/YYYY HH:MM")}
//               </p>
//             </div>
//           </Grid>
//         </Grid>
//         <div>
//           <Grid container spacing={2} style={{ marginTop: 10 }}>
//             <Grid item xs={7}></Grid>
//             <Grid item xs={4}>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <p>
//                   {" "}
//                   <span style={{ fontWeight: "bold", marginRight: 20 }}>
//                     Số lượng vé:
//                   </span>{" "}
//                 </p>
//                 <p>{dataOrder?.orderDetails.length}</p>
//               </div>

//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <p>
//                   {" "}
//                   <span style={{ fontWeight: "bold", marginRight: 20 }}>
//                     Tổng tiền:{" "}
//                   </span>
//                 </p>
//                 <p>{convertCurrency(dataOrder?.total)}</p>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <p>
//                   <span style={{ fontWeight: "bold", marginRight: 20 }}>
//                     Giảm giá:
//                   </span>{" "}
//                 </p>
//                 <p>
//                   {convertCurrency(dataOrder?.finalTotal - dataOrder?.total)}
//                 </p>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <p>
//                   <span style={{ fontWeight: "bold", marginRight: 20 }}>
//                     Thành tiền:{" "}
//                   </span>
//                 </p>
//                 <p>{convertCurrency(dataOrder?.finalTotal)}</p>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <p>
//                   <span style={{ fontWeight: "bold", marginRight: 20 }}>
//                     Trạng thái:{" "}
//                   </span>
//                 </p>
//                 <p> {dataOrder?.status}</p>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <p>
//                   <span style={{ fontWeight: "bold", marginRight: 20 }}>
//                     Nhân viên:{" "}
//                   </span>
//                 </p>
//                 <p> {dataOrder?.staff?.fullName}</p>
//               </div>
//             </Grid>
//           </Grid>
          
//         </div>

//         <div>
//           <p style={{ marginTop: 100, textAlign: "center" }}>
//             Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default PrintForm;

import { Box, Grid } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import TicketOrderList from "./TicketOrderList";
import { DataGrid } from "@mui/x-data-grid";
import { convertCurrency } from "../../../../data/curren";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import QRCode from "qrcode.react";

const PrintForm = React.forwardRef(({ dataOrder }, ref) => {
  // const dataOrder = props.dataOrder;

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #000",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        fontFamily: "Roboto, Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ margin: "0", fontSize: "28px", fontWeight: "bold" }}>
          Hệ thống đặt vé City Bus
        </h1>
        <p style={{ margin: "5px 0", fontSize: "16px" }}>
          Địa chỉ: Gò Vấp - Thành phố Hồ Chí Minh
        </p>
        <p style={{ margin: "5px 0", fontSize: "16px" }}>Điện thoại: 0974.034.565</p>
      </div>

      {/* Vé xe và QR Code */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>
          Vé xe City Bus
        </h2>
        <p style={{ margin: "5px 0", fontSize: "16px" }}>
          (Đã bao gồm thuế GTGT và GHHK)
        </p>
        <QRCode value={dataOrder?.code} size={300} style={{ marginTop: "15px" }} />
      </div>

      {/* Bảng thông tin */}
      <TableContainer component={Paper} style={{ boxShadow: "none", marginBottom: "20px" }}>
        <Table size="medium">
          <TableBody>
            <TableRow>
              <TableCell style={{ width: "25%", fontSize: "16px", fontWeight: "bold" }}>
                Khách hàng
              </TableCell>
              <TableCell style={{ width: "25%", fontSize: "16px" }}>
                {dataOrder?.customer?.fullName}
              </TableCell>
              <TableCell style={{ width: "25%", fontSize: "16px", fontWeight: "bold" }}>
                Điện thoại
              </TableCell>
              <TableCell style={{ width: "25%", fontSize: "16px" }}>
                {dataOrder?.customer?.phone}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ fontSize: "16px", fontWeight: "bold" }}>Nơi đi</TableCell>
              <TableCell style={{ fontSize: "16px" }}>
                {dataOrder?.orderDetails[0]?.ticketDetail.ticket.tripDetail.trip.fromStation.name}
              </TableCell>
              <TableCell style={{ fontSize: "16px", fontWeight: "bold" }}>Nơi đến</TableCell>
              <TableCell style={{ fontSize: "16px" }}>
                {dataOrder?.orderDetails[0]?.ticketDetail.ticket.tripDetail.trip.toStation.name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ fontSize: "16px", fontWeight: "bold" }}>Tên xe</TableCell>
              <TableCell style={{ fontSize: "16px" }}>
                {dataOrder?.orderDetails[0]?.ticketDetail.seat.vehicle.name}
              </TableCell>
              <TableCell style={{ fontSize: "16px", fontWeight: "bold" }}>Biển số xe</TableCell>
              <TableCell style={{ fontSize: "16px" }}>
                {dataOrder?.orderDetails[0]?.ticketDetail.seat.vehicle.licensePlate}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ fontSize: "16px", fontWeight: "bold" }}>Số ghế</TableCell>
              <TableCell style={{ fontSize: "16px" }}>
                {dataOrder?.orderDetails.map(item => item.ticketDetail.seat.name).join(", ")}
              </TableCell>
              <TableCell style={{ fontSize: "16px", fontWeight: "bold" }}>Thời gian</TableCell>
              <TableCell style={{ fontSize: "16px" }}>
                {moment(
                  dataOrder?.orderDetails[0]?.ticketDetail?.ticket?.tripDetail
                    ?.departureTime
                ).format("DD/MM/YYYY HH:mm")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} align="right" style={{ fontSize: "18px", fontWeight: "bold" }}>
                Tổng tiền:
              </TableCell>
              <TableCell style={{ fontSize: "18px" }}>{convertCurrency(dataOrder?.finalTotal)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "30px", fontSize: "16px" }}>
        <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
      </div>
    </div>
  );
});

export default PrintForm;
