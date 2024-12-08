import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { convertCurrency, currencyMark } from "../../../utils/curren";

const win = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const TripPopular = (props) => {
  const { handleSearchTrip } = props;

  const data = [
    {
      price: 330000,
      name: "Sài Gòn - Đà Nẵng",
      image: require("../../../../assets/9860-1661919962-da-nang-du-lich.jpg"),
      backgroundColor: "#a8836d",
      nameFrom:"Thành phố Hồ Chí Minh",
      nameTo:"Thành phố Đà Nẵng",
      from: 79,
      to: 48,
    },
    {
      price: 170000,
      name: "Sài Gòn - Cần Thơ",
      image: require("../../../../assets/trip2.jpg"),
      backgroundColor: "#648ebc",
      nameFrom:"Thành phố Hồ Chí Minh",
      nameTo:"Thành phố Cần Thơ",
      from: 79,
      to: 92,
    },
    {
      price: 500000,
      name: "Sài Gòn - Bình Định",
      image: require("../../../../assets/Binh_Dinh_-_1_copy.jpg"),
      backgroundColor: "#e85c71",
      nameFrom:"Thành phố Hồ Chí Minh",
      nameTo:"Tỉnh Bình Định",
      from: 79,
      to: 52,
    },
    {
      price: 200000,
      name: "Sài Gòn - Cà Mau",
      image: require("../../../../assets/Cà_Mau_city_center.jpg"),
      backgroundColor: "#241b54",
      nameFrom:"Thành phố Hồ Chí Minh",
      nameTo:"Tỉnh Cà Mau",
      from: 79,
      to: 96,
    },
    {
      price: 350000,
      name: "Đà Nẵng - Hà Nội",
      image: require("../../../../assets/trip5.jpg"),
      backgroundColor: "#843c0b",
      nameFrom:"Thành phố Đà Nẵng",
      nameTo:"Thành phố Hà Nội",
      from: 48,
      to: 1,
    },
  ];
  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 15 }}>
        Tuyến đường phổ biến
      </Text>
      <FlatList
        data={data}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              margin: 1,
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              style={[
                {
                  backgroundColor: item.backgroundColor || "#1087a5",
                  margin: 5,
                  alignItems: "center",
                  borderRadius: 20,
                  height: 200,
                  width: 150,
                },
              ]}
              onPress={() => handleSearchTrip(item.from, item.to, item.nameFrom, item.nameTo)}
            >
              <Image
                source={item.image}
                style={{
                  width: "100%",
                  height: 110,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
              ></Image>
              <View
                style={{
                  height: 50,
                  width: "90%",
                  marginLeft: 10,
                }}
              >
                <Text
                  style={{ fontSize: 17, fontWeight: "700", color: "white" }}
                >
                  {item.name}
                </Text>
              </View>
              <View
                style={{
                  width: "90%",
                  marginLeft: 10,
                }}
              >
                <Text style={{ fontSize: 16, color: "#fff" }}>
                  Từ {convertCurrency(item.price)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default TripPopular;
