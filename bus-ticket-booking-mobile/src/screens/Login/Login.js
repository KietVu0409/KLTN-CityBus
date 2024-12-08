
import { padding } from "../../utils/format";
import {
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  StyleSheet,
  View,
  Text
} from "react-native";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../../components/Loader/loader";
import authApi from "../../utils/authApi";
import { KeyboardAvoidingView, StatusBar } from "native-base";
import AntIcon from "react-native-vector-icons/AntDesign";
import FeatherIcon from "react-native-vector-icons/Feather";
import { validPassword } from "../../utils/regex";
import { validPhone } from "../../utils/regex";

const win = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const SIGN_IN = "SIGN_IN";
const SIGN_UP = "SIGN_UP";

const LoginScreen = (props) => {
  const navigation = useNavigation();
  const [page, setPage] = useState(SIGN_IN);
  return (
    <View style={{ width: "100%", flex: 1 }}>
      <View style={{ height: "30%", width: "100%" }}>
        <TopComponent page={page} setPage={setPage}></TopComponent>
      </View>
      <View
        style={{ height: "70%", width: "100%", backgroundColor: "#f5f5f5" }}
      >
        {page === SIGN_IN ? <LoginComponent /> : <RegisterComponent />}
      </View>
    </View>
  );
};

const TopComponent = ({ page, setPage }) => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content"></StatusBar>
      <View style={{ width: "100%", height: "100%" }}>
        <View
          style={{
            width: "100%",
            flex: 1,
            backgroundColor: "#ea733c",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          
          <Image
            source={require("../../../assets/logo.png")}
            style={{ height: 100, width: 100 }}
          ></Image>
          <View>
            <Text style={{ fontSize: 30, fontWeight: "600", color: "#ffffff" }}>
              CITY BUS
            </Text>
            <Text style={{ color: "#ffffff" }}>đặt vé xe giá rẻ</Text>
          </View>
        </View>
        <View
          style={{ height: 50, flexDirection: "row", backgroundColor: "#fff" }}
        >
          <TouchableOpacity
            style={{
              width: "50%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setPage(SIGN_IN)}
            disabled={page === SIGN_IN ? true : false}
          >
            <Text style={{ fontSize: 20, color: "#ea733c" }}>Đăng nhập</Text>

            {page === SIGN_IN ? (
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  height: 3,
                  width: "100%",
                  backgroundColor: "#ea733c",
                }}
              ></View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "50%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setPage(SIGN_UP)}
            disabled={page === SIGN_UP ? true : false}
          >
            <Text style={{ fontSize: 20, color: "#ea733c" }}>Đăng ký</Text>
            {page === SIGN_UP ? (
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  height: 3,
                  width: "100%",
                  backgroundColor: "#ea733c",
                }}
              ></View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const FooterComponent = () => {
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1, marginTop: 20 }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: 40,
            width: windowWidth - 60,
            marginLeft: 30,
          }}
        >
          <View
            style={{ height: 1, width: "20%", backgroundColor: "#707070" }}
          ></View>

          <Text style={{ marginLeft: 20, marginRight: 20 }}>
            Hoặc đăng nhập bằng
          </Text>
          <View
            style={{ height: 1, width: "20%", backgroundColor: "#707070" }}
          ></View>
        </View>
        <View
          style={{
            height: 45,
            width: windowWidth - 60,
            marginLeft: 30,
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              padding: 10,
              width: "45%",
              borderRadius: 20,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
              }}
            >
              <Image
                source={require("../../../assets/google.png")}
                style={{ width: 35, height: 35 }}
              ></Image>
              <Text style={{ color: "#000", fontSize: 16, marginLeft: 10 }}>
                Google
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              padding: 10,
              width: "45%",
              borderRadius: 20,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
              }}
            >
              <Image
                source={require("../../../assets/facebook.png")}
                style={{ width: 30, height: 30 }}
              ></Image>
              <Text
                style={{
                  color: "#000",
                  fontSize: 16,
                  marginLeft: 10,
                }}
              >
                FaceBook
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
const LoginComponent = () => {
  const navigation = useNavigation();

  const [password, setPassword] = useState("123456789x@X");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // const [email, setEmail] = useState("superman@gmail.com");
  const [inputType, setInputType] = useState("email");
  const [inputValue, setInputValue] = useState("0348333253");

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

  const onLogin = async () => {
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
    try {
      setIsLoading(true);
      let params;

      params = {
        email: email == "" ? undefined : email,
        password: password,
        phone: phone == "" ? undefined : phone,
      };

      
      const res = await authApi.login(params);
      if (res.data.statusCode == 200) {
        authApi.save_token(res);
        handleVerifyCustomer();
        navigation.navigate("Home");
      } else {
        ToastAndroid.showWithGravityAndOffset(
          "Sai số điện thoại hoặc mật khẩu!",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Failed:", error);
      ToastAndroid.showWithGravityAndOffset(
        "Sai số điện thoại hoặc mật khẩu!",
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
    <KeyboardAvoidingView behavior="padding">
      <View
        style={{
          height: "100%",
          marginTop: 60,
        }}
      >
        <Text style={{ fontSize: 24, marginLeft: 30 }}>
          Đăng nhập bằng tài khoản.
        </Text>
        <View
          style={{
            width: windowWidth - 60,
            marginLeft: 30,
            height: 45,
            marginTop: 20,
            flexDirection: "row",
            backgroundColor: "white",
            alignItems: "center",
          }}
        >
          <AntIcon
            name="user"
            size={20}
            color="#000"
            style={{ marginLeft: 10 }}
          />
          <ScrollView keyboardShouldPersistTaps="handled">
            <TextInput
              style={{
                height: "100%",
                flex: 1,
                marginLeft: 10,
                fontSize: 16,
                width: "100%",
              }}
             
              placeholder="Email hoặc số điện thoại"
              onChangeText={handleInputChange}
              defaultValue="superman@gmail.com"
              type="email"
              value={inputValue}
            ></TextInput>
          </ScrollView>
        </View>

        <View
          style={{
            width: windowWidth - 60,
            marginLeft: 30,
            height: 45,
            marginTop: 20,
            flexDirection: "row",
            backgroundColor: "white",
            alignItems: "center",
          }}
        >
          <FeatherIcon
            name="lock"
            size={20}
            color="#000"
            style={{ marginLeft: 10 }}
          />
          <TextInput
            style={{ height: "90%", flex: 1, marginLeft: 10, fontSize: 16 }}
            
            placeholder="Mật khẩu"
            secureTextEntry={passwordHidden ? true : false}
            type="password"
            onChangeText={setPassword}
            defaultValue="123456789x@X"
          ></TextInput>
          <TouchableOpacity
            style={{
              height: "100%",
              aspectRatio: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => setPasswordHidden(!passwordHidden)}
          >
            <AntIcon
              name="eye"
              style={{ width: 20, height: "100%", marginTop: 25 }}
              size={20}
            ></AntIcon>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: windowWidth - 60,
            marginLeft: 30,
            height: 30,
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", right: 0 }}
            onPress={() => {
              navigation.navigate("Forgot");
            }}
          >
            <Text style={{ color: "#707070" }}>Quên mật khẩu ?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            height: 50,
            width: windowWidth - 60,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ea733c",
            marginLeft: 30,
            marginTop: 10,
            borderRadius: 100,
          }}
          onPress={onLogin}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Đăng nhập</Text>
        </TouchableOpacity>
        <Loader isLoading={isLoading} />
      </View>
    </KeyboardAvoidingView>
  );
};

const RegisterComponent = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [name, setName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const handleNameChange = (text) => {
    setName(text);
  };

  const handlePhoneChange = (text) => {
    setPhone(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };
  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
  };

  const togglePasswordVisibility = () => {
    setPasswordHidden(!passwordHidden);
  };

  const handleSubmit = async () => {
    // Handle form submission logic here
    if (name.trim() == "") {
      ToastAndroid.showWithGravityAndOffset(
        "Tên không được phép bỏ trống!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }
    if (phone.trim() == "") {
      ToastAndroid.showWithGravityAndOffset(
        "Vui lòng nhập số điện thoại!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }
    if (!validPhone.test(phone)) {
      ToastAndroid.showWithGravityAndOffset(
        "Số điện thoại nhập không đúng định dạng!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }
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
        "Nhập lại mật khẩu không khớp",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }
    console.log("tesst");
    try {
      const res = await authApi.register({
        fullName: name,
        phone: phone,
        password: password,
        // isOtp: true,
      });
      navigation.navigate("RegisterVerifyScreen", {
        phone: phone,
        password: password,
      });
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
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, marginTop: 25 }}>
      <ScrollView>
        <View
          style={{
            height: "100%",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 24, marginLeft: 30 }}>
            Đăng ký tài khoản.
          </Text>

          <View style={styles.container}>
            <Text style={styles.label}>Họ và tên:</Text>
            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              onChangeText={handleNameChange}
              value={name}
            />
            <Text style={styles.label}>Số điện thoại:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Số điện thoại"
              onChangeText={handlePhoneChange}
              value={phone}
            />
            <Text style={styles.label}>Mật khẩu:</Text>

            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              secureTextEntry={passwordHidden}
              onChangeText={handlePasswordChange}
              value={password}
            />

            <Text style={styles.label}>Nhập lại mật khẩu:</Text>
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
                <Text style={{ color: "white", fontSize: 16 }}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Loader isLoading={isLoading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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

export default LoginScreen;
