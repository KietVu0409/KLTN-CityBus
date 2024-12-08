import { Button, Divider, Grid } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { isEmpty } from "lodash";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import "../../../assets/scss/default.scss";
import AutocompleteCustom from "../../../components/AutocompleteCustom";
import AutocompletePromotion from "../../../components/AutocompletePromotion";
import FormControlCustom from "../../../components/FormControl";
import InputField from "../../../components/InputField";
import customToast from "../../../components/ToastCustom";
import useDebounce from "../../../components/debounce";
import {
  convertCurrency,
  currencyMark,
  numberFormat,
} from "../../../data/curren";
import { OrderApi } from "../../../utils/orderApi";
import { PriceListApi } from "../../../utils/priceListApi";
import { PromotionApi } from "../../../utils/promotionApi";
import { TicketApi } from "../../../utils/ticketApi";
import { TripApi } from "../../../utils/tripApi";
import AddCustomerOrder from "./AddCustomerOrder";
import "./AdminTicket.scss";
import ListTicketDetail from "./ListTicketDetail";
import TicketBookingList from "./TicketBookingList";


const AdminAddTicket = (props) => {
  const [dataCustomer, setData] = useState();
  const dateNow = moment(new Date()).format("DD-MM-YYYY hh:mm");
  const [orderCustomerList, setOrderCustomerList] = useState([]);
  const [filterParams, setFilterParams] = useState(null);
  const [customerList, setCustomerList] = useState([]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [searchValue, setSearchValue] = useState();
  const debouncedSearch = useDebounce(searchValue, 500);
  const navigate = useNavigate();
  const codeTrip = useParams();
  const [dataTripDetail, setDataTripDetail] = useState();
  const [dataTicket, setDataTicket] = useState([]);
  const [showAddTicket, setShowAddTicket] = useState(false);
  const [idsSelected, setIdsSelected] = useState([]); //
  const [itemTickets, setItemTickets] = useState([]);
  const [price, setPrice] = useState();
  const [optionPromotion, setOptionPromotion] = useState([]);
  const [promotionCodes, setPromotionCodes] = useState([]);
  const [dataPromotionResults, setDataPromotionResults] = useState([]);
  const [dataPromotion, setDataPromotion] = useState([]);

  const filterItem = async () => {
    const newArray = dataTicket.filter((item) =>
      idsSelected.includes(item?.id)
    );
    const priceApi = new PriceListApi();
    const updatedData = await Promise.all(
      newArray.map(async (item) => {
        const response1 = await priceApi.getPrice({
          applyDate: new Date(),
          tripDetailCode: dataTripDetail?.code,
          seatType: dataTripDetail?.vehicle?.type,
        });

        item.price = response1?.data?.data?.price;
        item.startDate = dataTripDetail?.departureTime;
        item.vehicleName = dataTripDetail?.vehicle?.name;
        item.vehicleLicensePlate = dataTripDetail?.vehicle?.licensePlate;

        return item;
      })
    );
    setItemTickets(updatedData);
  };

  useEffect(() => {
    filterItem();
  }, [idsSelected]);

  const handlePromotion = async () => {
    try {
      const promotionApi = new PromotionApi();
      const res = await promotionApi.getPromotionAvailable({
        tripCode: dataTripDetail?.trip?.code,
      });
      setDataPromotion(res?.data?.data);
    } catch (error) {}
  };

  const handelDataTripDetail = async () => {
    try {
      const tripApi = new TripApi();
      const res = await tripApi.getTripDetailByCode(codeTrip?.code);
      setDataTripDetail(res?.data?.data);
    } catch (error) {}
  };

  const handleDataTicket = async () => {
    try {
      const ticketApi = new TicketApi();
      const res = await ticketApi.findAllTicket({
        sort: "ASC",
        tripDetailCode: codeTrip?.code,
        isAll: true,
      });
      res?.data?.data.map((item, index) => {
        item.price = price;
      });
      setDataTicket(res?.data?.data);
    } catch (error) {}
  };

  useEffect(() => {
    handelDataTripDetail();
    handleDataTicket();
    handlePromotion();
  }, [codeTrip]);

  useEffect(() => {
    handlePromotion();
  }, [dataTripDetail]);

  const handelCustomerList = async () => {
    try {
      const orderApi = new OrderApi();
      const res = await orderApi.searchCustomer({ ...filterParams });
      setOrderCustomerList(res?.data);
    } catch (error) {}
  };
  useEffect(() => {
    handelCustomerList();
  }, [filterParams]);

  useEffect(() => {
    setFilterParams({ ...filterParams, key: debouncedSearch?.data });
  }, [debouncedSearch?.data]);

  useEffect(() => {
    if (!isEmpty(orderCustomerList?.data)) {
      let customer = [...orderCustomerList?.data];
      customer?.unshift({ id: 0, name: "", phone: "" });
      setCustomerList(customer);
    } else {
      let customer = [];
      customer?.unshift({ id: 0, name: "", phone: "" });
      setCustomerList(customer);
    }
  }, [orderCustomerList]);
  const onChangeCustomer = (data) => {
    setSearchValue({
      data,
    });
  };

  const customerForm = (dataCus) => {
    setData(dataCus);
    setDisabled(false);
  };

  const defaultValues = useMemo(
    () => ({
      email: dataCustomer?.email || "",
      address: dataCustomer?.fullAddress || "",
      phone: dataCustomer?.phone || "",
      customer: dataCustomer || "",
      createAt: dateNow,
      note: "",
    }),
    [dataCustomer]
  );
  const schema = yup.object().shape({
    customer: yup
      .object()
      .typeError("Vui lòng chọn khách hàng")
      .required("Vui lòng chọn khách hàng"),
  });
  const methods = useForm({
    mode: "onSubmit",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { formState, watch, setValue, handleSubmit, reset, getValues } =
    methods;
  const { errors } = formState;

  const customerWatch = watch("customer");
  const promotionWatch = watch("promotionCodes");
  const totalWatch = watch("total");
  const reduceAmountWatch = watch("reduceAmount");

  useEffect(() => {
    setValue(
      "finalTotal",
      convertCurrency(
        numberFormat(currencyMark(totalWatch)) -
          numberFormat(currencyMark(reduceAmountWatch))
      )
    );
  }, [totalWatch, reduceAmountWatch]);

  useEffect(() => {
    if (promotionWatch?.length > 0) {
      setPromotionCodes(promotionWatch?.map((item) => item?.code));
    } else {
      setPromotionCodes([]);
    }
  }, [promotionWatch]);

  const handlePromotionResult = async () => {
    try {
      console.log("dataPromotion", dataPromotion);
      let total = 0;
      if (itemTickets.length > 0) {
        itemTickets.forEach((ticket) => (total += ticket.price));
      }
      const promotionApi = new PromotionApi();
      const res = await promotionApi.calculatePromotionLine({
        total: total,
        numOfTicket: itemTickets?.length || 0,
        promotionLineCodes: dataPromotion.map((item) => item.code),
      });
      setDataPromotionResults(res?.data?.data);
    } catch (error) {
      setDataPromotionResults([]);
    }
  };

  useEffect(() => {
    let data = [];
    if (dataPromotionResults.length > 0) {
      for (let i = 0; i < dataPromotionResults.length; i++) {
        if (dataPromotionResults[i].amount != 0) {
          for (let j = 0; j < dataPromotion.length; j++) {
            if (
              dataPromotionResults[i].promotionLineCode == dataPromotion[j].code
            ) {
              data.push(dataPromotion[j]);
            }
          }
        }
      }
    }
    setOptionPromotion(data);
    setValue("promotionCodes", data);
    setValue("promotion", data.map((item) => item.title).join(","))
  }, [dataPromotionResults]);
  console.log(promotionWatch);

  useEffect(() => {
    let total = 0;
    for (let i = 0; i < dataPromotionResults.length; i++) {
      if (promotionWatch?.length > 0) {
        for (let j = 0; j < promotionWatch.length; j++) {
          if (
            dataPromotionResults[i].promotionLineCode == promotionWatch[j]?.code
          ) {
            total -= dataPromotionResults[i]?.amount;
          }
        }
      }
    }

    setValue("reduceAmount", convertCurrency(total));
  }, [itemTickets, promotionWatch]);

  useEffect(() => {
    handlePromotionResult();
  }, [itemTickets]);

  useEffect(() => {
    reset({ ...defaultValues });
  }, [dataCustomer]);

  useEffect(() => {
    setValue("email", customerWatch?.email);
    setValue("address", customerWatch?.fullAddress);
    setValue("phone", customerWatch?.phone);

    if (!isEmpty(customerWatch)) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [customerWatch]);

  useEffect(() => {
    let total = 0;

    if (itemTickets.length > 0) {
      itemTickets.forEach((ticket) => (total += ticket.price));
    }
    setValue("total", convertCurrency(total));
  }, [itemTickets]);

  const onSubmit = async (value) => {
    if (itemTickets.length != 0) {
      const params = {
        customerId: customerWatch?.id || dataCustomer?.id,
        seatCodes: itemTickets.map((item) => item?.seat?.code),
        tripDetailCode: dataTripDetail?.code,
        promotionLineCodes:
          promotionCodes.length > 0 ? promotionCodes : undefined,
        note: value?.note,
      };

      try {
        const orderApi = new OrderApi();
        const res = await orderApi.createOrder(params);
        customToast.success("Xác nhận đặt vé thành công");
        navigate(`/admin/ticket-list/detail/${res.data.data.id}`);
      } catch (error) {
        customToast.error(error.response.data.message);
      }
    } else {
      customToast.warning("Bạn chưa chọn vé nào");
    }
  };

  const a = useCallback(
    (option, props, state) => {
      const checkBackground = () => {
        if (state?.index % 2 !== 0) {
          return { background: "#f5f7fa" };
        } else {
          return { background: "white" };
        }
      };
      return (
        <>
          {option.id === 0 && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                className="btn-tertiary-disable"
                style={{ width: "100%" }}
                onClick={() => setShowAddCustomer(true)}
              >
                <AddOutlinedIcon style={{ fontSize: "16px" }} />
                <span>Thêm khách hàng </span>
              </Button>
            </div>
          )}
          {option.id === 0 ? (
            <></>
          ) : (
            <div
              style={
                option.id === 0
                  ? {}
                  : {
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      backgroundColor: checkBackground().background,
                    }
              }
            >
              <div
                style={{
                  padding: "3px",
                  display: "flex",
                  justifyContent: "center",
                }}
                {...props}
              >
                <div
                  style={{
                    width: "200px",
                    display: "flex",
                    justifyContent: "left",
                  }}
                >
                  <span> {option.fullName}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <span>{option.phone}</span>
                </div>
              </div>
            </div>
          )}
        </>
      );
    },
    [undefined]
  );

  const buildOptionSelect = (option, props) => {
    const checkBackground = () => {
      if (option?.id % 2 == 0) {
        return { background: "#f5f7fa" };
      } else {
        return { background: "white" };
      }
    };
    return (
      <>
        {option.id === 0 && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              className="btn-tertiary-disable"
              style={{ width: "100%" }}
              onClick={() => setShowAddCustomer(true)}
            >
              <AddOutlinedIcon style={{ fontSize: "16px" }} />
              <span>Thêm khách hàng </span>
            </Button>
          </div>
        )}
        {option.id === 0 ? (
          <></>
        ) : (
          <div
            style={
              option.id === 0
                ? {}
                : {
                    paddingTop: "3px",
                    paddingBottom: "3px",
                    backgroundColor: checkBackground().background,
                  }
            }
          >
            <div
              style={{
                padding: "3px",
                display: "flex",
                justifyContent: "space-around",
              }}
              {...props}
            >
              <span> {option.fullName}</span>
              <span>{option.phone}</span>
            </div>
          </div>
        )}

        {/* <Divider /> */}
      </>
    );
  };
  return (
    <div className={"page-layout-blank"} style={{ width: "100%" }}>
      <Helmet>
        <title> CITY BUS - Đặt vé cho khách hàng</title>
      </Helmet>
      <Grid container spacing={1}>
        <Grid md={12}>
          <div className={"page-layout"}>
            <Grid className={"align-items-center header_title"}>
              <Grid md={12}>
                <h2 className={"txt-title"}>
                  THÔNG TIN ĐẶT VÉ TUYẾN #
                  <span>
                    <span style={{ color: "blue", marginRight: 10 }}>
                      {codeTrip?.code}
                    </span>
                    ({dataTripDetail?.trip?.fromStation?.name} -{" "}
                    {dataTripDetail?.trip?.toStation?.name},
                    {moment(dataTripDetail?.departureTime).format("DD/MM/YYYY")}
                    )
                  </span>
                </h2>
              </Grid>
            </Grid>
            <Divider />
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="content mt-2">
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControlCustom
                        label={"Khách hàng*"}
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        fullWidth
                      >
                        <AutocompleteCustom
                          style={{ width: "100%" }}
                          name={"customer"}
                          placeholder={"Chọn khách hàng"}
                          error={Boolean(errors?.customer)}
                          options={customerList || []}
                          renderOption={a}
                          onChangeValue={onChangeCustomer}
                          optionLabelKey={"fullName"}
                        />
                      </FormControlCustom>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Tổng tiền vé"}
                        fullWidth
                      >
                        <InputField
                          disabled
                          style={{ width: "100%" }}
                          className={"disabled-field"}
                          name={"total"}
                          helperText={""}
                          placeholder={""}
                        />
                      </FormControlCustom>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControlCustom
                        label={"Địa chỉ"}
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        fullWidth
                      >
                        <InputField
                          disabled
                          className={"disabled-field"}
                          style={{ width: "100%" }}
                          name={"address"}
                          placeholder={""}
                        />
                      </FormControlCustom>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Khuyến mãi"}
                        fullWidth
                      >
                        <InputField
                          disabled
                          className={"disabled-field"}
                          style={{ width: "100%" }}
                          name={"promotion"}
                          placeholder={""}
                        />
                      </FormControlCustom>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Điện thoại"}
                        fullWidth
                      >
                        <InputField
                          disabled
                          className={"disabled-field"}
                          style={{ width: "100%" }}
                          name={"phone"}
                          helperText={""}
                          placeholder={""}
                        />
                      </FormControlCustom>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Số tiền giảm"}
                        fullWidth
                      >
                        <InputField
                          disabled
                          className={"disabled-field"}
                          style={{ width: "100%" }}
                          name={"reduceAmount"}
                          helperText={""}
                          placeholder={""}
                        />
                      </FormControlCustom>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Email"}
                        fullWidth
                      >
                        <InputField
                          className={"disabled-field"}
                          disabled
                          style={{ width: "100%" }}
                          name={"email"}
                          helperText={""}
                          placeholder={""}
                        />
                      </FormControlCustom>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Thành tiền"}
                        fullWidth
                      >
                        <InputField
                          disabled
                          className={"disabled-field"}
                          style={{ width: "100%" }}
                          name={"finalTotal"}
                          helperText={""}
                          placeholder={""}
                        />
                      </FormControlCustom>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Ngày tạo"}
                        fullWidth
                      >
                        <InputField
                          disabled
                          className={"disabled-field"}
                          style={{ width: "100%" }}
                          name={"createAt"}
                          helperText={""}
                          placeholder={""}
                        />
                      </FormControlCustom>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlCustom
                        classNameLabel={
                          "flex justify-content-center align-items-center mr-1 w-100 justify-content-start order-custom-title"
                        }
                        className={"flex-direction-row"}
                        label={"Ghi chú"}
                        fullWidth
                      >
                        <InputField
                          style={{ width: "100%" }}
                          multiline
                          rows={2}
                          name={"note"}
                          placeholder={"Nhập ghi chú"}
                          helperText={""}
                        />
                      </FormControlCustom>
                    </Grid>
                  </Grid>
                </div>
                <div className={"page-layout"} style={{ marginTop: 50 }}>
                  <Grid className={"align-items-center header_title"}>
                    <Grid
                      md={7}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <h2 className={"txt-title"}>DANH SÁCH VÉ</h2>
                    </Grid>
                    <div
                      className="item-btn-right"
                      style={{ float: "right", marginBottom: 20 }}
                    >
                      <Button
                        className={"btn-create"}
                        variant="outlined"
                        size="medium"
                        style={{ height: "2rem" }}
                        onClick={() => setShowAddTicket(true)}
                      >
                        <span className={"txt"}>Thêm vé</span>
                      </Button>
                    </div>
                  </Grid>
                  <TicketBookingList data={itemTickets} />
                  <Grid
                    container
                    spacing={2}
                    className={`mt-1`}
                    justifyContent="space-between"
                  >
                    <Grid item xs={7}></Grid>
                    <Grid item xs={5}>
                      <div
                        className="item-btn-right"
                        style={{ float: "right", marginBottom: 20 }}
                      >
                        <Button
                          variant="contained"
                          size="medium"
                          className={`btn-tertiary-normal`}
                          style={{ height: "2rem" }}
                          type="submit"
                        >
                          Xác nhận
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </form>
            </FormProvider>
          </div>
        </Grid>
      </Grid>
      <AddCustomerOrder
        setShowDrawer={setShowAddCustomer}
        showDrawer={showAddCustomer}
        customerCreateForm={customerForm}
      />
      <ListTicketDetail
        setShowDrawer={setShowAddTicket}
        showDrawer={showAddTicket}
        dataTicket={dataTicket}
        dataTripDetail={dataTripDetail}
        setIdsSelected={setIdsSelected}
      ></ListTicketDetail>
      <div></div>
    </div>
  );
};

export default AdminAddTicket;
