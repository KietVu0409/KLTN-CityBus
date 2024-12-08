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

const EditGroupUser = (props) => {
  const {
    setShowDrawer,
    showDrawer,
    dataGroupCustomer,
    setShowDrawerDetail,
    handleGetData,
  } = props;

  const schema = yup.object().shape({
    code: yup
      .string()
      .typeError("Mã nhóm khách hàng không được phép bỏ trống")
      .required("Mã nhóm khách hàng không được phép bỏ trống"),
    name: yup
      .string()
      .typeError("Tên nhóm không được phép bỏ trống")
      .required("Tên nhóm không được phép bỏ trống"),
  });

  const defaultValues = useMemo(
    () => ({
      code: dataGroupCustomer?.code,
      name: dataGroupCustomer?.name,
      note: dataGroupCustomer?.note,
      description: dataGroupCustomer?.description,
    }),
    [dataGroupCustomer]
  );
  const methods = useForm({
    mode: "onSubmit",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, reset, formState, setValue, watch } = methods;
  const { errors } = formState;
  useEffect(() => {
    reset({ ...defaultValues });
  }, [dataGroupCustomer]);

  const goBack = () => {
    reset();
    setShowDrawer(false);
  };

  const toggleDrawer = (open) => (event) => {
    setShowDrawer(open);
  };
  useEffect(() => {
    reset();
  }, [showDrawer]);

  const onSubmit = async (value) => {
    const params = {
      code: value.code,
      name: value.name,
      description: value?.description,
      note: value?.note,
    };
    try {
      const groupCusApi = new GroupCusApi();
      const res = await groupCusApi.update(dataGroupCustomer.id, params);
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
              <span>Thông tin nhóm khách hàng</span>
            </div>
            <div className="content">
              <Grid container spacing={1.5}>
                <Grid item xs={6} className="auto-complete">
                  <FormControlCustom label={"Mã nhóm"} fullWidth isMarked>
                    <InputField
                      name={"code"}
                      placeholder={"Nhập mã nhóm"}
                      error={Boolean(errors.code)}
                      helperText={errors?.code?.message}
                      disabled
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label={"Tên nhóm"} fullWidth isMarked>
                    <InputField
                      name={"name"}
                      placeholder={"Nhập tên nhóm"}
                      helperText={errors?.name?.message}
                      error={Boolean(errors.name)}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={12}>
                  <FormControlCustom label={"Ghi chú"} fullWidth>
                    <InputField
                      name={"note"}
                      helperText={""}
                      placeholder={"Nhập ghi chú"}
                      multiline
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={12}>
                  <FormControlCustom label={"Mô tả"} fullWidth>
                    <InputField
                      className="input-note"
                      name={"description"}
                      helperText={""}
                      placeholder={"Nhập mô tả"}
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
                  // onClick={onSubmit}
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

export default EditGroupUser;
