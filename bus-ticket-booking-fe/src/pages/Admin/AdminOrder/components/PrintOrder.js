import React from "react";
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import QRCode from "qrcode.react";
import moment from "moment";
import { convertCurrency } from "../../../../data/curren";

const PrintOrder = React.forwardRef((props, ref) => {
  const { dataOrder } = props;

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ textTransform: "uppercase", fontWeight: "bold", marginBottom: 10 }}>Hệ thống đặt vé xe City Bus</h1>
        <p>Địa chỉ: Gò Vấp - Thành phố Hồ Chí Minh</p>
        <p>Điện thoại: 0974.034.565</p>
        <h2 style={{ textTransform: "uppercase", fontWeight: "bold", marginTop: 40 }}>Hóa đơn đặt vé</h2>
        <p style={{ margin: "5px 0", fontSize: "16px" }}>
          (Đã bao gồm thuế GTGT và GHHK)
        </p>
      </div>

      {/* Thông tin hóa đơn */}
      <Grid container spacing={2} style={{ marginBottom: "20px", justifyContent: "space-between", marginTop: 20 }}>
        <Grid item xs={6}>
          <p><strong>Mã hóa đơn:</strong> {dataOrder?.code}</p>
          <p><strong>Ngày đặt:</strong> {moment(dataOrder?.createdAt).format("DD/MM/YYYY HH:mm")}</p>
        </Grid>
        <Grid item xs={4}>
          <p><strong>Khách hàng:</strong> {dataOrder?.customer?.fullName}</p>
          <p><strong>Điện thoại:</strong> {dataOrder?.customer?.phone}</p>
        </Grid>
      </Grid>

      {/* Bảng thông tin vé */}
      <TableContainer component={Paper} style={{ marginBottom: "20px", marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nơi đi</strong></TableCell>
              <TableCell><strong>Nơi đến</strong></TableCell>
              <TableCell><strong>Tên xe</strong></TableCell>
              <TableCell><strong>Biển số</strong></TableCell>
              <TableCell><strong>Ghế</strong></TableCell>
              <TableCell><strong>Thời gian khởi hành</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataOrder?.orderDetails.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.ticketDetail.ticket.tripDetail.trip.fromStation.name}</TableCell>
                <TableCell>{item.ticketDetail.ticket.tripDetail.trip.toStation.name}</TableCell>
                <TableCell>{item.ticketDetail.seat.vehicle?.name}</TableCell>
                <TableCell>{item.ticketDetail.seat.vehicle?.licensePlate}</TableCell>
                <TableCell>{item.ticketDetail.seat.name}</TableCell>
                <TableCell>
                  {moment(item.ticketDetail.ticket.tripDetail.departureTime).format("DD/MM/YYYY HH:mm")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tổng tiền */}
      <div style={{ marginTop: "20px", width: "100%" }}>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item xs={4} md={4}>
            <p><strong>Số lượng vé:</strong> {dataOrder?.orderDetails.length}</p>
            <p><strong>Tổng tiền:</strong> {convertCurrency(dataOrder?.total)}</p>
            <p><strong>Giảm giá:</strong> {convertCurrency(dataOrder?.finalTotal - dataOrder?.total)}</p>
            <p><strong>Thành tiền:</strong> {convertCurrency(dataOrder?.finalTotal)}</p>
            <p><strong>Phương thức:</strong> {dataOrder?.paymentMethod}</p>
            <p><strong>Trạng thái:</strong> {dataOrder?.status}</p>
          </Grid>
        </Grid>
      </div>

      {/* Footer */}
      <p style={{ marginTop: "100px", textAlign: "center", justifyContent: 'end' }}>
        Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!
      </p>
    </div>
  );
});

export default PrintOrder;
