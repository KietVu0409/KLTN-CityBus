import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, Image } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../../consts/color";
import { PrimaryButton } from "../../components/Button/Button";
import Ionicons from "react-native-vector-icons/Ionicons";
import promotionApi from "../../utils/promotionApi";
import { Dimensions } from "react-native";
import moment from "moment";
import { TouchableOpacity } from "react-native";

const win = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const PromotionScreen = ({ navigation }) => {
  const [dataPromotion, setDataPromotion] = useState([]);
  const handleGetDataPromotion = async () => {
    try {
      const response = await promotionApi.findAll({
        status: "Đang hoạt động",
        isAll: true,
      });
      setDataPromotion(response?.data?.data);
    } catch (error) {
      console.error("Error while fetching data: ", error);
      // Xử lý lỗi ở đây
    }
  };
  useEffect(() => {
    handleGetDataPromotion();
  }, []);
  return (
    <SafeAreaView
      style={{
        backgroundColor: COLORS.white,
        flex: 1,
      }}
    >
      <View style={styles.top}>
        <View style={styles.topInfo}>
          <Text style={{ color: "#fff", fontSize: 17, fontWeight: "bold" }}>
            Ưu đãi
          </Text>
        </View>
      </View>
      <View>
        {dataPromotion.length > 0 ? (
          <FlatList
            data={dataPromotion}
            keyExtractor={(item) => item.id.toString()}
            style={{ height: windowHeight - 50, margin: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("PromotionDetail", { item: item })
                }
              >
                <View
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
                  <View>
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: 100, height: 70, borderRadius: 7 }}
                    ></Image>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "800" }}>
                      {item.name}
                    </Text>
                    <Text style={{ fontSize: 14 }}>
                      Kết thúc: {moment(item.endDate).format("DD/MM/YYYY")}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.content}>
            <Image
              source={require("../../../assets/chuong-removebg-preview.png")}
              style={{ width: 200, height: 200, marginTop: 150 }}
            ></Image>
            <Text
              style={{
                color: "#000",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              Hiện tại chưa có ưu đãi nào
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                marginHorizontal: 20,
                marginTop: 5,
              }}
            >
              Bạn sẽ nhận được ưu đãi khi có thông tin cập nhật về ưu đãi,
              chương trình khuyến mãi
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  top: {
    backgroundColor: "#ea733c",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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

export default PromotionScreen;
