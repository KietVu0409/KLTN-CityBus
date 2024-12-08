import { padding } from "../../utils/format";
import { Image } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";
import Loader from "../../components/Loader/loader";
import {
  ToastAndroid,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  default as Icon,
  default as MaterialIcons,
} from "react-native-vector-icons/MaterialIcons";
import authApi from "../../utils/authApi";
const win = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const ForgotScreen = (props) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // const [email, setEmail] = useState("superman@gmail.com");
  const [inputType, setInputType] = useState("email");
  const [inputValue, setInputValue] = useState("superman@gmail.com");

  const validateInput = (inputValue) => {
    const isPhoneNumber = /^\d{10}$/.test(inputValue);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);
    return isPhoneNumber || isEmail;
  };

  const handleInputChange = (newInputValue) => {
    setInputValue(newInputValue);
    setInputType(
      validateInput(newInputValue)
        ? /@/.test(newInputValue)
          ? "email"
          : "phone"
        : ""
    );
  };

  useEffect(() => {
    if (inputValue == "") {
      setEmail("");
      setPhone("");
    }
    if (inputType === "email") {
      setEmail(inputValue);
      setPhone("");
    } else if (inputType === "phone") {
      setPhone(inputValue);
      setEmail("");
    }
  }, [inputType, inputValue]);

  const onSendOTP = async () => {
    setIsLoading(true);
    try {
      if (inputType === "email") {
        if (email.trim() == "") {
          ToastAndroid.showWithGravityAndOffset(
            "Email hoặc số điện thoại không được phép bỏ trống!",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
          return;
        }
      }
      if (inputType === "phone") {
        if (phone.trim() == "") {
          ToastAndroid.showWithGravityAndOffset(
            "Email hoặc số điện thoại không được phép bỏ trống1!",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );

          return;
        }
      }
      let params;

      params = {
        oldEmail: email == "" ? undefined : email,
        phone: phone == "" ? undefined : phone,
      };
      const res = await authApi.sendOtp(params);

      ToastAndroid.showWithGravityAndOffset(
        "Gửi OTP thành công!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      navigation.navigate("ForgotVerifyScreen", { phone: phone, email: email });

      setIsLoading(false);
    } catch {
      ToastAndroid.showWithGravityAndOffset(
        "Có lỗi xảy ra, vui lòng thử lại sau ít phút!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      setIsLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: "100%",
          flex: 1,
          backgroundColor: "#ea733c",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          height: "50%",
        }}
      >
        <Image
          source={require("../../../assets/logo.png")}
          style={{ height: 100, width: 100 }}
        ></Image>
        <View>
          <Text style={{ fontSize: 40, fontWeight: "600", color: "#ffffff" }}>
          CITY BUS
          </Text>
          <Text style={{ color: "#ffffff" }}>đặt vé xe giá rẻ</Text>
        </View>
      </View>

      <View
        style={{
          ...padding(10, 20),
          flex: 1,
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 50,
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: "500", color: "#050f59" }}>
            Quên mật khẩu
          </Text>
        </View>
        <TextInput
          placeholder="Email hoặc số điện thoại"
          onChangeText={handleInputChange}
          // type="phone"

          style={{
            width: "100%",
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            marginVertical: 10,
            paddingHorizontal: 10,
          }}
        ></TextInput>
        <TouchableOpacity
          type="primary"
          style={{
            height: 50,
            width: windowWidth - 60,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ea733c",
            marginLeft: 10,
            marginTop: 20,
            marginBottom: 20,
            borderRadius: 100,
          }}
          onPress={onSendOTP}
        >
          <Text>Gửi mã OTP</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Login");
            }}
            style={{ display: "flex", flexDirection: "row" }}
          >
            <Text style={{ fontSize: 17 }}>Đăng nhập</Text>
            <Icon name="navigate-next" size={25} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <Loader isLoading={isLoading} />
    </View>
  );
};
export default ForgotScreen;
