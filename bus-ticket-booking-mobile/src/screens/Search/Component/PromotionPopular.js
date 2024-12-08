import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
const win = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const PromotionPopular = (props) => {
  const { data } = props;
  const navigation = useNavigation();

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 15 }}>
        Ưu đãi nổi bật
      </Text>
      <FlatList
        data={data}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              margin: 1,
            }}
          >
            <TouchableOpacity
              style={[
                {
                  backgroundColor: "#ffffff",
                  margin:10,
                  borderRadius: 10,
                  height: 250,
                  width: 300,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 5,
                  display:'flex',
                },
              ]}
              onPress={() =>
                navigation.navigate("PromotionDetail", { item: item })
              }
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: "100%",
                  height: "80%",
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
              />
              <Text style={{ fontSize: 17, fontWeight: "bold", color: "#000", textAlign:'left', marginLeft:10 }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default PromotionPopular;
