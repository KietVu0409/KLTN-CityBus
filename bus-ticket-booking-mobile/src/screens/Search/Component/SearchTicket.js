import { TextInput } from "@react-native-material/core";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import tripApi from "../../../utils/tripApi";
import priceListApi from "../../../utils/priceListApi";
import Loader from "../../../components/Loader/loader";
moment.locale("vi");
const win = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const SearchComponent = (props) => {
  const navigation = useNavigation();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedFromPosition, setSelectedFromPosition] = useState({});
  const [selectedToPosition, setSelectedToPosition] = useState({});
  const [dataTripDetail, setDataTripDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCallBackFrom = (newData) => {
    setSelectedFromPosition(newData);
  };
  const handleCallBackTo = (newData) => {
    setSelectedToPosition(newData);
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const dt = new Date(date);
    const x = moment(dt).format("MM/DD/YYYY");
    setSelectedDate(x);
    hideDatePicker();
  };

  const handleSearchTrip = async () => {
    if(selectedFromPosition?.code == null){
      ToastAndroid.showWithGravityAndOffset(
        "Vui lòng chọn nơi xuất phát",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return
    }
    if(selectedToPosition?.code == null){
      ToastAndroid.showWithGravityAndOffset(
        "Vui lòng chọn nơi đến",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return
    }
    const params = {
      fromProvinceCode: selectedFromPosition?.code,
      toProvinceCode: selectedToPosition?.code,
      departureTime: selectedDate,
    };
    try {
      setIsLoading(true);
      const res = await tripApi.findAllTrip({
        isAll: true,
        ...params,
      });
      const data = res?.data?.data;

      const updatedData = await Promise.all(
        data.map(async (item) => {
          const response = await tripApi.getTripDetailById(item.id);
          item.trip = response?.data?.data?.trip;
          item.vehicle = response?.data?.data?.vehicle;
          return item;
        })
      );

      // Gọi API để lấy giá cho từng chuyến đi
      await Promise.all(
        updatedData.map(async (item) => {
          const response = await priceListApi.getPrice({
            applyDate: new Date(),
            tripDetailCode: item?.code,
            seatType: item?.vehicle?.type,
          });

          item.price = response?.data?.data?.price;
        })
      );

      setDataTripDetail(updatedData);

      setIsLoading(false);
      navigation.navigate("TicketList", {
        data: updatedData,
        from: selectedFromPosition?.name,
        to: selectedToPosition?.name,
        date: selectedDate,
      });
    } catch (error) {
      console.log("Failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          flex: 1,
          height: "100%",
          width: windowWidth - 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
          padding: 10,
          borderRadius: 10,
          borderColor: "#ccc",
          borderWidth: 1,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 20,
              color: "#000",
              fontWeight: "800",
              marginBottom: 20,
            }}
          >
            Tìm kiếm chuyến xe
          </Text>
        </View>
        <View
          style={{
            width: windowWidth - 100,
            height: 50,
            marginTop: 5,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <FontAwesome5 name="dot-circle" color="#3c67e8" size={25} />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SearchProvince", {
                callback: handleCallBackFrom,
                type: "from",
              })
            }
            style={{ display: "flex", flexDirection: "row" }}
          >
            <TextInput
              style={{
                height: "100%",
                flex: 1,
                fontSize: 16,
                width: "100%",
                marginLeft: 20,
                color: "#000",
                backgroundColor: "#ffffff",
              }}
              editable={false}
              // autoCapitalize={false}
              variant="standard"
              label="Nơi xuất phát"
              value={selectedFromPosition?.name}
            ></TextInput>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: windowWidth - 100,
            height: 50,
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesome5 name="dot-circle" color="red" size={25} />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SearchProvince", {
                callback: handleCallBackTo,
                type: "to",
              })
            }
            style={{ display: "flex", flexDirection: "row" }}
          >
            <TextInput
              style={{
                height: "100%",
                flex: 1,
                fontSize: 16,
                width: "100%",
                marginLeft: 20,
              }}
              label="Bạn muốn đi đâu"
              editable={false}
              // autoCapitalize={false}
              variant="standard"
              value={selectedToPosition?.name}
            ></TextInput>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: windowWidth - 100,
            height: 50,
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <MaterialIcons name="date-range" size={25} color="#3c67e8" />
          <TouchableOpacity
            onPress={showDatePicker}
            style={{ display: "flex", flexDirection: "row" }}
          >
            <TextInput
              style={{
                height: "100%",
                flex: 1,
                fontSize: 16,
                width: "100%",
                marginLeft: 20,
              }}
              editable={false}
              // autoCapitalize={false}
              variant="standard"
              label="Ngày đi"
              value={moment(selectedDate, "MM/DD/YYYY").format("DD/MM/YYYY")}
            ></TextInput>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            minimumDate={new Date()}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            style={{ width: "100%" }}
            locale="vi"
            datePickerModeAndroid="spinner"
          />
        </View>
      </View>
      <TouchableOpacity
        style={{
          height: 55,
          width: 380,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F43E26",
          marginTop: 10,
          borderRadius: 10,
        }}
        onPress={handleSearchTrip}
      >
        <Text style={{ color: "white", fontSize: 19, fontWeight: "600" }}>
          Tìm vé
        </Text>
      </TouchableOpacity>
      <Loader isLoading={isLoading} />
    </View>
  );
};

export default SearchComponent;
