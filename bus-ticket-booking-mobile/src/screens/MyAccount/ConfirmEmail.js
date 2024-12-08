import { padding } from "../../utils/format";

import { Image, TouchableOpacity, TextInput, View, Text } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";
// import { CodeField } from 'react-native-confirmation-code-field'
import Loader from "../../components/Loader/loader";
import { ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import authApi from "../../utils/authApi";
const win = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const ConfirmEmailScreen = (props) => {
  const navigation = useNavigation();
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState();
  const params = props.route.params.params;

  useEffect(() => {
    if (props.route.params.email) {
      setEmail(props.route.params.email);
    }
  }, [props.route.params.email]);

  const onVerify = async () => {
    try {
      const parasUpdate = {
        email: email,
        otp: value,
        ...params,
      };
      const res = await authApi.updateProfile(parasUpdate);

      ToastAndroid.showWithGravityAndOffset(
        "Cập nhật tài khoản thành công!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      authApi.save_info(res);
      navigation.navigate("Tài khoản");
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          ...padding(10, 7),
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
            Nhập mã OTP được gửi về{" "}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "#000" }}>
            {email}
          </Text>
        </View>
        <TextInput
          type="number-pad"
          maxLength={6}
          value={value}
          onChangeText={setValue}
          keyboardType="numeric"
          placeholder="Mã OTP"
          style={{
            width: "90%",
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            marginVertical: 10,
            paddingHorizontal: 10,
            marginLeft: 20,
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
            marginLeft: 20,
            marginTop: 20,
            marginBottom: 20,
            borderRadius: 100,
          }}
          onPress={onVerify}
        >
          <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
            Xác thực OTP
          </Text>
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

export default ConfirmEmailScreen;
