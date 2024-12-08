import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import authApi from "../../utils/authApi";
import { padding } from "../../utils/format";
import { validPassword } from "../../utils/regex";

const win = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const ChangePassScreen = ({ phone }) => {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");

  const onChangePassword = async () => {
    if (password.trim() == "") {
      ToastAndroid.showWithGravityAndOffset(
        "Mật khẩu không được bỏ trống!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    if (!validPassword.test(newPassword)) {
      ToastAndroid.showWithGravityAndOffset(
        "Mật khẩu mới phải lớn hơn 6 ký tự!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    if (newPassword != reNewPassword) {
      ToastAndroid.showWithGravityAndOffset(
        "Nhập lại mật khẩu không khớp",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    try {
      const res = await authApi.change_password({
        oldPassword: password,
        newPassword: newPassword,
        confirmNewPassword: reNewPassword,
      });
      ToastAndroid.showWithGravityAndOffset(
        "Đổi mật khẩu thành công",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      navigation.goBack();
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
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
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
              marginLeft: 10,
            }}
          >
            Đổi mật khẩu
          </Text>
        </View>
      </View>
      <View
        style={{
          ...padding(10, 10),
        }}
      >
        <View style={styles.viewInput}>
          <TextInput
            style={{
              width: "100%",
              height: 40,
              borderColor: "#ddc7c7",
              borderWidth: 1,
              marginVertical: 10,
              paddingHorizontal: 10,
            }}
            type="password"
            placeholder="Mật khẩu cũ"
            secureTextEntry={true}
            onChangeText={setPassword}
          ></TextInput>
        </View>
        <View style={styles.viewInput}>
          <TextInput
            type="password"
            placeholder="Mật khẩu mới"
            onChangeText={setNewPassword}
            secureTextEntry={true}
            style={{
              width: "100%",
              height: 40,
              borderColor: "#ddc7c7",
              borderWidth: 1,
              marginVertical: 10,
              paddingHorizontal: 10,
            }}
          ></TextInput>
        </View>
        <View style={styles.viewInput}>
          <TextInput
            style={{
              width: "100%",
              height: 40,
              borderColor: "#ddc7c7",
              borderWidth: 1,
              marginVertical: 10,
              paddingHorizontal: 10,
            }}
            type="password"
            secureTextEntry={true}
            placeholder="Nhập lại mật khẩu mới"
            onChangeText={setReNewPassword}
          ></TextInput>
        </View>
        <TouchableOpacity
          style={{
            height: 50,
            width: windowWidth - 60,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F43E26",
            marginLeft: 20,
            marginTop: 20,
            marginBottom: 20,
            borderRadius: 100,
          }}
          onPress={onChangePassword}
        >
          <Text style={{ fontSize: 17, fontWeight: "bold", color: "#fff" }}>
            Đổi mật khẩu
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassScreen;

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
});
