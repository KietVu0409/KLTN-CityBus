import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button, Divider, Drawer, Grid } from "@mui/material";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { FormProvider, useForm } from "react-hook-form";

import * as yup from "yup";

import { useEffect, useMemo, useState } from "react";
import InputField from "../../../../components/InputField";
import FormControlCustom from "../../../../components/FormControl";
import "../../../../assets/scss/default.scss";
import { LoadingButton } from "@mui/lab";
import customToast from "../../../../components/ToastCustom";
import { GroupCusApi } from "../../../../utils/groupCusApi";
import { DistrictApi } from "../../../../utils/districtApi";
import { WardApi } from "../../../../utils/wardApi";
import { ProvinceApi } from "../../../../utils/provinceApi";
import SelectCustom from "../../../../components/SelectCustom";
import { CustomerApi } from "../../../../utils/customerApi";
import { StaffApi } from "../../../../utils/staffApi";

const EditStaff = (props) => {
  const {
    setShowDrawer,
    showDrawer,
    dataCustomer,
    setShowDrawerDetail,
    handleGetData,
  } = props;
  const [optionsProvince, setOptionsProvince] = useState([]);
  const [optionsDistrict, setOptionsDistrict] = useState([]);
  const [optionsWard, setOptionsWard] = useState([]);

  const [optionCustomerGroup, setOptionCustomerGroup] = useState([]);
  const optionStatus = [
    {
      code: 1,
      name: "Kích hoạt",
    },
    {
      code: 0,
      name: "Chưa kích hoạt",
    },
  ];

  const getDataProvince = async () => {
    try {
      const provinceApi = new ProvinceApi();
      const res = await provinceApi.getAllProvince();

      const options = [];
      res.data.data.map((item) =>
        options.push({ name: item.name, code: item.code })
      );

      setOptionsProvince(options);
    } catch (error) {}
  };

  const getDataDistrict = async (provinceCode) => {
    try {
      const districtApi = new DistrictApi();
      const res = await districtApi.getDistrictByProvinceId(provinceCode);
      const options = [];
      res.data.data.map((item) =>
        options.push({ name: item.name, code: item.code })
      );
      setOptionsDistrict(options);
    } catch (error) {}
  };

  const getDataWard = async (districtCode) => {
    try {
      const wardApi = new WardApi();
      const res = await wardApi.getWardByDistrictId(districtCode);
      const options = [];
      res.data.data.map((item) =>
        options.push({ name: item.name, code: item.code })
      );
      setOptionsWard(options);
    } catch (error) {}
  };
  useEffect(() => {
    getDataProvince();
  }, []);

  const optionGender = [
    {
      code: "M",
      name: "Nam",
    },
    {
      code: "F",
      name: "Nữ",
    },
    {
      code: "O",
      name: "Khác",
    },
  ];

  const schema = yup.object().shape({
    fullName: yup
      .string()
      .typeError("Tên không được phép bỏ trống")
      .required("Tên không được phép bỏ trống"),
    phone: yup
      .string()
      .typeError("Số điện thoại không được phép bỏ trống")
      .required("Số điện thoại không được phép bỏ trống"),
    gender: yup
      .object()
      .typeError("Giới tính không được phép bỏ trống")
      .required("Giới tính hàng không được phép bỏ trống"),
    status: yup
      .object()
      .typeError("Trạng thái không được phép bỏ trống")
      .required("Trạng thái hàng không được phép bỏ trống"),
    wardId: yup
      .object()
      .typeError("Phường/thị xã không được bỏ trống")
      .required("Phường/thị xã không được bỏ trống"),
    provinceId: yup
      .object()
      .typeError("Tỉnh/thành phố không được bỏ trống")
      .required("Tỉnh/thành phố không được phép bỏ trống"),
    districtId: yup
      .object()
      .typeError("Quận/huyện không được bỏ trống")
      .required("Quận/huyện không được phép bỏ trống"),
  });

  const defaultValues = useMemo(
    () => ({
      code: dataCustomer?.code,
      fullName: dataCustomer?.fullName,
      phone: dataCustomer?.phone,
      email: dataCustomer?.email,
      address: dataCustomer?.address,
      note: dataCustomer?.note,
      gender: {
        code: dataCustomer?.gender,
        name:
          dataCustomer?.gender == "M"
            ? "Nam"
            : dataCustomer?.gender == "F"
            ? "Nữ"
            : "Khác",
      },
      status: {
        code: dataCustomer?.isActive == true ? 1 : 0,
        name: dataCustomer?.isActive == true ? "Kích hoạt" : "Chưa kích hoạt",
      },
      provinceId:
        {
          code: dataCustomer?.ward?.district?.province?.code,
          name: dataCustomer?.ward?.district?.province?.name,
        } || "",
      districtId:
        {
          code: dataCustomer?.ward?.district?.code,
          name: dataCustomer?.ward?.district?.name,
        } || "",
      wardId:
        {
          code: dataCustomer?.ward?.code,
          name: dataCustomer?.ward?.name,
        } || "",
    }),
    [dataCustomer]
  );
  const methods = useForm({
    mode: "onSubmit",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, reset, formState, setValue, watch } = methods;
  const { errors } = formState;

  const provinceWatch = watch("provinceId");
  const districtWatch = watch("districtId");

  useEffect(() => {
    const province = provinceWatch;
    if (!province) setOptionsDistrict([]);
    else {
      getDataDistrict(province.code);
    }
  }, [provinceWatch]);

  useEffect(() => {
    const district = districtWatch;
    if (!district) setOptionsWard([]);
    else {
      getDataWard(district.code);
    }
  }, [districtWatch]);
  useEffect(() => {
    reset({ ...defaultValues });
    getDataProvince();
  }, [dataCustomer]);

  const goBack = () => {
    setShowDrawer(false);
    reset();
  };

  const toggleDrawer = (open) => (event) => {
    setShowDrawer(open);
  };
  useEffect(() => {
    reset();
  }, [showDrawer]);

  const onSubmit = async (value) => {
    const params = {
      fullName: value?.fullName,
      wardCode: value?.wardId.code,
      address: value?.address,
      gender: value?.gender.code,
      note: value?.note,
      isActive: value?.status?.code == 1 ? "Kích hoạt" : "Tạm ngưng",
    };
    try {
      const staffApi = new StaffApi();
      const res = await staffApi.editByCode(dataCustomer.code, params);
      customToast.success("Cập nhật thành công");
      setShowDrawer(false);
      setShowDrawerDetail(false);
      handleGetData();
      reset();
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  return (
    <Drawer
      PaperProps={{
        sx: { width: "45%", minWidth: "39rem" },
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
              <span>Cập nhật thông tin</span>
            </div>
          </div>
          <div className="content-drawer">
            <div className="title-group">
              <span>Thông tin nhân viên</span>
            </div>
            <div className="content">
              <Grid container spacing={1.5}>
                <Grid item xs={6} className="auto-complete">
                  <FormControlCustom label={"Mã nhân viên"} fullWidth isMarked>
                    <InputField
                      disabled
                      name={"code"}
                      placeholder={"Nhập mã nhân viên"}
                      error={Boolean(errors.code)}
                      helperText={errors?.code?.message}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6} className="auto-complete">
                  <FormControlCustom label={"Tên nhân viên"} fullWidth isMarked>
                    <InputField
                      name={"fullName"}
                      placeholder={"Nhập tên nhân viên"}
                      error={Boolean(errors.fullName)}
                      helperText={errors?.fullName?.message}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label={"Số điện thoại"} fullWidth isMarked>
                    <InputField
                      disabled
                      name={"phone"}
                      placeholder={"Nhập số điện thoại"}
                      helperText={errors?.phone?.message}
                      error={Boolean(errors.phone)}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label={"Email"} fullWidth>
                    <InputField
                      disabled
                      name={"email"}
                      placeholder={"Nhập email"}
                      helperText={errors?.email?.message}
                      error={Boolean(errors.email)}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label={"Giới tính"} fullWidth isMarked>
                    <SelectCustom
                      name={"gender"}
                      placeholder={"Chọn giới tính"}
                      error={Boolean(errors?.gender)}
                      helperText={errors?.gender?.message}
                      options={optionGender}
                    />
                  </FormControlCustom>
                </Grid>

                <Grid item xs={6}>
                  <FormControlCustom label={"Trạng thái"} fullWidth isMarked>
                    <SelectCustom
                      name={"status"}
                      placeholder={"Chọn trạng thái"}
                      error={Boolean(errors?.status)}
                      helperText={errors?.status?.message}
                      options={optionStatus || []}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={4}>
                  <FormControlCustom label={"Chọn địa chỉ"} fullWidth isMarked>
                    <SelectCustom
                      name={"provinceId"}
                      placeholder={"Chọn tỉnh/thành phố"}
                      error={Boolean(errors?.provinceId)}
                      helperText={errors?.provinceId?.message}
                      options={optionsProvince}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={4} style={{ marginTop: 23 }}>
                  <FormControlCustom label={""} fullWidth>
                    <SelectCustom
                      name={"districtId"}
                      placeholder={"Chọn quận/huyện"}
                      error={Boolean(errors?.districtId)}
                      helperText={errors?.districtId?.message}
                      options={optionsDistrict}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={4} style={{ marginTop: 23 }}>
                  <FormControlCustom label={""} fullWidth>
                    <SelectCustom
                      name={"wardId"}
                      placeholder={"Chọn phường/thị xã"}
                      error={Boolean(errors?.wardId)}
                      helperText={errors?.wardId?.message}
                      options={optionsWard}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={12}>
                  <FormControlCustom
                    label={"Số nhà, tên đường"}
                    fullWidth
                    isMarked
                  >
                    <InputField
                      name={"address"}
                      placeholder={"Nhập số nhà, tên đường"}
                      error={Boolean(errors.address)}
                      helperText={errors?.address?.message}
                    />
                  </FormControlCustom>
                </Grid>

                <Grid item xs={12}>
                  <FormControlCustom label={"Ghi chú"} fullWidth>
                    <InputField
                      name={"note"}
                      className="input-note"
                      placeholder={""}
                      error={Boolean(errors.note)}
                      helperText={errors?.note?.message}
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

export default EditStaff;
