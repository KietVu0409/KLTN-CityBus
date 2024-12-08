import React, { useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import COLORS from '../../consts/color';
import { default as Icon, default as MaterialIcons } from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import promotionApi from '../../utils/promotionApi';
import { useEffect } from 'react';
import orderApi from '../../utils/orderApi';
import QRCode from 'react-native-qrcode-svg';
import { convertCurrency } from '../../utils/curren';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Foundation from 'react-native-vector-icons/Foundation';
import { Alert } from 'react-native';

const Payment = ({ navigation, route }) => {
  const dataOrder = route.params.data;
  const [detail, setDetail] = useState();
  //   const [isRefreshing, setIsRefreshing] = useState(false);
  //   const [promotionLine, setPromotionLine] = useState([]);

  const getDetail = async () => {
    try {
      const res = await orderApi.getOrderById(dataOrder.id);

      setDetail(res?.data.data);
    } catch (error) {
      console.log('Failed:', error);
      ToastAndroid.showWithGravityAndOffset(
        error.response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  };
  useEffect(() => {
    getDetail();
  }, [dataOrder]);

  const onPayment = async () => {
    try {
      console.log('====', dataOrder);
      const res = await orderApi.bookingZalo({ orderCode: dataOrder?.code });

      const url = res?.data?.data?.zalo?.order_url;
      navigation.navigate("PaymentScreen", { url: url, dataOrder: dataOrder });
      // navigation.navigate("Vé của tôi");
      ToastAndroid.showWithGravityAndOffset(
        'Đặt vé thành công!',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } catch (error) {
      console.log('Failed:', error);
      ToastAndroid.showWithGravityAndOffset(
        error.response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  };

  const onGoback = async () => {
    try {
      const res = await orderApi.updateStatusOrder(dataOrder.code, {
        status: 'Hủy đặt vé',
      });

      navigation.goBack();
    } catch (error) {}
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <View style={styles.top}>
        <Icon name="arrow-back" size={25} onPress={onGoback} color="white" />
        <View style={styles.topInfo}>
          <Text
            style={{
              color: '#fff',
              fontSize: 17,
              fontWeight: 'bold',
              marginLeft: 5,
            }}
          >
            Thanh toán
          </Text>
        </View>
      </View>

      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          Mã QR
        </Text>
        <QRCode value={detail?.code} size={150} color="#000000" backgroundColor="#ffffff" />
      </View>

      <View style={styles.content}>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Khách hàng:</Text>
          <Text>{detail?.customer.fullName}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Số điện thoại:</Text>
          <Text>{detail?.customer.phone}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Nơi đi:</Text>
          <Text>{detail?.orderDetails[0].ticketDetail.ticket.tripDetail.trip.fromStation.name}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Nơi đến:</Text>
          <Text>{detail?.orderDetails[0].ticketDetail.ticket.tripDetail.trip.toStation.name}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Thời gian đi:</Text>
          <Text>
            {moment(detail?.orderDetails[0].ticketDetail.ticket.tripDetail.departureTime).format('DD/MM/YYYY HH:MM')}
          </Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Xe:</Text>
          <Text>{detail?.orderDetails[0].ticketDetail.seat.vehicle.name}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Biển số:</Text>
          <Text>{detail?.orderDetails[0].ticketDetail.seat.vehicle.licensePlate}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Danh sách ghế:</Text>
          <Text>{detail?.orderDetails?.map((item) => item.ticketDetail.seat.name).join(',')}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Tổng tiền:</Text>
          <Text>{convertCurrency(detail?.total)}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Giảm giá:</Text>
          <Text>{convertCurrency(detail?.finalTotal - detail?.total)}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Thành tiền:</Text>
          <Text>{convertCurrency(detail?.finalTotal)}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Ngày đặt:</Text>
          <Text>{moment(detail?.createdAt).format('DD/MM/YYYY HH:MM')}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.textItem}>Trạng thái:</Text>
          <Text style={{ color: '#f23535', fontWeight: 'bold' }}>
            <Foundation name="x" color={'#f23535'} size={14} style={{ marginLeft: 10 }} /> {detail?.status}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              width: '100%',
              marginTop: 10,
              backgroundColor: '#f2e941',
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 7,
            }}
            onPress={onPayment}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  top: {
    backgroundColor: '#ea733c',
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
    // alignItems: "center",
  },
  content: {
    display: 'flex',
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
  },
  content2: {
    display: 'flex',
    backgroundColor: '#edd0d0',
    borderRadius: 20,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
  },
  contentItem: {
    display: 'flex',
    // justifyContent: "center",
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  textItem: {
    fontWeight: '700',
    fontSize: 15,
    marginRight: 10,
  },
});

export default Payment;
