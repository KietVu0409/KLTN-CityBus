import { useNavigation } from "@react-navigation/native";
import React, { useRef, useEffect } from "react";
import { Image } from "react-native";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import authApi from "../../utils/authApi";

export default WelcomeScreen = () => {
  const backgroundFade = useRef(new Animated.Value(0)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoMovement = useRef(new Animated.Value(0)).current;
  const loadingTextFade = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    // handleVerifyCustomer()

    Animated.sequence([
      Animated.parallel([
        Animated.timing(backgroundFade, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoFade, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(logoMovement, {
        toValue: -200,
        duration: 2000,
        easing: Easing.inOut(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(loadingTextFade, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => {
      handleVerifyCustomer();
    }, 1000);
  }, []);

  const handleVerifyCustomer = async () => {
    try {
      const res = await authApi.getInfor();
      if (res.data.status == 200) {
        authApi.save_info(res);
        navigation.navigate("Home")
        return;
      }
      navigation.navigate("Login");
    } catch (error) {
      console.log("Failed:", error);
      navigation.navigate("Login");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#e52c00",
      opacity: backgroundFade,
    },
    logo: {
      color: "white",
      fontSize: 48,
      fontWeight: "bold",
      opacity: logoFade,
      transform: [{ translateY: logoMovement }],
    },
  });

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around",
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <Animated.View style={styles.container}>
          <Animated.View style={styles.logo}>
            <Image
              style={{
                width: 300,
                height: 150,
                resizeMode: "contain",
              }}
              source={require("../../../assets/logo.png")}
            ></Image>
            <Text
              style={{
                fontSize: 25,
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              CITY BUS
            </Text>
          </Animated.View>
          <Animated.View
            style={{
              transform: [{ translateY: 300 }],
              opacity: loadingTextFade,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                Đang tải dữ liệu...
              </Text>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
};
