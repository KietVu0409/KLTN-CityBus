import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { default as Icon } from "react-native-vector-icons/MaterialIcons";
import COLORS from "../../consts/color";
import { convertCurrency } from "../../utils/curren";
import orderApi from "../../utils/orderApi";

const TicketDetail = ({ navigation, route }) => {
  const dataOrder = route.params.item;
  const { orderAvailable } = route.params;
  const getOrderAvailable = orderAvailable.fn;
  const [detail, setDetail] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [promotionLine, setPromotionLine] = useState([]);

  const getDetail = async () => {
    try {
      const res = await orderApi.getOrderById(dataOrder.id);
      setDetail(res?.data.data);
    } catch (error) {
      console.log("Failed:", error);
      ToastAndroid.showWithGravityAndOffset(
        error.response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  };

  useEffect(() => {
    getDetail();
  }, [dataOrder]);

  const fetchData = () => {
    // Lấy dữ liệu từ API hoặc local storage
    // và cập nhật lại state data
    // setData(myData);
  };
  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData();
    setIsRefreshing(false);
  };

  const handleCancel = async () => {
    Alert.alert(
      "Lưu ý",
      "Bạn vui lòng liên hệ hotline 0354.043.344 để nhân viên hỗ trợ hủy vé !",
      [
        {
          text: "Xác nhận",
          style: "cancel",
        },
        // {
        //   text: "Đồng ý",
        //   onPress: async () => {
        //     // Xử lý khi người dùng xác nhận hủy
        //     try {
        //       const res = await orderApi.updateStatusOrder(detail?.code, {
        //         status: "Hoàn tiền trả vé",
        //       });

        //       Alert.alert(
        //         "Hủy thành công, gọi hotline 035.404.3344 để nhân viên hoàn tiền"
        //       );
        //       getOrderAvailable();
        //       navigation.navigate("Vé của tôi");
        //     } catch (error) {
        //       ToastAndroid.showWithGravityAndOffset(
        //         error.response.data.message,
        //         ToastAndroid.LONG,
        //         ToastAndroid.BOTTOM,
        //         25,
        //         50
        //       );
        //     }
        //   },
        // },
      ]
    );
  };
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <View style={styles.top}>
        <Icon
          name="arrow-back"
          size={25}
          onPress={navigation.goBack}
          color="white"
        />
        <View style={styles.topInfo}>
          <Text
            style={{
              color: "#fff",
              fontSize: 17,
              fontWeight: "bold",
              marginLeft: 5,
            }}
          >
            Chi tiết
          </Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          Mã QR
        </Text>
        <QRCode
          value={detail?.code}
          size={200}
          color="#000000"
          backgroundColor="#ffffff"
        />
      </View>
      <View style={styles.content}>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Khách hàng:</Text>
          <Text>{detail?.customer.fullName}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Số điện thoại:</Text>
          <Text>{detail?.customer.phone}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Nơi đi:</Text>
          <Text>
            {
              detail?.orderDetails[0].ticketDetail.ticket.tripDetail.trip
                .fromStation.name
            }
          </Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Nơi đến:</Text>
          <Text>
            {
              detail?.orderDetails[0].ticketDetail.ticket.tripDetail.trip
                .toStation.name
            }
          </Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Thời gian đi:</Text>
          <Text>
            {moment(
              detail?.orderDetails[0].ticketDetail.ticket.tripDetail
                .departureTime
            ).format("DD/MM/YYYY HH:MM")}
          </Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Xe:</Text>
          <Text>{detail?.orderDetails[0].ticketDetail.seat.vehicle.name}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Biển số:</Text>
          <Text>
            {detail?.orderDetails[0].ticketDetail.seat.vehicle.licensePlate}
          </Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Danh sách ghế đã đặt:</Text>
          <Text>
            {detail?.orderDetails
              ?.map((item) => item.ticketDetail.seat.name)
              .join(",")}
          </Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Tổng tiền:</Text>
          <Text>{convertCurrency(detail?.finalTotal)}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Ngày đặt:</Text>
          <Text>{moment(detail?.createdAt).format("DD/MM/YYYY HH:MM")}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Phương thức thanh toán:</Text>
          <Text>{detail?.paymentMethod}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Trạng thái:</Text>
          <Text style={{ color: "#155916", fontWeight: "bold" }}>
            <FontAwesome5
              name="check"
              color={"#155916"}
              size={14}
              style={{ marginLeft: 10 }}
            />{" "}
            {detail?.status}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", marginTop: 10 }}>
          <Text style={styles.textItem}>* Lưu ý:</Text>
          <Text style={{ marginRight: 10 }}>
            Nếu muốn hủy vé, bạn vui lòng liên hệ hotline{" "}
            <Text style={{ fontWeight: "bold" }}>0354.043.344</Text> để nhân
            viên hỗ trợ hủy vé !
          </Text>
        </View>
      </View>
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
    // alignItems: "center",
  },
  content: {
    display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
  },
  content2: {
    display: "flex",
    backgroundColor: "#edd0d0",
    borderRadius: 20,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
  },
  contentItem: {
    display: "flex",
    // justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  textItem: {
    fontWeight: "700",
    fontSize: 15,
    marginRight: 10,
  },
});

export default TicketDetail;
