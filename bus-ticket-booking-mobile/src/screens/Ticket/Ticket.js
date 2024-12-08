import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ToastAndroid,
} from "react-native";
import {
  default as Icon,
  default as MaterialIcons,
} from "react-native-vector-icons/MaterialIcons";
import COLORS from "../../consts/color";
import { useState } from "react";
import ticketApi from "../../utils/ticketApi";
import { useEffect } from "react";
import moment from "moment";
import { TouchableOpacity } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { convertCurrency } from "../../utils/curren";
import promotionApi from "../../utils/promotionApi";
import { FlatList } from "react-native";
import { Dimensions } from "react-native";
import Modal from "react-native-modal";
import orderApi from "../../utils/orderApi";
const win = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const TicketScreen = ({ navigation, route }) => {
  const [dataTicket, setDataTicket] = useState([]);
  const dataTripDetail = route.params.item;
  const [seatsFloor1, setSeatsFloor1] = useState([]);
  const [seatsFloor2, setSeatsFloor2] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [optionPromotion, setOptionPromotion] = useState([]);
  const [promotionCodes, setPromotionCodes] = useState([]);
  const [dataPromotionResults, setDataPromotionResults] = useState([]);
  const [reduceAmount, setReduceAmount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isModalVehicle, setIsModalVehicle] = useState(false);
  const [isModalPromotion, setIsModalPromotion] = useState(false);
  const [itemTickets, setItemTickets] = useState([]);
  const [dataPromotionAvailable, setDataPromotionAvailable] = useState([]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const toggleModalVehicle = () => {
    setIsModalVehicle(!isModalVehicle);
  };
  const toggleModalPromotion = () => {
    setIsModalPromotion(!isModalPromotion);
  };

  const handleDataTicket = async () => {
    try {
      const res = await ticketApi.findAllTicket({
        sort: "ASC",
        tripDetailCode: dataTripDetail?.code,
        isAll: true,
      });
      res?.data?.data.map((item, index) => {
        item.price = dataTripDetail?.price;
      });
      setDataTicket(res?.data?.data);
    } catch (error) {}
  };

  const handlePromotion = async () => {
    try {
      const res = await promotionApi.getPromotionAvailable({
        tripCode: dataTripDetail?.trip?.code,
      });
      setOptionPromotion(res?.data?.data);

      if (res?.data?.data?.length > 0) {
        setPromotionCodes(res?.data?.data?.map((item) => item?.code));
      } else {
        setPromotionCodes([]);
      }
    } catch (error) {}
  };
  useEffect(() => {
    handleDataTicket();
    handlePromotion();
  }, [dataTripDetail]);

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
    if (seat?.status == "Đang chờ thanh toán") {
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
    setShowConfirmation(true);
  };

  const onClickConfirm = () => {
    setShowConfirmation(false);
  };

  const handlePromotionResult = async () => {
    try {
      let total = 0;
      if (selectedSeats.length > 0) {
        total = dataTripDetail?.price * selectedSeats.length;
      }
      const res = await promotionApi.calculatePromotionLine({
        total: total,
        numOfTicket: selectedSeats?.length || 0,
        promotionLineCodes: promotionCodes,
      });
      setDataPromotionResults(res?.data?.data);
    } catch (error) {
      setDataPromotionResults([]);
    }
  };

  useEffect(() => {
    handlePromotionResult();
  }, [selectedSeats]);

  useEffect(() => {
    let total = 0;

    if (dataPromotionResults.length > 0) {
      let dataP = [];
      dataPromotionResults.forEach((item) => {
        if (item?.amount != 0) {
          total += item?.amount;
          dataP.push(item.promotionLineCode);
        }
      });
      const filteredObjects = optionPromotion.filter((obj) =>
        dataP.includes(obj.code)
      );
      setDataPromotionAvailable(filteredObjects);
    }
    setReduceAmount(total);
  }, [selectedSeats, dataPromotionResults]);

  const filterItem = async () => {
    const newArray = dataTicket.filter((item) =>
      selectedSeats.includes(item?.id)
    );

    setItemTickets(newArray);
  };

  useEffect(() => {
    filterItem();
  }, [selectedSeats]);

  const handlePayment = async () => {
    try {
      const params = {
        seatCodes: itemTickets.map((item) => item?.seat?.code),
        tripDetailCode: dataTripDetail.code,
        promotionLineCodes:
          promotionCodes.length > 0 ? promotionCodes : undefined,
      };

      const res = await orderApi.booking(params);
      navigation.navigate("Payment", { data: res?.data?.data });
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
        error.response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: COLORS.white,
        flex: 1,
      }}
    >
      <View style={styles.top}>
        <View style={styles.topInfo}>
          <View>
            <Icon
              name="arrow-back"
              size={25}
              onPress={navigation.goBack}
              color="white"
            />
          </View>

          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",

                marginLeft: 5,
              }}
            >
              <View>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 17,
                    fontWeight: "bold",
                  }}
                >
                  {dataTripDetail?.vehicle?.name}
                </Text>
              </View>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: "700",
                  marginLeft: 5,
                }}
              >
                {moment(dataTripDetail?.departureTime).format("HH:MM")} -{" "}
                {moment(dataTripDetail?.departureTime).format("DD/MM/YYYY")}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={toggleModalVehicle}>
          <Text
            style={{
              color: "#fff",
              textDecorationLine: "underline",
              fontWeight: "700",
              fontSize: 15,
            }}
          >
            Thông tin xe
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.content}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              backgroundColor: "#88caf7",
              padding: 5,
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
              marginBottom: 20,
            }}
          >
            <Text style={{ marginRight: 20 }}>
              Quy định cần lưu ý khi đặt vé xe tại CITY BUS
            </Text>
            <TouchableOpacity onPress={toggleModal}>
              <Text
                style={{
                  color: "blue",
                  textDecorationLine: "underline",
                  fontWeight: "700",
                }}
              >
                Xem chi tiết
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ display: "flex", flexDirection: "row", marginBottom: 20 }}
          >
            <View style={{ marginLeft: 50, marginRight: 20 }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={styles.seatContent}></View>
                <Text>Ghế trống</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={[
                    styles.seatContent,
                    { backgroundColor: "rgb(102, 255, 0)" },
                  ]}
                ></View>
                <Text>Đã đặt</Text>
              </View>
            </View>

            <View style={{ marginLeft: 30 }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={[
                    styles.seatContent,
                    { backgroundColor: "rgb(0, 174, 255)" },
                  ]}
                ></View>
                <Text>Đang chọn</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
              </View>
            </View>
          </View>
          {dataTripDetail?.vehicle?.totalSeat == 34 && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginRight: 0,
                borderRadius: 10,
              }}
            >
              <View style={styles.floor}>
                <Text
                  style={{
                    textAlign: "center",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    color: "#5b4e4e",
                  }}
                >
                  Tầng dưới
                </Text>
                <View>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginTop: 10,
                      marginBottom: 20,
                    }}
                    source={require("../../../assets/xe-removebg-preview.png")}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <View>
                    {seatsFloor1.slice(0, 6).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                  <View>
                    <View style={styles.seatNone}></View>
                    {seatsFloor1.slice(6, 11).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                  <View>
                    {seatsFloor1.slice(11).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.floor}>
                <Text
                  style={{
                    textAlign: "center",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    color: "#5b4e4e",
                  }}
                >
                  Tầng trên
                </Text>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    marginTop: 10,
                    marginBottom: 20,
                  }}
                ></View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <View>
                    {seatsFloor2.slice(0, 6).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                  <View>
                    <View style={styles.seatNone}></View>
                    {seatsFloor2.slice(6, 11).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                  <View>
                    {seatsFloor2.slice(11).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}
          {dataTripDetail?.vehicle?.totalSeat == 44 && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginRight: 0,
                borderRadius: 10,
              }}
            >
              <View style={styles.floor}>
                <Text
                  style={{
                    textAlign: "center",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    color: "#5b4e4e",
                  }}
                >
                  Tầng dưới
                </Text>
                <View>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginTop: 10,
                      marginBottom: 20,
                    }}
                    source={require("../../../assets/xe-removebg-preview.png")}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <View>
                    {seatsFloor1.slice(0, 7).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                  <View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    {seatsFloor1.slice(7, 8).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                  <View>
                    <View style={styles.seatNone}></View>
                    {seatsFloor1.slice(8, 14).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                  <View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    {seatsFloor1.slice(14, 15).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                  <View>
                    {seatsFloor1.slice(15).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.floor}>
                <Text
                  style={{
                    textAlign: "center",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    color: "#5b4e4e",
                  }}
                >
                  Tầng trên
                </Text>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    marginTop: 10,
                    marginBottom: 20,
                  }}
                ></View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <View>
                    {seatsFloor2.slice(0, 7).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                  <View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    {seatsFloor2.slice(7, 8).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                  <View>
                    <View style={styles.seatNone}></View>
                    {seatsFloor2.slice(8, 14).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                  <View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    <View style={styles.seatNone}></View>
                    {seatsFloor2.slice(14, 15).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                  <View>
                    {seatsFloor2.slice(15).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}
          {dataTripDetail?.vehicle?.totalSeat == 28 && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginRight: 0,
                borderRadius: 10,
              }}
            >
              <View style={styles.floor}>
                <Text
                  style={{
                    textAlign: "center",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    color: "#5b4e4e",
                  }}
                >
                  {""}
                </Text>
                <View>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginTop: 10,
                      marginBottom: 20,
                    }}
                    source={require("../../../assets/xe-removebg-preview.png")}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <View>
                    {seatsFloor1.slice(0, 7).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>

                  <View>
                    {seatsFloor1.slice(7, 15).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                  <View>
                    {seatsFloor2.slice(0, 7).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                  <View>
                    {seatsFloor2.slice(7, 15).map((seat) => (
                      <TouchableWithoutFeedback
                        key={seat.id}
                        onPress={() => handleSeatClick(seat?.id)}
                      >
                        <View
                          style={[
                            styles.seat,
                            selectedSeats.includes(seat?.id)
                              ? styles.seatSelected
                              : "",
                            seat.status === "Đang chờ thanh toán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                            seat.status === "Đã bán" && {
                              backgroundColor: "rgb(102, 255, 0)",
                            },
                          ]}
                        >
                          <Text style={styles.seatName}>
                            {" "}
                            {seat?.seat?.name}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}

          {optionPromotion.length > 0 && (
            <View style={{ marginTop: 10, marginBottom: 20 }}>
              <Text style={{ fontWeight: "700", color: "#7c6d6d" }}>
                *Khuyến mãi:
              </Text>

              <FlatList
                data={optionPromotion}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: 5,
                      marginTop: 10,
                      marginLeft: 7,
                      marginRight: 7,
                      borderWidth: 1,
                      height: 50,
                      width: 180,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderColor: "#ccc",
                    }}
                  >
                    <Text style={{ fontWeight: "500" }}>{item.title}</Text>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {selectedSeats.length > 0 && (
        <View
          style={[
            styles.bottom,
            { height: dataPromotionAvailable.length > 0 ? "30%" : "20%" },
          ]}
        >
          {dataPromotionAvailable.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <View>
                <Text
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Khuyến mãi:
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>
                  Có ({dataPromotionAvailable.length}) khuyến mãi được áp dụng
                </Text>
                <TouchableOpacity onPress={toggleModalPromotion}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "blue",
                      textDecorationLine: "underline",
                    }}
                  >
                    Xem chi tiết
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View></View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View>
              <Text>Đã chọn {selectedSeats.length} chỗ</Text>
              <Text style={{ fontWeight: "bold" }}>
                {" "}
                {selectedSeatNames.join(", ")}
              </Text>
            </View>
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: 5,
                }}
              >
                <Text style={{ width: 100 }}>Tạm tính:</Text>
                <Text style={{ fontWeight: "bold", textAlign: "left" }}>
                  {convertCurrency(
                    dataTripDetail?.price * selectedSeats.length
                  )}
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: 5,
                }}
              >
                <Text style={{ width: 100 }}>Giảm giá:</Text>
                <Text style={{ fontWeight: "bold", textAlign: "left" }}>
                  {convertCurrency(reduceAmount)}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ width: 100 }}>Thành tiền:</Text>
                <Text style={{ fontWeight: "bold", textAlign: "left" }}>
                  {convertCurrency(
                    dataTripDetail?.price * selectedSeats.length + reduceAmount
                  )}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{
              marginTop: 10,
              backgroundColor: "#f2e941",
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 7,
              position: "absolute",
              bottom: 10,
              width: "100%",
              marginLeft: 15,
            }}
            onPress={handlePayment}
          >
            <Text style={{ fontSize: 15, fontWeight: "500" }}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: "#fff",
            height: "50%",
            display: "flex",
            alignItems: "center",
            // justifyContent: "center",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <Image
            source={require("../../../assets/hotline-removebg-preview.png")}
            style={{ width: 50, height: 80, marginTop: 30 }}
          ></Image>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Quy định cần lưu ý
          </Text>
          <Text style={{ padding: 10, fontSize: 17, textAlign: "center" }}>
            Hành khách chỉ được hủy vé khoản thời gian trước thời điểm chuyến đi
            xuất phát ít nhất là{" "}
            <Text style={{ fontWeight: "bold" }}>2 giờ</Text> . Khi đi cần đến
            điểm xuất phát trước <Text style={{ fontWeight: "bold" }}>15p</Text>{" "}
            khi khởi hành để nhân viên kiểm tra vé. Có thắc mắc cần giải đáp vui
            lòng liên hệ đến hotline{" "}
            <Text style={{ fontWeight: "bold" }}>0354.043.344</Text> .
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#1b1847",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              width: "80%",
              borderRadius: 10,
              marginTop: 10,
            }}
            onPress={toggleModal}
          >
            <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "600" }}>
              Tôi đã đọc và đồng ý
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={isModalVehicle}
        onBackdropPress={toggleModalVehicle}
        onBackButtonPress={toggleModalVehicle}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: "#fff",
            height: "40%",
            display: "flex",
            alignItems: "center",
            // justifyContent: "center",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {dataTripDetail?.vehicle?.name}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {dataTripDetail?.vehicle?.type},{" "}
            {dataTripDetail?.vehicle?.floorNumber} tầng,{" "}
            {dataTripDetail?.vehicle?.totalSeat} ghế
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Biển số: {dataTripDetail?.vehicle?.licensePlate}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Hình ảnh:</Text>
          <Image
            source={{ uri: dataTripDetail.vehicle?.images[0]?.url || "" }}
            style={{
              width: 150,
              height: 100,
              borderRadius: 7,
              marginTop: 20,
              marginBottom: 30,
            }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#f4c242",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              width: "90%",
              borderRadius: 10,
              marginTop: 10,
            }}
            onPress={toggleModalVehicle}
          >
            <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "600" }}>
              Chọn ghế
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        isVisible={isModalPromotion}
        onBackdropPress={toggleModalPromotion}
        onBackButtonPress={toggleModalPromotion}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: "#fff",
            height: "50%",
            display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Danh sách khuyến mãi được áp dụng
          </Text>
          {dataPromotionAvailable.map((item, index) => (
            <View key={item.id}>
              <Text>
                ({index + 1}) {item.title}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            backgroundColor: "#fff",
            height: 70,
            display: "flex",
            alignItems: "center",
            // justifyContent: "center",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 10,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#f4c242",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              width: "90%",
              borderRadius: 10,
              marginTop: 10,
            }}
            onPress={toggleModalPromotion}
          >
            <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "600" }}>
              Quay lại
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  top: {
    backgroundColor: "#ea733c",
    display: "flex",
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "space-between",
  },
  topInfo: {
    display: "flex",
    flexDirection: "row",
  },
  content: {
    height: "80%",
    marginLeft: 20,
    marginRight: 20,
  },
  bottom: {
    backgroundColor: "#ffffff",
    padding: 15,
  },
  floor: {
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
    padding: 5,
  },
  seatContent: {
    backgroundColor: "#ccc",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    margin: 5,
    textAlign: "center",
    width: 20,
    height: 20,
    fontSize: 14,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
  },
  seat: {
    backgroundColor: "#ccc",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    margin: 5,
    textAlign: "center",
    width: 25,
    height: 30,
    fontSize: 14,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
  },
  seatNone: {
    // backgroundColor: "#ccc",
    // borderWidth: 1,
    // borderColor: "#aaa",
    borderRadius: 5,
    margin: 5,
    textAlign: "center",
    width: 25,
    height: 30,
    fontSize: 14,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
  },
  seatSelected: {
    backgroundColor: "rgb(0, 174, 255)",
    color: "#FFF",
  },
  seatName: {
    fontSize: 10,
  },
});

export default TicketScreen;
