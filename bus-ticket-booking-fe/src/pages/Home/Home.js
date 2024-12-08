import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import ImageNen from "../../assets/nenBen.jpg";
import { ProvinceApi } from "../../utils/provinceApi";
import SearchIcon from "@mui/icons-material/Search";
import AdjustIcon from "@mui/icons-material/Adjust";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import "./Home.scss";
import customToast from "../../components/ToastCustom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { TripApi } from "../../utils/tripApi";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { PromotionApi } from "../../utils/promotionApi";

const Home = (props) => {
  const [optionsProvince, setOptionsProvince] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromProvince, setFromProvince] = useState(null);
  const [toProvince, setToProvince] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();
  const [dataPromotion, setDataPromotion] = useState([]);
  console.log(dataPromotion);

  const handleGetDataPromotion = async () => {
    try {
      const promotionApi = new PromotionApi();
      const response = await promotionApi.getAll({
        page: 1,
        pageSize: 5,
      });
      setDataPromotion(response?.data?.data);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  const getDataProvince = async () => {
    try {
      setLoading(true);
      const provinceApi = new ProvinceApi();
      const res = await provinceApi.getAllProvince();
      const data = res?.data?.data
      const newData = data.filter(item => item.code !== 0);
      setOptionsProvince(newData);
      setLoading(false);
    } catch (error) {}
  };
  useEffect(() => {
    getDataProvince();
    handleGetDataPromotion();
  }, []);

  const handleChangeFromProvince = (event, newValue) => {
    setFromProvince(newValue);
  };
  const handleChangeToProvince = (event, newValue) => {
    setToProvince(newValue);
  };

  const onClickSearch = async () => {
    if (fromProvince == null) {
      customToast.warning("Vui lòng chọn nơi xuất phát");
      return;
    }
    if (toProvince == null) {
      customToast.warning("Vui lòng chọn nơi đến");
      return;
    }
    if (startDate == null) {
      customToast.warning("Vui lòng chọn ngày đi");
      return;
    }

    const fromProvinceName = fromProvince.name;
    const codeProvinceFrom = fromProvince.code;
    const toProvinceName = toProvince.name;
    const codeProvinceTo = toProvince.code;
    const departureTime = moment(startDate).format("DD/MM/YYYY");
    setTimeout(function () {
      navigate(
        `/trip/from/${fromProvinceName}/${codeProvinceFrom}/to/${toProvinceName}/${codeProvinceTo}/${startDate}`
      );
    }, 1000);
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    className: "center",
    slidesToScroll: 1,
    arrows: true,
  };
  const dataTestTrip = [
    {
      id: "1",
      title: "Sài Gòn - Đà Nẵng",
      price: "330.000",
      image: require("../../assets/9860-1661919962-da-nang-du-lich.jpg"),
    },
    {
      id: "2",
      title: "Sài Gòn - Cần Thơ",
      price: "170.000",
      image: require("../../assets/trip2.jpg"),
    },
    {
      id: "3",
      title: "Sài Gòn - Bình Định",
      price: "500.000",
      image: require("../../assets/Binh_Dinh_-_1_copy.jpg"),
    },
    {
      id: "4",
      title: "Sài Gòn - Cà Mau",
      price: "200.000",
      image: require("../../assets/R637096778929414583.png"),
    },
    {
      id: "5",
      title: "Đà Nẵng - Hà Nội",
      price: "350.000",
      image: require("../../assets/trip5.jpg"),
    },
  ];

  
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Helmet>
        <title> CITY BUS - Đặt vé xe nhanh chóng, tiện lợi, đảm bảo có vé</title>
      </Helmet>
      <div
        style={{
          height: "600px",
          width: "100%",
          backgroundImage: `url(${ImageNen})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>
            <h2 style={{ color: "#ffffff", fontSize: 35 }}>
            CITY BUS - Đặt vé xe nhanh chóng, tiện lợi, đảm bảo có vé
            </h2>
          </div>

          <div
            style={{
              width: "65vw",
              height: "150px",
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "20px",
            }}
          >
            <div
              style={{
                width: "60vw",
                height: "100px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                border: "1px dotted black",
                borderBottomStyle: "dotted",
                padding: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 20,
                }}
              >
                <AdjustIcon
                  style={{
                    backgroundColor: "white",
                    fill: "#4671f2",
                    marginTop: 20,
                    marginRight: 5,
                  }}
                ></AdjustIcon>
                <Autocomplete
                  loading={loading}
                  noOptionsText={"Không có dữ liệu"}
                  id="country-select-demo"
                  options={optionsProvince}
                  sx={{ width: 220 }}
                  onChange={handleChangeFromProvince}
                  autoHighlight
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  getOptionLabel={(option) => option?.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Nơi xuất phát"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 15,
                }}
              >
                <AdjustIcon
                  style={{
                    backgroundColor: "white",
                    fill: "#c61334",
                    marginTop: 20,
                    marginRight: 5,
                  }}
                ></AdjustIcon>
                <Autocomplete
                  noOptionsText={"Không có dữ liệu"}
                  id="country-select-demo"
                  options={optionsProvince}
                  sx={{ width: 220 }}
                  onChange={handleChangeToProvince}
                  autoHighlight
                  getOptionLabel={(option) => option?.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Nơi đến"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 15,
                }}
              >
                <CalendarMonthIcon
                  style={{
                    backgroundColor: "white",
                    fill: "#4671f2",
                    marginTop: 20,
                    marginRight: 5,
                  }}
                ></CalendarMonthIcon>
                <DatePicker
                  autoFocus={true}
                  minDate={new Date()}
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown
                  scrollableMonthYearDropdown
                  customInput={<TextField variant="standard" label="Ngày đi" />}
                  locale="vi"
                />
              </div>

              <Button
                variant="contained"
                size="large"
                color="warning"
                onClick={() => onClickSearch()}
              >
                Tìm chuyến
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="content" style={{ width: "75vw" }}>
        <div>
          <h2 className="home_slide_title">Tuyến đường phổ biến</h2>
          <div style={{ padding: 20 }}>
            <Slider {...settings}>
              {dataTestTrip.map((item) => (
                <div className="card-trip">
                  <div className="card-top">
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: "100%" }}
                    />
                    <h1>{item.title}</h1>
                  </div>
                  <div className="card-bottom">
                    <h3>Từ {item.price} VND</h3>
                    <span className="category">{item.category}</span>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className="home_slide_content3">
          <h2 className="home_slide_title">Ưu đãi nổi bật</h2>
          <div className="card-promotion" style={{ padding: 20 }}>
            <Slider {...settings}>
              {dataPromotion.map((item) => (
                <div className="card-trip">
                  <div className="card-top">
                    <img
                      src={item?.image}
                      alt={item?.name}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="card-bottom">
                    <h3>{item?.name}</h3>
                    <span className="category">{item?.description}</span>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        <div className="home_slide_content3">
          <h2 className="home_slide_title">
            Nền tảng kết nối người dùng và nhà xe
          </h2>

          <div className="seo-content">
            <Grid container spacing={2} style={{ marginTop: 10 }}>
              <Grid item xs={3}>
                <div className="card">
                  <div className="icon-container">
                    <DirectionsBusIcon
                      tyle={{
                        backgroundColor: "white",
                        fill: "#2121c6",
                        width: 30,
                        height: 30,
                      }}
                    />
                  </div>
                  <div className="card-content">
                    <p className="base__Headline-sc-1tvbuqk-7 OkeDq color--light-dark">
                      2000+ nhà xe chất lượng cao
                    </p>
                    <p className="base__Body02-sc-1tvbuqk-14 VqdXU color--medium-sub">
                      5000+ tuyến đường trên toàn quốc, chủ động và đa dạng lựa
                      chọn.
                    </p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={3}>
                <div className="card">
                  <div className="icon-container">
                    <LocalActivityIcon
                      style={{
                        backgroundColor: "white",
                        fill: "#d37e23",
                        width: 30,
                        height: 30,
                      }}
                    />
                  </div>
                  <div className="card-content">
                    <p className="base__Headline-sc-1tvbuqk-7 OkeDq color--light-dark">
                      Đặt vé dễ dàng
                    </p>
                    <p className="base__Body02-sc-1tvbuqk-14 VqdXU color--medium-sub">
                      Đặt vé chỉ với 60s. Chọn xe yêu thích cực nhanh và thuận
                      tiện.
                    </p>
                  </div>
                </div>
              </Grid>

              <Grid item xs={3}>
                <div className="card">
                  <div className="icon-container">
                    <ReceiptLongIcon
                      style={{
                        backgroundColor: "white",
                        fill: "#15c421",
                        width: 30,
                        height: 30,
                      }}
                    />
                  </div>
                  <div className="card-content">
                    <p className="base__Headline-sc-1tvbuqk-7 OkeDq color--light-dark">
                      Đảm bảo có vé
                    </p>
                    <p className="base__Body02-sc-1tvbuqk-14 VqdXU color--medium-sub">
                      Hoàn ngay 150% nếu không có vé, mang đến hành trình trọn
                      vẹn cho khách hàng. vẹn.
                    </p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={3}>
                <div className="card">
                  <div className="icon-container">
                    <LoyaltyIcon
                      style={{
                        backgroundColor: "white",
                        fill: "#c61334",
                        width: 30,
                        height: 30,
                      }}
                    />
                  </div>
                  <div className="card-content">
                    <p className="base__Headline-sc-1tvbuqk-7 OkeDq color--light-dark">
                      Nhiều ưu đãi
                    </p>
                    <p className="base__Body02-sc-1tvbuqk-14 VqdXU color--medium-sub">
                      Hàng ngàn ưu đãi cực độc quyền tại CITY BUS.
                    </p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6}></Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
