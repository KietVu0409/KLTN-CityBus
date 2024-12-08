import { Divider } from "@react-native-material/core";
import moment from "moment";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  default as Icon,
  default as MaterialIcons,
} from "react-native-vector-icons/MaterialIcons";
import { convertCurrency } from "../../../utils/curren";
moment.locale("vi");
const win = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const TicketList = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const data = route.params?.data ?? [];
  const from = route.params.from || "Unknown";
  const to = route.params.to || "Unknown";
  const date = moment(route.params.date, "MM-DD-YYYY").format("DD/MM/YYYY");
  const now = new Date();

  const handleBooking = (item) => {
    if (new Date(item.departureTime) > now) {
      navigation.navigate("TicketScreen", { item: item });
    } else {
      ToastAndroid.showWithGravityAndOffset(
        "Chuyến này đã khởi hành không thể đặt vé",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  };
  return (
    <View style={{ backgroundColor: "#f5f5f5" }}>
      <View style={styles.top}>
        <View style={styles.topInfo}>
          <Icon
            name="arrow-back"
            size={25}
            onPress={navigation.goBack}
            color="white"
          />
          <View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 17,
                  fontWeight: "bold",
                  marginLeft: 5,
                }}
              >
                {from}
              </Text>
              <MaterialIcons name="navigate-next" size={25} color="#fff" />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 17,
                  fontWeight: "bold",
                }}
              >
                {to}
              </Text>
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
                {date}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          style={{ height: windowHeight - 100 }}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#f4efba",
                borderRadius: 20,
                marginTop: 10,
                marginLeft: 7,
                marginRight: 7,
              }}
            >
              <View>
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: 300,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: windowWidth - 60,
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text
                          style={{
                            marginRight: 5,
                            fontSize: 16,
                            fontWeight: "500",
                          }}
                        >
                          {moment(item.departureTime).format("HH:mm")}
                        </Text>
                        <FontAwesome5
                          style={{ marginRight: 5 }}
                          name="dot-circle"
                          color="#3c67e8"
                          size={25}
                        />
                        <Text
                          style={{
                            marginRight: 5,
                            fontSize: 16,
                            fontWeight: "500",
                          }}
                        >
                          {item.trip.fromStation.name}
                        </Text>
                      </View>
                      <Text
                        style={{
                          marginRight: 5,
                          fontSize: 16,
                          fontWeight: "500",
                        }}
                      >
                        {convertCurrency(item.price)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginRight: 15,
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        marginLeft: 300,
                        marginTop: 0,
                        marginBottom: 5,
                        marginRight: 5,
                      }}
                    >
                      {item.status}
                    </Text>
                    <MaterialCommunityIcons
                      name="ticket"
                      size={25}
                      color="#ea8648"
                    />
                  </View>
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: windowWidth - 60,
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text
                          style={{
                            marginRight: 5,
                            fontSize: 16,
                            fontWeight: "500",
                          }}
                        >
                          {moment(item.expectedTime).format("HH:mm")}
                        </Text>
                        <FontAwesome5
                          style={{ marginRight: 5 }}
                          name="dot-circle"
                          color="red"
                          size={25}
                        />
                        <Text
                          style={{
                            marginRight: 5,
                            fontSize: 16,
                            fontWeight: "500",
                          }}
                        >
                          {item.trip.toStation.name}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "black",
                        marginTop: 10,
                      }}
                    />
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 10,
                      }}
                    >
                      <View>
                        <Image
                          source={{ uri: item.vehicle?.images[0]?.url ?? "" }}
                          style={{ width: 100, height: 70, borderRadius: 7 }}
                        ></Image>
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: "800" }}>
                          {item.vehicle.name}
                        </Text>
                        <Text style={{ fontSize: 16, marginTop: 7 }}>
                          {item.vehicle.type}, {item.vehicle.floorNumber} tầng,{" "}
                          {item.vehicle.totalSeat} ghế
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "90%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ marginTop: 20, marginRight: 10 }}>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <MaterialCommunityIcons
                          name="piggy-bank"
                          size={25}
                          color="#46c423"
                        />
                        <Text style={{ marginLeft: 7, marginTop: 3 }}>
                          Xác nhận vé tức thì
                        </Text>
                      </View>

                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <MaterialCommunityIcons
                          name="ticket-confirmation"
                          size={25}
                          color="#46c423"
                        />
                        <Text style={{ marginLeft: 7, marginTop: 3 }}>
                          Đảm bảo có vé
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#050b2d",
                        width: 100,
                        height: 40,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        marginTop: 30,
                      }}
                      onPress={() => handleBooking(item)}
                    >
                      <Text
                        style={{
                          color: "#ffffff",
                          fontWeight: "bold",
                          fontSize: 17,
                        }}
                      >
                        Đặt vé
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Divider />
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.content}>
          <Text
            style={{
              color: "#000",
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            Không tìm thấy chuyến
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              marginHorizontal: 20,
              marginTop: 10,
            }}
          >
            Hiện tại không có chuyến xe nào đi từ{" "}
            <Text style={{ fontWeight: "bold" }}> {from}</Text> đến
            <Text style={{ fontWeight: "bold" }}> {to}</Text> ngày
            <Text style={{ fontWeight: "bold" }}> {date}</Text> , mời bạn quay
            lại sau !!!
          </Text>
        </View>
      )}
    </View>
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
  search: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#d8bcbc",
    borderBottomWidth: 3,
    paddingBottom: 5,
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
});

export default TicketList;
