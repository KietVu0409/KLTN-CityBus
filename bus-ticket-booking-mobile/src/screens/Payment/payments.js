// import { useNavigation } from "@react-navigation/native";
// import { useRef, useState } from "react";
// import { Alert } from "react-native";
// import { Linking } from "react-native";
// import { WebView } from "react-native-webview";
// import orderApi from "../../utils/orderApi";

// // URL thanh toán của Zalo Pay
// const redirectUri = "https://ticket-booking-client.vercel.app/"; // đường dẫn đăng ký với Zalo Pay

// const PaymentScreen = ({ navigation, route }) => {
//   const url = route.params.url;
//   const dataOrder = route.params.dataOrder;
//   const webviewRef = useRef(null);
//   const [loading, setLoading] = useState(true);

//   const handleNavigationStateChange = async (navState) => {
//     if (navState.url.includes("https://ticket-booking-client.vercel.app/")) {
//       setLoading(false);
//       // Xử lý khi thanh toán thành công
//       try {
//         const res = await orderApi.getOrderById(dataOrder.id);
//         const order = res.data.data;
//         console.log('order.code: ', order.code);
//         await orderApi.updateStatusOrder(order.code, {
//           status: 'Đã thanh toán',
//         });

//         if (order.status === "Đã thanh toán") {
//           navigation.navigate("Vé của tôi");
//           Alert.alert("Đặt vé thành công!");
//         } else {
//           await orderApi.updateStatusOrder(dataOrder.code, {
//             status: 'Hủy đặt vé',
//           });
//           navigation.navigate("Vé của tôi");
//           Alert.alert("Đặt vé không thành công!");
//         }
//       } catch (error) {}

      
//     }
//   };

//   return (
//     <WebView
//       source={{ uri: url }}
//       style={{ flex: 1 }}
//       onLoadStart={() => setLoading(true)}
//       onLoadEnd={() => setLoading(false)}
//       onNavigationStateChange={handleNavigationStateChange}
//     />
//   );
// };

// export default PaymentScreen;


import { useRef, useState } from "react";
import { Alert } from "react-native";
import { WebView } from "react-native-webview";
import orderApi from "../../utils/orderApi";

const redirectUri = "https://ticket-booking-client.vercel.app/"; // Đường dẫn đăng ký với Zalo Pay

const PaymentScreen = ({ navigation, route }) => {
  const url = route.params.url;
  const dataOrder = route.params.dataOrder;
  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  console.log("dataOrder: ", dataOrder);

  const handleNavigationStateChange = async (navState) => {
    if (navState.url.includes(redirectUri)) {
      setLoading(false);

      try {
        const abc = await orderApi.getOrderById(dataOrder.id);
        const order = abc.data.data;
        console.log('order: ', order);
        console.log('paymentMethod: ', order?.paymentMethod);
        // Gọi checkStatusZaloPay để kiểm tra trạng thái thanh toán
        const checkStatusResponse = await orderApi.checkStatusZaloPay({ orderCode: order?.code, paymentMethod: order?.paymentMethod });
        console.log("Order code gửi lên API:", dataOrder?.code);
        const paymentStatus = checkStatusResponse.data.data;

        console.log("paymentStatus: ", paymentStatus?.status);

        if (paymentStatus?.status === "Đã thanh toán") {
          navigation.navigate("Vé của tôi");
          Alert.alert("Đặt vé thành công!");
        } else if (paymentStatus?.status === "Chờ thanh toán") {
          Alert.alert("Thanh toán đang được xử lý. Vui lòng kiểm tra sau.");
        } else {
          navigation.navigate("Vé của tôi");
          Alert.alert("Đặt vé không thành công!");
        }
      } catch (error) {
        // if (error.response) {
        //   console.log("Lỗi API:", error.response.status, error.response.data);
        // } else if (error.request) {
        //   console.log("Không nhận được phản hồi từ server:", error.request);
        // } else {
        //   console.log("Lỗi khác:", error.message);
        // }
        // Alert.alert("Đã xảy ra lỗi trong quá trình kiểm tra thanh toán.");
      }
    }
  };

  return (
    <WebView
      source={{ uri: url }}
      style={{ flex: 1 }}
      onLoadStart={() => setLoading(true)}
      onLoadEnd={() => setLoading(false)}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
};

export default PaymentScreen;
