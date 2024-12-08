import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import provinceApi from "../../../utils/provinceApi";
import { Divider } from "@react-native-material/core";
import Loader from "../../../components/Loader/loader";

const SearchProvince = ({ navigation, route }) => {
  const [query, setQuery] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handelData = async () => {
    setIsLoading(true);
    const res = await provinceApi.getAll();
    const data = res?.data?.data;
    const newData = data.filter(item => item.code !== 0);
    setProvinces(newData);
    setIsLoading(false);
  };
  useEffect(() => {
    handelData();
  }, []);

  const handleSearch = (text) => {
    setQuery(text);
  };
  const filteredProvinces = provinces.filter((province) =>
    province.name.normalize("NFC").toLowerCase().includes(query.normalize("NFC").toLowerCase())
  );
  return (
    <View>
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
            {route.params.type == "from" ? "Nơi xuất phát" : "Bạn muốn đi đâu"}
          </Text>
        </View>
      </View>
      <View style={styles.search}>
        <FontAwesome5
          name="dot-circle"
          color={route.params.type == "from" ? "#3c67e8" : "red"}
          size={25}
          style={{ marginLeft: 10 }}
        />
        <TextInput
          style={{
            height: 40,
            width: "80%",
            marginLeft: 15,
            fontSize: 17,
          }}
          placeholder="Tên tỉnh/thành phố"
          onChangeText={handleSearch}
          value={query}
        />
      </View>
      <View>
        <Text
          style={{
            marginTop: 10,
            fontSize: 17,
            color: "#bfa8a8",
            fontWeight: "bold",
            marginLeft: 15,
          }}
        >
          Tất cả tỉnh/thành phố
        </Text>
      </View>
      <FlatList
        data={filteredProvinces}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              route.params.callback(item);
              navigation.goBack();
            }}
          >
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginLeft: 10,
                  alignItems: "center",
                  padding: 10,
                  height: 70,
                }}
              >
                <EvilIcons
                  name="location"
                  size={30}
                  color="#3c67e8"
                ></EvilIcons>
                <Text
                  style={{ fontSize: 17, marginLeft: 10, fontWeight: "bold" }}
                >
                  {item.name}
                </Text>
              </View>
              <Divider style={{}} />
            </View>
          </TouchableOpacity>
        )}
      />
      <Loader isLoading={isLoading} />
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
  search: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#d8bcbc",
    borderBottomWidth: 3,
    paddingBottom: 5,
  },
});

export default SearchProvince;
