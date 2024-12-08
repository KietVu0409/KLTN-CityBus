import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Text,
  View,
} from "react-native";
import Icons from "@expo/vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/MaterialIcons";
import { padding } from "../../utils/format";
import { Avatar } from "@react-native-material/core";
import DateTimePicker from "@react-native-community/datetimepicker";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import { KeyboardAvoidingView } from "native-base";
import authApi from "../../utils/authApi";
import { validEmail } from "../../utils/regex";
const win = Dimensions.get("window");

const UpdateProfile = ({ route }) => {
  const info = route.params.info;
  const navigation = useNavigation();
  const [phone, setPhone] = useState(info?.phone || "");
  const [name, setName] = useState(info?.fullName || "");
  const emailDefault = info?.email;
  const [email, setEmail] = useState(info?.email || "");
  const [gender, setGender] = useState(info?.gender);
  const [birthDay, setBirthDay] = useState(new Date(info?.birthday) || "");
  const [address, setAddress] = useState(info?.address || "");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDay;
    setShowDatePicker(false);
    setBirthDay(currentDate);
  };

  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };
  const handleUpdateGender = (selectedGender) => {
    setGender(selectedGender);
  };

  const handleSubmit = async () => {
    // console.log(emailDefault.toLowerCase() === email.toLowerCase());
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

    if (email.trim() == "" && emailDefault != "") {
      ToastAndroid.showWithGravityAndOffset(
        "Email không được phép bỏ trống!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    if (email.trim() == "" && emailDefault != "" && !validEmail.test(email)) {
      ToastAndroid.showWithGravityAndOffset(
        "Email nhập không đúng định dạng!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    if (emailDefault.toLowerCase() === email.toLowerCase()) {
      const params = {
        fullName: name,
        email: email == "" ? undefined : email,
        birthDate: birthDay,
        gender: gender,
      };

      try {
        const res = await authApi.updateProfile(params);
        ToastAndroid.showWithGravityAndOffset(
          "Cập nhật thông tin thành công!",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        authApi.save_info(res);
      } catch (error) {
        params = {
          email: email,
        };
        const res = await authApi.sendOtp(params);
        ToastAndroid.showWithGravityAndOffset(
          error.response.data.message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    } else {
      let params;

      params = {
        newEmail: email,

        phone: phone,
      };
      console.log(params);
      const res = await authApi.sendOtp(params);

      ToastAndroid.showWithGravityAndOffset(
        "Gửi mã OTP thành công!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      navigation.navigate("ConfirmEmailScreen", {
        email: email,
        params: {
          fullName: name,
          birthDate: birthDay,
          gender: gender,
        },
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      KeyboardAvoidingView={30}
      style={{ flex: 1 }}
    >
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
              Cập nhật thông tin
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <KeyboardAvoidingView behavior="padding">
            <ScrollView>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Avatar
                  icon={(props) => (
                    <Icons name="account" {...props} size={70} />
                  )}
                  style={{
                    backgroundColor: "#f2eea4",
                    height: 70,
                    width: 70,
                  }}
                />
              </View>
              <Text style={styles.label}>Họ và tên:</Text>
              <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                onChangeText={handleNameChange}
                value={name}
              />
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={handleEmailChange}
                value={email}
              />
              <Text style={styles.label}>Ngày sinh:</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputDate}
                  placeholder="Chọn ngày sinh"
                  value={moment(birthDay).format("DD/MM/YYYY")}
                  editable={false}
                />
                <TouchableOpacity onPress={handleShowDatePicker}>
                  <FontAwesome name="calendar" size={24} color="black" />
                </TouchableOpacity>
              </View>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
              <Text style={styles.label}>Giới tính:</Text>
              <View style={styles.genderSelection}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === "M" && styles.selectedGenderButton,
                  ]}
                  onPress={() => handleUpdateGender("M")}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === "M" && styles.selectedGenderButtonText,
                    ]}
                  >
                    Nam
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === "F" && styles.selectedGenderButton,
                  ]}
                  onPress={() => handleUpdateGender("F")}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === "F" && styles.selectedGenderButtonText,
                    ]}
                  >
                    Nữ
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === "O" && styles.selectedGenderButton,
                  ]}
                  onPress={() => handleUpdateGender("O")}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === "O" && styles.selectedGenderButtonText,
                    ]}
                  >
                    Khác
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Cập nhật</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default UpdateProfile;

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
    justifyContent: "center",
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 40,
    width: "100%",
    borderColor: "gray",
    color: "#000",
    marginBottom: 10,
    marginTop: 10,
  },
  inputDate: {
    flex: 1,
    color: "#000",
  },
  button: {
    backgroundColor: "#ea733c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  genderSelection: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
    marginLeft: 30,
    marginTop: 10,
  },
  genderButton: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  selectedGenderButton: {
    backgroundColor: "#7f58af",
  },
  genderButtonText: {
    color: "#444",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedGenderButtonText: {
    color: "#fff",
  },
  updateButton: {
    backgroundColor: "#7f58af",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
