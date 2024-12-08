import { padding } from "../../utils/format";

import { Image, TouchableOpacity, TextInput, View, Text } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";
// import { CodeField } from 'react-native-confirmation-code-field'
import Loader from "../../components/Loader/loader";
import { ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import authApi from "../../utils/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
const win = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const RegisterVerifyScreen = (props) => {
  const navigation = useNavigation();
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState();

  useEffect(() => {
    if (props.route.params.phone) {
      setPhone(props.route.params.phone);
    }
  }, [props.route.params.phone]);
  useEffect(() => {
    if (props.route.params.password) {
      setPassword(props.route.params.password);
    }
  }, [props.route.params.password]);

  const onVerify = async () => {
    setIsLoading(true);
    try {
      const res = await authApi.activeAccount({
        phone: phone,
        otp: value,
        type: "ACTIVE",
      });

      ToastAndroid.showWithGravityAndOffset(
        "Xác thực thành công!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      const params = {
        password: password,
        phone: phone,
      };

      const res1 = await authApi.login(params);

      authApi.save_token(res1);
      handleVerifyCustomer();
      navigation.navigate("Home");

      setIsLoading(false);
    } catch (error) {
      console.log("Failed:", error);
      ToastAndroid.showWithGravityAndOffset(
        error.response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      setIsLoading(false);
    }
  };

  const handleVerifyCustomer = async () => {
    let token = await AsyncStorage.getItem("access");
    console.log("access", token);
    try {
      const res = await authApi.getInfor();
      if (res.data.statusCode == 200) {
        authApi.save_info(res);
        return;
      }
    } catch (error) {
      console.log("Failed:", error);
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
            marginBottom: 20,
            marginTop: 15,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500", color: "#000" }}>
            Nhập mã OTP được gửi về số{" "}
            <Text style={{ color: "#0c1228" }}>{phone}</Text>
          </Text>
        </View>
        <TextInput
          type="number-pad"
          maxLength={6}
          value={value}
          onChangeText={setValue}
          placeholder="Mã OTP"
          style={{
            width: "90%",
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            marginVertical: 10,
            paddingHorizontal: 10,
            marginLeft:20
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
          onPress={onVerify}
        >
          <Text>Xác thực OTP</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        ></View>
      </View>
      <Loader isLoading={isLoading} />
    </View>
  );
};

export default RegisterVerifyScreen;
