import React, { useState } from "react";
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import COLORS from "../../consts/color";
import orderApi from "../../utils/orderApi";
import { useEffect } from "react";
import { Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import moment from "moment";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

const win = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const MyTicketIssued = (props) => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [seat, setSeat] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);

  const fetchData = async () => {
    // Lấy dữ liệu từ API hoặc local storage
    // và cập nhật lại state data
    // setData(myData);
    try {
      const res = await orderApi.getOrderHistory({
        status: "Đã thanh toán",
      });
      const data = res?.data?.data;
      const updatedData = await Promise.all(
        data.map(async (item) => {
          const response1 = await orderApi.getOrderById(item.id);

          item.orderDetails = response1?.data?.data?.orderDetails;

          return item;
        })
      );
      setData(updatedData);
    } catch (error) {
      console.log(error);
    }
  };
  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData();
    setIsRefreshing(false);
  };

  const getOrderHistory = async () => {
    try {
      const res = await orderApi.getOrderHistory({
        status: "Đã thanh toán",
      });
      const data = res?.data?.data;
      const updatedData = await Promise.all(
        data.map(async (item) => {
          const response1 = await orderApi.getOrderById(item.id);

          item.orderDetails = response1?.data?.data?.orderDetails;

          return item;
        })
      );
      setData(updatedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrderHistory();
  }, []);
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {data.length > 0 ? (
          data.map((item) => (
            <View
              key={item.id}
              style={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#f5f5f5",
                padding: 10,
                width: "100%",
                height: 130,
                marginTop: 10,
                alignItems: "center",
                borderRadius: 15,
                shadowColor: "#ea733c",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 1,
                elevation: 5,
              }}
            >
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRightWidth: 1,
                  padding: 7,
                }}
              >
                <Text style={{ fontSize: 22, fontWeight: "600" }}>
                  {moment(
                    item.orderDetails[0].ticketDetail.ticket.tripDetail
                      .departureTime
                  ).format("DD")}
                </Text>
                <Text>
                  {moment(
                    item.orderDetails[0].ticketDetail.ticket.tripDetail
                      .departureTime
                  ).format("MM/YYYY")}
                </Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text>
                  {moment(
                    item.orderDetails[0].ticketDetail.ticket.tripDetail
                      .departureTime
                  ).format("HH:MM")}
                </Text>
                <Text>
                  Từ:{" "}
                  {
                    item.orderDetails[0].ticketDetail.ticket.tripDetail.trip
                      .fromStation.name
                  }
                </Text>
                <Text>
                  Đến:{" "}
                  {
                    item.orderDetails[0].ticketDetail.ticket.tripDetail.trip
                      .toStation.name
                  }
                </Text>
                <Text>
                  Xe:{" "}
                  {item.orderDetails[0].ticketDetail.seat.vehicle.licensePlate}
                </Text>
                <Text>
                  Số ghế:{" "}
                  {item?.orderDetails
                    ?.map((item) => item.ticketDetail.seat.name)
                    .join(",")}
                </Text>
                <Text style={{ color: "#155916", fontWeight: "bold" }}>
                  <FontAwesome5
                    name="check"
                    color={"#155916"}
                    size={14}
                    style={{ marginLeft: 10 }}
                  />{" "}
                  {(item.status = "Đã thanh toán" && "Đã hoàn thành")}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.content}>
            <Image
              source={require("../../../assets/ticket-removebg-preview.png")}
              style={{ width: 200, height: 200, marginTop: 150 }}
            ></Image>
            <Text
              style={{
                color: "#000",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              Bạn chưa có vé nào
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                marginHorizontal: 20,
                marginTop: 5,
              }}
            >
              Hãy thử kéo xuống để cập nhật danh sách vé của bạn trong thời gian
              qua
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  top: {
    backgroundColor: "#ea733c",
    display: "flex",
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyTicketIssued;
