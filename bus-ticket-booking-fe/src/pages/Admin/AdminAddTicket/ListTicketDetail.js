import React, { useMemo } from "react";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  TextField,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import "./seat.scss";
import { styled } from '@mui/material/styles';


const useStyles = styled((theme) => ({
  dialogRoot: {
    minWidth: "70%",
    maxWidth: "70%",
    maxHeight: "100%",
    position: "fixed",
  },
  dialogContent: {
    padding: theme.spacing(2),
  },
}));

const ListTicketDetail = (props) => {
  const {
    setShowDrawer,
    showDrawer,
    dataTicket,
    setIdsSelected,
    dataTripDetail,
  } = props;
  const [seatsFloor1, setSeatsFloor1] = useState([]);
  const [seatsFloor2, setSeatsFloor2] = useState([]);
  const classes = useStyles();

  const handleSeat = async () => {
    const seatsFloor1 = [];
    const seatsFloor2 = [];
    if (dataTicket) {
      for (let i = 0; i < dataTicket.length; i++) {
        if (dataTicket[i].seat.floor == 1) {
          dataTicket[i].selected = false;
          seatsFloor1.push(dataTicket[i]);
        } else {
          dataTicket[i].selected = false;
          seatsFloor2.push(dataTicket[i]);
        }
      }
    }
    seatsFloor1.sort((a, b) => {
      // Tách phần không có số và phần có số của tên ghế
      const aParts = a.seat.name.match(/([a-zA-Z]+)([0-9]+)/);
      const bParts = b.seat.name.match(/([a-zA-Z]+)([0-9]+)/);

      // So sánh phần không có số
      if (aParts[1] < bParts[1]) {
        return -1;
      } else if (aParts[1] > bParts[1]) {
        return 1;
      } else {
        // So sánh phần có số
        const aNumber = parseInt(aParts[2], 10);
        const bNumber = parseInt(bParts[2], 10);
        return aNumber - bNumber;
      }
    });
    if (seatsFloor2.length > 0) {
      seatsFloor2.sort((a, b) => {
        // Tách phần không có số và phần có số của tên ghế
        const aParts = a.seat.name.match(/([a-zA-Z]+)([0-9]+)/);
        const bParts = b.seat.name.match(/([a-zA-Z]+)([0-9]+)/);

        // So sánh phần không có số
        if (aParts[1] < bParts[1]) {
          return -1;
        } else if (aParts[1] > bParts[1]) {
          return 1;
        } else {
          // So sánh phần có số
          const aNumber = parseInt(aParts[2], 10);
          const bNumber = parseInt(bParts[2], 10);
          return aNumber - bNumber;
        }
      });
    }
    setSeatsFloor1(seatsFloor1);
    setSeatsFloor2(seatsFloor2);
  };

  useEffect(() => {
    handleSeat();
  }, [dataTicket]);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSeatNames, setSelectedSeatNames] = useState([]);

  const handleSeatClick = (seatId) => {
    const seat = dataTicket.find((seat) => seat.id === seatId);
    const seatName = seat?.seat?.name;
    if (seat?.status == "Đã bán") {
      // seat is already booked, do not allow clicking
      return;
    }
    if (selectedSeats.includes(seatId)) {
      // If seat is already selected, remove it from the array
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
      setSelectedSeatNames(
        selectedSeatNames.filter((name) => name !== seatName)
      );
    } else {
      // Otherwise, add it to the array
      setSelectedSeats([...selectedSeats, seatId]);
      setSelectedSeatNames([...selectedSeatNames, seatName]);
    }
  };

  const onClickConfirm = () => {
    setShowDrawer(false);
    setIdsSelected(selectedSeats);
  };

  return (
    <div>
      <Dialog
        classes={{ paper: classes.dialogRoot }}
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        PaperProps={{
          sx: {
            width: 1000,
          },
        }}
      >
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            textAlign: "center",
            fontSize: 23,
            display: "flex",

            flexDirection: "row",
          }}
        >
          <InfoIcon
            style={{
              display: "block",
              fill: "#1a89ac",
              marginRight: 10,
              marginTop: 5,
              borderRadius: "50%",
              padding: 2,
              backgroundColor: "#fff",
            }}
          />
          Đặt vé xe khách ({dataTripDetail?.vehicle?.name}, biển số{" "}
          {dataTripDetail?.vehicle?.licensePlate},{" "}
          {dataTripDetail?.vehicle?.totalSeat} ghế)
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            {dataTripDetail?.vehicle?.totalSeat == 34 && (
              <div
                className="row"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginLeft: 20,
                  marginRight: 0,
                }}
              >
                <div>
                  <span>Tầng 1</span>
                  <div
                    className="seats-container"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <div>
                      <span></span>
                      {seatsFloor1.slice(0, 6).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className={`seat-none`}></div>
                      {seatsFloor1.slice(6, 11).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>
                    <div>
                      <span></span>
                      {seatsFloor1.slice(11).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <span>Tầng 2</span>
                  <div
                    className="seats-container"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <div>
                      <span></span>
                      {seatsFloor2.slice(0, 6).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className={`seat-none`}></div>
                      {seatsFloor2.slice(6, 11).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>
                    <div>
                      <span></span>
                      {seatsFloor2.slice(11).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>
                    <div style={{ color: "#000", marginLeft: 30 }}>
                      <span style={{ color: "#000" }}>Chú thích:</span>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",

                          alignItems: "center",
                        }}
                      >
                        <div className={`seat-2`}></div>
                        <span>Trống</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",

                          alignItems: "center",
                        }}
                      >
                        <div className={`seat-2 selected`}></div>
                        <span>Đang chọn</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",

                          alignItems: "center",
                        }}
                      >
                        <div className={`seat-2 disabled-sale`}></div>
                        <span>Đã đặt</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",

                          alignItems: "center",
                        }}
                      >
                        <div className={`seat-2 disabled-pending`}></div>
                        <span>Chờ xác nhận</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {dataTripDetail?.vehicle?.totalSeat == 44 && (
              <div
                className="row"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginLeft: 20,
                  marginRight: 0,
                }}
              >
                <div>
                  <span>Tầng 1</span>
                  <div
                    className="seats-container"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <div>
                      <span></span>
                      {seatsFloor1.slice(0, 7).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>
                    <div>
                      <span></span>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      {seatsFloor1.slice(7, 8).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className={`seat-none`}></div>
                      {seatsFloor1.slice(8, 14).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>

                    <div>
                      <span></span>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      {seatsFloor1.slice(14, 15).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>
                    <div>
                      <span></span>
                      {seatsFloor1.slice(15).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ marginLeft: 10 }}>
                  <span>Tầng 2</span>
                  <div
                    className="seats-container"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <div>
                      <span></span>
                      {seatsFloor2.slice(0, 7).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>
                    <div>
                      <span></span>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      {seatsFloor2.slice(7, 8).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className={`seat-none`}></div>
                      {seatsFloor2.slice(8, 14).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>

                    <div>
                      <span></span>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      <div className={`seat-none`}></div>
                      {seatsFloor2.slice(14, 15).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>
                    <div>
                      <span></span>
                      {seatsFloor2.slice(15).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ color: "#000", marginLeft: 30 }}>
                  <span style={{ color: "#000" }}>Chú thích:</span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",

                      alignItems: "center",
                    }}
                  >
                    <div className={`seat-2`}></div>
                    <span>Trống</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",

                      alignItems: "center",
                    }}
                  >
                    <div className={`seat-2 selected`}></div>
                    <span>Đang chọn</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",

                      alignItems: "center",
                    }}
                  >
                    <div className={`seat-2 disabled-sale`}></div>
                    <span>Đã đặt</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",

                      alignItems: "center",
                    }}
                  >
                    <div className={`seat-2 disabled-pending`}></div>
                    <span>Chờ xác nhận</span>
                  </div>
                </div>
              </div>
            )}
            {dataTripDetail?.vehicle?.totalSeat == 28 && (
              <div
                className="row"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginLeft: 20,
                  marginRight: 0,
                }}
              >
                <div>
                  <span>Tầng 1</span>
                  <div
                    className="seats-container"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <div>
                      <span></span>
                      {seatsFloor1.slice(0, 7).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>

                    <div>
                      {seatsFloor1.slice(7, 15).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>
                    <div>
                      {seatsFloor2.slice(0, 7).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>
                    <div>
                      {seatsFloor2.slice(7, 15).map((seat) => (
                        <div
                          key={seat?.id}
                          className={`seat ${
                            selectedSeats.includes(seat?.id) ? "selected" : ""
                          } ${
                            seat?.status == "Đã bán"
                              ? "disabled-sale"
                              : seat?.status == "Đang chờ thanh toán"
                              ? "disabled-pending"
                              : ""
                          }`}
                          onClick={() => handleSeatClick(seat?.id)}
                        >
                          {seat?.seat?.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ color: "#000", marginLeft: 30 }}>
                  <span style={{ color: "#000" }}>Chú thích:</span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",

                      alignItems: "center",
                    }}
                  >
                    <div className={`seat-2`}></div>
                    <span>Trống</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",

                      alignItems: "center",
                    }}
                  >
                    <div className={`seat-2 selected`}></div>
                    <span>Đang chọn</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",

                      alignItems: "center",
                    }}
                  >
                    <div className={`seat-2 disabled-sale`}></div>
                    <span>Đã đặt</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",

                      alignItems: "center",
                    }}
                  >
                    <div className={`seat-2 disabled-pending`}></div>
                    <span>Chờ xác nhận</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>
            <span style={{ color: "#000", float: "left" }}>Ghế đang chọn:</span>{" "}
            {selectedSeatNames.join(", ")}
          </span>
          <div>
            <Button
              variant="contained"
              onClick={() => setShowDrawer(false)}
              style={{ marginBottom: 1, marginRight: 5 }}
            >
              Quay lại
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={onClickConfirm}
              style={{ marginBottom: 1 }}
            >
              Xác nhận
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListTicketDetail;
