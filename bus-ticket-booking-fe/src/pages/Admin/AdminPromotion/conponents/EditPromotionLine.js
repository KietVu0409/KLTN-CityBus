import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button, Divider, Drawer, Grid, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import AutocompleteCustom from "../../../../components/AutocompleteCustom";
import "../../../../assets/scss/default.scss";
import FormControlCustom from "../../../../components/FormControl";
import InputField from "../../../../components/InputField";
import customToast from "../../../../components/ToastCustom";
import { GroupTicketApi } from "../../../../utils/groupTicketApi";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";
import { currencyMark, numberFormat } from "../../../../data/curren";
import { PriceListApi } from "../../../../utils/priceListApi";
import { LoadingButton } from "@mui/lab";
import { isEmpty } from "lodash";
import { TripApi } from "../../../../utils/tripApi";
import { VehicleApi } from "../../../../utils/vehicleApi";
import SelectCustom from "../../../../components/SelectCustom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { PromotionApi } from "../../../../utils/promotionApi";
import { disabled } from "glamor";
import AutocompleteMulti from "../../../../components/AutocompleteMuti";

const EditPromotionLine = (props) => {
  const now = new Date();
  const { setShowDrawer, showDrawer, detailPromotionLine, getPromotionLine } =
    props;
  const [dataTrip, setDataTrip] = useState([]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const firstDay = new Date(detailPromotionLine?.startDate);
  const lastDay = new Date(detailPromotionLine?.endDate);
  const [disabledMoney, setDisabledMoney] = useState(true);
  const [disabledPercent, setDisabledPercent] = useState(true);
  const [selectedDate, setSelectedDate] = useState({
    startDate: firstDay,
    endDate: lastDay,
  });

  const optionsType = [
    {
      id: 1,
      name: "Giảm giá phần trăm",
    },
    {
      id: 2,
      name: "Giảm giá tiền trực tiếp",
    },
  ];

  console.log(detailPromotionLine);

  const handleGetData = async () => {
    try {
      const tripApi = new TripApi();
      const response = await tripApi.getList();
      setDataTrip(response?.data?.data);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  const schema = yup.object().shape({
    code: yup
      .string()
      .matches(/^\S*$/, "Mã không chưa khoảng trắng")
      .matches(/^[A-Za-z0-9]*$/, "Không chứa kí tự đặc biệt")
      .required("Mã không được phép bỏ trống"),
    title: yup
      .string()
      .typeError("Vui lòng nhập tiêu đề")
      .required("Vui lòng nhập tiêu đề"),
    couponCode: yup
      .string()
      .typeError("Vui lòng nhập mã giảm giá")
      .required("Vui lòng nhập mã giảm giá"),
    description: yup
      .string()
      .typeError("Vui lòng nhập mô tả")
      .required("Vui lòng nhập mô tả"),
    type: yup
      .object()
      .typeError("Vui lòng chọn loại khuyến mãi")
      .required("Vui lòng chọn loại khuyến mãi"),

    maxBudget: yup
      .string()
      .typeError("Vui lòng nhập ngân sách tối đa")
      .required("Vui lòng nhập ngân sách tối đa"),
    maxQuantity: yup
      .string()
      .typeError("Vui lòng nhập số lượng tối đa")
      .required("Vui lòng nhập số lượng tối đa"),
    tripCodes: yup.array().min(1, "Vui lòng chọn tuyến áp dụng"),

    purchaseAmount: yup
      .string()
      .typeError("Vui lòng nhập số tiền mua")
      .required("Vui lòng nhập số tiền mua"),
    reductionAmount: yup
      .string()
      .typeError("Vui lòng nhập số tiền giảm")
      .required("Vui lòng nhập số tiền giảm"),
    percentDiscount: yup
      .string()
      .typeError("Vui lòng nhập phần trăm giảm")
      .required("Vui lòng nhập phần trăm giảm"),
    maxReductionAmount: yup
      .string()
      .typeError("Vui lòng nhập số tiền giảm tối đa")
      .required("Vui lòng nhập số tiền giảm tối đa"),
  });

  const defaultValues = useMemo(
    () => ({
      code: detailPromotionLine.code || "",
      title: detailPromotionLine.title || "",
      couponCode: detailPromotionLine.couponCode || "",
      description: detailPromotionLine.description || "",
      type:
        detailPromotionLine.type == "Giảm giá phần trăm"
          ? {
              id: 1,
              name: "Giảm giá phần trăm",
            }
          : {
              id: 2,
              name: "Giảm giá tiền trực tiếp",
            },
      maxBudget: detailPromotionLine.maxBudget || "",
      maxQuantity: detailPromotionLine.maxQuantity || "",
      note: detailPromotionLine.note || "",
      tripCodes: detailPromotionLine.applyAll
        ? [{ id: "all", name: "Tất cả các chuyến", code: "ALL_TRIP" }]
        : [
            {
              id: detailPromotionLine?.promotionDetail?.trip?.id,
              code: detailPromotionLine?.promotionDetail?.trip?.code,
              name: detailPromotionLine?.promotionDetail?.trip?.name,
            },
          ],
      purchaseAmount:
        detailPromotionLine?.promotionDetail?.purchaseAmount || "",
      reductionAmount:
        detailPromotionLine?.promotionDetail?.reductionAmount || "",
      percentDiscount:
        detailPromotionLine?.promotionDetail?.percentDiscount || "",
      maxReductionAmount:
        detailPromotionLine?.promotionDetail?.maxReductionAmount || "",
    }),
    [detailPromotionLine]
  );

  const methods = useForm({
    mode: "onSubmit",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, reset, formState, setValue, watch } = methods;
  const { errors } = formState;
  const watchType = watch("type");

  const watchPurchaseAmount = watch("purchaseAmount");
  console.log(watchPurchaseAmount);
  const watchMaxBudget = watch("maxBudget");

  const watchReductionAmount = watch("reductionAmount");
  const watchMaxReductionAmount = watch("maxReductionAmount");

  useEffect(() => {
    if (watchType?.id == 1) {
      setDisabledPercent(false);
      setDisabledMoney(true);
      setValue("reductionAmount", "0");
      setValue(
        "percentDiscount",
        detailPromotionLine?.promotionDetail?.percentDiscount || "0"
      );
    } else if (watchType?.id == 2) {
      setDisabledPercent(true);
      setDisabledMoney(false);
      setValue("percentDiscount", "0");
      setValue(
        "reductionAmount",
        detailPromotionLine?.promotionDetail?.reductionAmount || "0"
      );
    } else {
      setValue("reductionAmount", "0");
      setValue("percentDiscount", "0");
    }
  }, [watchType]);

  //   useEffect(() => {
  //     if (watchMaxBudget !== undefined) {
  //       setValue("maxBudget", currencyMark(watchMaxBudget));
  //     }
  //   }, [watchMaxBudget]);
  //   useEffect(() => {
  //     if (watchPurchaseAmount !== undefined)
  //       setValue("purchaseAmount", currencyMark(watchPurchaseAmount));
  //   }, [watchPurchaseAmount]);
  //   useEffect(() => {
  //     if (watchReductionAmount !== undefined)
  //       setValue("reductionAmount", currencyMark(watchReductionAmount));
  //   }, [watchReductionAmount]);
  //   useEffect(() => {
  //     if (watchMaxReductionAmount !== undefined)
  //       setValue("maxReductionAmount", currencyMark(watchMaxReductionAmount));
  //   }, [watchMaxReductionAmount]);

  useEffect(() => {
    reset({ ...defaultValues });
    setSelectedDate({
      startDate: new Date(detailPromotionLine?.startDate),
      endDate: new Date(detailPromotionLine?.endDate),
    });
  }, [detailPromotionLine]);

  const goBack = () => {
    reset();
    setShowDrawer(false);
  };

  const toggleDrawer = (open) => (event) => {
    setShowDrawer(open);
  };
  const buildOptionSelect = (option, props) => {
    return (
      <div style={{ width: "270px" }} {...props}>
        <Grid container style={{ alignItems: "center" }}>
          <Grid item style={{ marginLeft: "5px" }}>
            <div className={"class-display"}>
              <span style={{ fontSize: "13px", color: "#0C59CC" }}>
                {" "}
                {option?.code}
              </span>
              <span style={{ fontSize: "13px" }}>- {option?.name}</span>
            </div>
          </Grid>
        </Grid>
        <Divider />
      </div>
    );
  };

  const onSubmit = async (value) => {
    console.log("vào");
    console.log(value);
    const params = {
      title: value.title,
      description: value.description,
      note: value?.note,
      tripCodes: value.tripCodes?.map((item) => item.code),
      startDate:
        firstDay <= now
          ? undefined
          : detailPromotionLine?.promotion?.status == "Đang hoạt động" &&
            new Date(detailPromotionLine?.promotion?.startDate) <= now &&
            new Date(detailPromotionLine?.promotion?.endDate) >= now
          ? undefined
          : new Date(selectedDate?.startDate),

      endDate: new Date(selectedDate?.endDate),
      maxQuantity: value.maxQuantity,
      maxBudget: numberFormat(value.maxBudget),
      type: value.type.name,
      productDiscountPercent: {
        purchaseAmount: numberFormat(value.purchaseAmount),
        percentDiscount: value.percentDiscount,
        maxReductionAmount: numberFormat(value.maxReductionAmount),
      },
      productDiscount: {
        purchaseAmount: numberFormat(value.purchaseAmount),
        reductionAmount: numberFormat(value.reductionAmount),
        maxReductionAmount: numberFormat(value.maxReductionAmount),
      },
    };
    console.log(params);

    try {
      const promotionApi = new PromotionApi();
      const response = await promotionApi.updatePromotionLineById(
        detailPromotionLine.id,
        params
      );
      customToast.success("Cập nhật thành công");
      setShowDrawer(false);
      getPromotionLine();
    } catch (error) {
      console.log(error);
      customToast.error(error.response.data.message);
    }
  };

  return (
    <Drawer
      PaperProps={{
        sx: { width: "50%" },
      }}
      anchor={"right"}
      open={showDrawer}
      className="drawer"
      onClose={toggleDrawer(false)}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="title-drawer">
            <div className="btn-close" onClick={goBack}>
              <ArrowBackIosIcon className="icon-back" />
            </div>
            <div>
              <span>Thông tin khuyến mãi</span>
            </div>
          </div>
          <div className="content-drawer">
            <div className="title-group">
              <span>Thông tin áp dụng</span>
            </div>
            <div className="content">
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <FormControlCustom label={"Mã"} fullWidth isMarked>
                    <InputField
                      disabled
                      name={"code"}
                      placeholder={"Nhập mã"}
                      error={Boolean(errors.code)}
                      helperText={errors?.code?.message}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6} className="auto-complete">
                  <FormControlCustom label={"Tiêu đề"} fullWidth isMarked>
                    <InputField
                      name={"title"}
                      placeholder={"Nhập tiêu đề"}
                      error={Boolean(errors.title)}
                      helperText={errors?.title?.message}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label={"Mã giảm giá"} fullWidth>
                    <InputField
                      disabled
                      name={"couponCode"}
                      helperText={errors?.couponCode?.message}
                      error={Boolean(errors.couponCode)}
                    />
                  </FormControlCustom>
                </Grid>

                <Grid item xs={6}>
                  <FormControlCustom label={"Diễn giải"} fullWidth>
                    <InputField
                      name={"description"}
                      helperText={errors?.description?.message}
                      error={Boolean(errors.description)}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label="Ngày bắt đầu" fullWidth isMarked>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        disabled={
                          firstDay <= now
                            ? true
                            : new Date(
                                detailPromotionLine?.promotion?.startDate
                              ) <= now &&
                              new Date(
                                detailPromotionLine?.promotion?.endDate
                              ) >= now
                            ? true
                            : false
                        }
                        value={dayjs(selectedDate?.startDate)}
                        onChange={(e) => {
                          setSelectedDate({
                            ...selectedDate,
                            startDate: new Date(e),
                          });
                        }}
                        className={"date-picker"}
                        format="DD/MM/YYYY"
                        renderInput={(params) => (
                          <InputField
                            name={"startDate"}
                            helperText={errors?.name?.message}
                            error={Boolean(errors.name)}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label="Ngày kết thúc" fullWidth isMarked>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={dayjs(selectedDate?.endDate)}
                        onChange={(e) => {
                          setSelectedDate({
                            ...selectedDate,
                            endDate: new Date(e),
                          });
                        }}
                        className={"date-picker"}
                        renderInput={(params) => <TextField {...params} />}
                        format="DD/MM/YYYY"
                      />
                    </LocalizationProvider>
                  </FormControlCustom>
                </Grid>

                <Grid item xs={6}>
                  <FormControlCustom
                    label={"Loại khuyến mãi"}
                    fullWidth
                    isMarked
                  >
                    <SelectCustom
                      disabled
                      name={"type"}
                      placeholder={"Chọn loại khuyến mãi"}
                      error={Boolean(errors?.type)}
                      helperText={errors?.type?.message}
                      options={optionsType}
                    />
                  </FormControlCustom>
                </Grid>

                <Grid item xs={6}>
                  <FormControlCustom
                    label={"Ngân sách tối đa áp dụng"}
                    fullWidth
                    isMarked
                  >
                    <InputField
                      disabled={firstDay <= now ? true : false}
                      name={"maxBudget"}
                      helperText={errors?.maxBudget?.message}
                      error={Boolean(errors.maxBudget)}
                      placeholder="0"
                    />
                  </FormControlCustom>
                </Grid>

                <Grid item xs={6}>
                  <FormControlCustom
                    label={"Số lượng tối đa áp dụng"}
                    fullWidth
                    isMarked
                  >
                    <InputField
                      disabled={firstDay <= now ? true : false}
                      name={"maxQuantity"}
                      helperText={errors?.maxQuantity?.message}
                      placeholder="0"
                      error={Boolean(errors.maxQuantity)}
                    />
                  </FormControlCustom>
                </Grid>

                <Grid item xs={12}>
                  <FormControlCustom label={"Ghi chú"} fullWidth>
                    <InputField
                      className="input-note"
                      name={"note"}
                      helperText={""}
                      rows={3}
                      multiline
                    />
                  </FormControlCustom>
                </Grid>
              </Grid>
            </div>
            <div className="title-group">
              <span>Thông tin khuyến mãi</span>
            </div>
            <div className="content">
              <Grid container spacing={1.5}>
                <Grid item xs={6} className="auto-complete">
                  <FormControlCustom
                    label={"Mã tuyến áp dụng"}
                    fullWidth
                    isMarked
                  >
                    <AutocompleteMulti
                      disabled
                      multiple={true}
                      name={"tripCodes"}
                      placeholder={"Chọn mã tuyến xe áp dụng"}
                      error={Boolean(errors?.tripCodes)}
                      helperText={errors?.tripCodes?.message}
                      listOption={dataTrip || []}
                    />
                  </FormControlCustom>
                </Grid>

                <Grid item xs={6}>
                  <FormControlCustom
                    label={"Mứa tiền hóa đơn"}
                    fullWidth
                    isMarked
                  >
                    <InputField
                      disabled
                      name={"purchaseAmount"}
                      placeholder="0"
                      error={Boolean(errors.purchaseAmount)}
                      helperText={errors?.purchaseAmount?.message}
                    />
                  </FormControlCustom>
                </Grid>
                {disabledPercent && (
                  <Grid item xs={6}>
                    <FormControlCustom
                      label={"Số tiền giảm"}
                      fullWidth
                      isMarked
                    >
                      <InputField
                        disabled
                        placeholder={"0"}
                        name={"reductionAmount"}
                        error={Boolean(errors.reductionAmount)}
                        helperText={errors?.reductionAmount?.message}
                      />
                    </FormControlCustom>
                  </Grid>
                )}
                {disabledMoney && (
                  <Grid item xs={6}>
                    <FormControlCustom
                      label={"Phần trăm giảm"}
                      fullWidth
                      isMarked
                    >
                      <InputField
                        disabled
                        type={"number"}
                        placeholder={"0"}
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          min: 0,
                          max: 100,
                        }}
                        name={"percentDiscount"}
                        error={Boolean(errors.percentDiscount)}
                        helperText={errors?.percentDiscount?.message}
                        onKeyDown={(evt) =>
                          ["e", "E", "+", "-"].includes(evt.key) &&
                          evt.preventDefault()
                        }
                      />
                    </FormControlCustom>
                  </Grid>
                )}

                <Grid item xs={6}>
                  <FormControlCustom
                    label={"Số tiền giảm tối đa"}
                    fullWidth
                    isMarked
                  >
                    <InputField
                      disabled
                      name={"maxReductionAmount"}
                      placeholder="0"
                      error={Boolean(errors.maxReductionAmount)}
                      helperText={errors?.maxReductionAmount?.message}
                    />
                  </FormControlCustom>
                </Grid>
              </Grid>
            </div>
          </div>

          <div className="footer-drawer" style={{ marginTop: 50 }}>
            <Grid
              container
              spacing={3}
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item xs={6} display="flex" justifyContent="end">
                <Button
                  className="btn-secondary-disable"
                  onClick={goBack}
                  variant="outlined"
                  style={{ width: "80%" }}
                >
                  Quay lại
                </Button>
              </Grid>
              <Grid item xs={6} display="flex" justifyContent="end">
                <LoadingButton
                  className={
                    !isEmpty(errors)
                      ? "btn-primary-disable"
                      : "btn-tertiary-normal"
                  }
                  type="submit"
                  color="primary"
                  variant="contained"
                  style={{ width: "80%", marginRight: 50 }}
                >
                  {"Cập nhật"}
                </LoadingButton>
              </Grid>
            </Grid>
          </div>
        </form>
      </FormProvider>
    </Drawer>
  );
};

export default EditPromotionLine;
