import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../../consts/color";
import MyTicketCancel from "./MyTicketCancel";
import MyTicketIssued from "./MyTicketIssued";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      initialRouteName="MyTicketIssued"
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#F8F8F8",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
        },
        tabBarLabelStyle: {
          textAlign: "center",
          fontSize: 12,
        },
        tabBarIndicatorStyle: {
          borderBottomColor: "#F43E26",
          borderBottomWidth: 2,
        },
        tabBarPressColor: "#ffffff",
      }}
    >
      <Tab.Screen
        name="MyTicketIssued"
        options={{
          tabBarLabel: "Vé đã đi",
          tabBarLabelStyle: {
            color: "#000",
            fontSize: 15,
            fontWeight: "600",
            textTransform: "capitalize",
          },
        }}
        component={MyTicketIssued}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action

            // Do something with the `navigation` object
            navigation.navigate("MyTicketIssued");
          },
        })}
      />

      <Tab.Screen
        name="MyTicketCancel"
        options={{
          tabBarLabel: "Vé đã hủy",
          tabBarLabelStyle: {
            color: "#000",
            fontSize: 15,
            fontWeight: "600",
            textTransform: "capitalize",
          },
        }}
        component={MyTicketCancel}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action
            // Do something with the `navigation` object
            navigation.navigate("MyTicketCancel");
          },
        })}
      />
    </Tab.Navigator>
  );
};

const MyTicketScreen = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: COLORS.white,
        flex: 1,
      }}
    >
      <View style={styles.top}>
        <Icon
          name="arrow-back"
          size={24}
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
            Lịch sử đặt vé
          </Text>
        </View>
      </View>
      <NavigationContainer independent={true}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "#633689" },
            headerTintColor: "white",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        >
          <Stack.Screen
            name="TabStack"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
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
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyTicketScreen;
