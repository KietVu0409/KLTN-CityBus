

import { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";
// import { CodeField } from 'react-native-confirmation-code-field'
import { useNavigation } from "@react-navigation/native";
import Loader from "../../components/Loader/loader";
import authApi from "../../utils/authApi";
import { validPassword } from "../../utils/regex";
const win = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const ResetPasswordScreen = (props) => {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const phone = props.route.params.phone;
  const email = props.route.params.email;
  console.log(email);

  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (text) => {
    setPassword(text);
  };
  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
  };

  const handleSubmit = async () => {
    // Handle form submission logic here

    if (password.trim() == "") {
      ToastAndroid.showWithGravityAndOffset(
        "Mật khẩu mới không được bỏ trống!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }
    if (!validPassword.test(password)) {
      ToastAndroid.showWithGravityAndOffset(
        "Mật khẩu mới phải lớn hơn 6 ký tự!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }
    if (password != confirmPassword) {
      ToastAndroid.showWithGravityAndOffset(
        "Xác nhận mật khẩu mới không khớp",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }
    try {
      const params = {
        phone: phone,
        email: email,
        newPassword: password,
        confirmNewPassword: confirmPassword,
      };
      console.log(params);
      const res = await authApi.resetPassword({
        phone: phone,
        email: email,
        newPassword: password,
        confirmNewPassword: confirmPassword,
      });

      ToastAndroid.showWithGravityAndOffset(
        "Cập nhật mật khẩu thành công",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      navigation.navigate("Login");
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
          height: "100%",
          height: "100%",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <View style={styles.container}>
          <Text style={styles.label}>Mật khẩu mới:</Text>

          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            secureTextEntry={passwordHidden}
            onChangeText={handlePasswordChange}
            value={password}
          />

          <Text style={styles.label}>Xác nhận mật khẩu mới:</Text>
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu"
            secureTextEntry={passwordHidden}
            onChangeText={handleConfirmPasswordChange}
            value={confirmPassword}
          />
          <View
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 25,
            }}
          >
            <TouchableOpacity
              style={{
                height: 50,
                width: windowWidth - 60,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ea733c",
                // marginLeft: 12,
                borderRadius: 100,
              }}
              onPress={handleSubmit}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Đổi mật khẩu</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Loader isLoading={isLoading} />
      </View>
    </View>
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
  text: {
    marginLeft: "20%",
    fontSize: 20,
    fontWeight: "bold",
  },

  textIn: {
    fontSize: 20,
    fontStyle: "italic",
    marginTop: 40,
  },

  inputform: {},
  viewInput: {
    marginBottom: 10,
  },
  container: {
    flex: 1,

    // alignItems: "center",
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
export default ResetPasswordScreen;
