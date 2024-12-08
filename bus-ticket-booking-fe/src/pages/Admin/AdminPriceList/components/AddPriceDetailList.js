import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button, Divider, Drawer, Grid } from "@mui/material";
import { useEffect, useState } from "react";
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

const CreatePriceListDetail = (props) => {
  const date = new Date();
  const { setShowDrawer, showDrawer, idPriceList, getPriceListDetails } = props;
  const [dataTrip, setDataTrip] = useState([]);
  const [type, setType] = useState("");
  const handelGetType = async () => {
    try {
      const vehicleApi = new VehicleApi();
      const response = await vehicleApi.getType();
      const typeTmp = [];
      response?.data?.data.map((item) => {
        typeTmp.push({
          code: item.key,
          name: item.value,
        });
      });
      setType(typeTmp);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  const handleGetData = async () => {
    try {
      const tripApi = new TripApi();
      const response = await tripApi.getList();
      setDataTrip(response);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    handleGetData();
    handelGetType();
  }, []);

  const schema = yup.object().shape({
    code: yup
      .string()
      .matches(/^\S*$/, "Mã không chưa khoảng trắng")
      .matches(/^[A-Za-z0-9]*$/, "Không chứa kí tự đặc biệt")
      .required("Mã không được phép bỏ trống"),
    type: yup
      .object()
      .typeError("Loại xe không được phép bỏ trống")
      .required("Loại xe không được phép bỏ trống"),
    codeTrip: yup
      .object()
      .typeError("Vui lòng chọn mã nhóm vé")
      .required("Vui lòng chọn mã nhóm vé"),
    price: yup
      .string()
      .typeError("Vui lòng nhập giá")
      .required("Vui lòng nhập giá"),
  });

  const defaultValues = {
    code: "",
    price: "",
    createdAt: moment(new Date()).format("DD/MM/YYYY"),
  };

  const methods = useForm({
    mode: "onSubmit",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, reset, formState, setValue, watch } = methods;
  const { errors } = formState;
  const watchPrice = watch("price");
  const watchCodeTrip = watch("codeTrip");

  useEffect(() => {
    setValue("price", currencyMark(watchPrice));
  }, [watchPrice]);

  useEffect(() => {
    const codeTrip = watchCodeTrip;

    setValue("nameTrip", codeTrip?.name);
  }, [watchCodeTrip]);

  useEffect(() => {
    reset();
  }, [showDrawer]);

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
    const params = {
      code: value.code,
      tripCode: value.codeTrip.code,
      price: numberFormat(value?.price),
      note: value?.note,
      priceListId: idPriceList,
      seatType: value?.type.name,
    };

    try {
      const priceListApi = new PriceListApi();
      const response = await priceListApi.createPriceListDetail(params);
      customToast.success("Thêm thành công");
      setShowDrawer(false);
      getPriceListDetails();
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  return (
    <Drawer
      PaperProps={{
        sx: { width: "40%" },
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
              <span>Thêm áp dụng</span>
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
                      name={"code"}
                      placeholder={"Nhập mã"}
                      error={Boolean(errors.code)}
                      helperText={errors?.code?.message}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6} className="auto-complete">
                  <FormControlCustom
                    label={"Mã tuyến áp dụng"}
                    fullWidth
                    isMarked
                  >
                    <AutocompleteCustom
                      name={"codeTrip"}
                      placeholder={"Chọn mã tuyến xe"}
                      error={Boolean(errors?.codeTrip)}
                      helperText={errors?.codeTrip?.message}
                      options={dataTrip?.data?.data || []}
                      optionLabelKey={"code"}
                      renderOption={buildOptionSelect}
                    />
                  </FormControlCustom>
                </Grid>

                <Grid item xs={6}>
                  <FormControlCustom label={"Tên tuyến xe"} fullWidth>
                    <InputField
                      name={"nameTrip"}
                      helperText={errors?.name?.message}
                      error={Boolean(errors.name)}
                      disabled={true}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label={"Loại xe"} fullWidth isMarked>
                    <SelectCustom
                      name={"type"}
                      placeholder={"Chọn loại xe"}
                      error={Boolean(errors?.type)}
                      helperText={errors?.type?.message}
                      options={type}
                    />
                  </FormControlCustom>
                </Grid>

                <Grid item xs={6}>
                  <FormControlCustom label={"Đơn giá"} fullWidth isMarked>
                    <InputField
                      name={"price"}
                      helperText={errors?.price?.message}
                      placeholder="0"
                      error={Boolean(errors.price)}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label={"Ngày tạo"} fullWidth>
                    <InputField
                      name={"createdAt"}
                      helperText={errors?.createdAt?.message}
                      error={Boolean(errors.createdAt)}
                      disabled={true}
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
                  {"Thêm mới "}
                </LoadingButton>
              </Grid>
            </Grid>
          </div>
        </form>
      </FormProvider>
    </Drawer>
  );
};

export default CreatePriceListDetail;
