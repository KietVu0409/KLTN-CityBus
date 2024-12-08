import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NativeBaseProvider } from "native-base";
import { StyleSheet } from "react-native";
import "react-native-gesture-handler";
import BottomNavigator from "./src/navigation/BottomNavigator";
import ChangePassScreen from "./src/screens/Change_Password/Change_Password";
import Login from "./src/screens/Login/Login";
import MyTicketScreen from "./src/screens/MyTicket/MyHistoryTicket";
import SearchProvince from "./src/screens/Search/Component/SearchProvinceFrom";
import TicketList from "./src/screens/Search/Component/TicketList";
import WelcomeScreen from "./src/screens/WelCome/WelCome";
import TicketScreen from "./src/screens/Ticket/Ticket";
import PromotionDetail from "./src/screens/Promotion/PromotionDetail";
import UpdateProfile from "./src/screens/MyAccount/UpdateProfile";
import TicketDetail from "./src/screens/MyTicket/TicketDetail";
import Payment from "./src/screens/Payment/Payment";
import ForgotScreen from "./src/screens/Login/Forgot";
import RegisterVerifyScreen from "./src/screens/Login/RegisterVerifyScreen";
import ForgotVerifyScreen from "./src/screens/Login/ForgotVerifyScreen";
import ResetPasswordScreen from "./src/screens/Login/ResetPassword";
import ConfirmEmailScreen from "./src/screens/MyAccount/ConfirmEmail";
import PaymentScreen from "./src/screens/Payment/payments";



const Stack = createStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          //   screenOptions={{
          //     headerShown: false
          // }}
        >
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: "Đăng nhập", headerShown: false }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePassScreen}
            options={{ title: "Đổi mật khẩu", headerShown: false }}
          />
          <Stack.Screen
            name="SearchProvince"
            component={SearchProvince}
            options={{ title: "Tìm kiếm nơi đi", headerShown: false }}
          />
          <Stack.Screen
            name="TicketList"
            component={TicketList}
            options={{ title: "Tìm vé", headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={BottomNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyTicket"
            component={MyTicketScreen}
            options={{ title: "Đăng nhập", headerShown: false }}
          />
          <Stack.Screen
            name="TicketScreen"
            component={TicketScreen}
            options={{ title: "Danh sách ghế", headerShown: false }}
          />

          <Stack.Screen
            name="PromotionDetail"
            component={PromotionDetail}
            options={{ title: "Chi tiết", headerShown: false }}
          />
          <Stack.Screen
            name="UpdateProfile"
            component={UpdateProfile}
            options={{ title: "Cập nhật thông tin", headerShown: false }}
          />
          <Stack.Screen
            name="TicketDetail"
            component={TicketDetail}
            options={{ title: "Chi tiết vé", headerShown: false }}
          />
          <Stack.Screen
            name="Payment"
            component={Payment}
            options={{ title: "Thanh toán", headerShown: false }}
          />
          <Stack.Screen
            name="Forgot"
            component={ForgotScreen}
            options={{ title: "Quên mật khẩu", headerShown: false }}
          />

          <Stack.Screen
            name="RegisterVerifyScreen"
            component={RegisterVerifyScreen}
            options={{ title: "Xác thực số điện thoại" }}
          />

          <Stack.Screen
            name="ForgotVerifyScreen"
            component={ForgotVerifyScreen}
            options={{ title: "Xác thực số điện thoại" }}
          />

          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
            options={{ title: "Đặt lại mật khẩu" }}
          />
          <Stack.Screen
            name="ConfirmEmailScreen"
            component={ConfirmEmailScreen}
            options={{ title: "Xác thực email" }}
          />  
          <Stack.Screen
            name="PaymentScreen"
            component={PaymentScreen}
            options={{ title: "Thanh toán" }}
          /> 
          
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
