import { Avatar } from "@react-native-material/core";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useEffect, useState } from "react";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import authApi from "../../utils/authApi";
moment.locale("vi");
const win = Dimensions.get("window");

const MyAccountScreen = () => {
  const navigation = useNavigation();
  const [info, setInfo] = useState({});
  const handleInfo = async () => {
    const _info = await authApi.getStorageInfo();
    setInfo(_info);
  };

  useEffect(() => {
    handleInfo();
  }, [info]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={styles.top}>
        <View style={styles.topLeft}>
          <View style={styles.imgAvt}>
            <Avatar
              icon={(props) => <Icon name="account" {...props} size={50} />}
              style={{ backgroundColor: "#f2eea4", marginRight: 5 }}
            />
          </View>
          <View style={styles.topInfo}>
            <Text style={{ color: "#fff", fontSize: 17, fontWeight: "bold" }}>
              {info?.fullName}
            </Text>
            <Text style={{ color: "#fff", fontSize: 15, marginTop: 2 }}>
              {info?.customerGroup?.name}
            </Text>
          </View>
        </View>

        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("UpdateProfile", { info: info })}
          >
            <Text
              style={{
                color: "#fff",
                textDecorationLine: "underline",
                fontWeight: "700",
              }}
            >
              Chỉnh sửa
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "white",
        }}
      >
        <View style={styles.itemProfileStyle}>
          <Text style={styles.text}>Tên khách hàng</Text>
          <Text style={styles.text}>{info?.fullName}</Text>
        </View>
        <View style={styles.itemProfileStyle}>
          <Text style={styles.text}>Số điện thoại</Text>
          <Text style={styles.text}>{info?.phone}</Text>
        </View>
        <View style={styles.itemProfileStyle}>
          <Text style={styles.text}>Email</Text>
          <Text style={styles.text}>{info?.email}</Text>
        </View>
        <View style={styles.itemProfileStyle}>
          <Text style={styles.text}>Ngày sinh</Text>
          <Text style={styles.text}>
            {moment(info.birthday).format("DD-MM-YYYY")}
          </Text>
        </View>
        <View style={styles.itemProfileStyle}>
          <Text style={styles.text}>Giới tính</Text>
          <Text style={styles.text}>
            {info?.gender == "M"
              ? "Nam"
              : info?.gender == "F"
              ? "Nữ"
              : "Không xác định"}
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "white",
          marginVertical: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("MyTicket");
          }}
        >
          <View style={styles.itemProfileStyle}>
            <Text style={styles.text}>Xem lịch sử đặt vé</Text>
            <Image
              style={{
                width: 20,
                height: 20,
              }}
              source={require("../../../assets/arrow-to-right.png")}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ChangePassword");
          }}
        >
          <View style={styles.itemProfileStyle}>
            <Text style={styles.text}>Đổi mật khẩu</Text>
            <Image
              style={{
                width: 20,
                height: 20,
              }}
              source={require("../../../assets/arrow-to-right.png")}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            authApi.clear_token();
            navigation.navigate("Login");
          }}
        >
          <View style={styles.itemProfileStyle}>
            <Text style={{ ...styles.text, color: "#F6616A" }}>Đăng xuất</Text>
            <Image
              style={{
                width: 20,
                height: 20,
              }}
              source={require("../../../assets/logout.png")}
            />
          </View>
        </TouchableOpacity>
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  topLeft: {
    display: "flex",
    flexDirection: "row",
  },
  topInfo: {
    marginLeft: 5,
  },
  imgAvt: {
    height: 50,
    width: 50,
    marginRight: 10,
  },

  text: {
    fontSize: 17,
    fontWeight: "bold",
    // fontWeight: 'bold'
  },

  textChange: {
    fontSize: 15,
    fontStyle: "italic",
    marginTop: 20,
    // color: '#95c2ec',
    marginRight: 2,
  },
  itemProfileStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    // backgroundColor:'#F9813A'
  },
});

export default MyAccountScreen;
