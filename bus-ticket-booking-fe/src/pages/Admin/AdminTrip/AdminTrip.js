import AddIcon from '@mui/icons-material/Add';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { Box, Button, Divider, Grid, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FormProvider, useForm } from 'react-hook-form';
import AutocompleteCustom from '../../../components/AutocompleteCustom';
import FormControlCustom from '../../../components/FormControl';
import SearchInput from '../../../components/InputSearch';
import SelectCustom from '../../../components/SelectCustom';
import customToast from '../../../components/ToastCustom';
import { StationApi } from '../../../utils/stationApi';
import { TripApi } from '../../../utils/tripApi';
import AddTrip from './components/AddTrip';
import EditTrip from './components/EditTrip';
import TripDetail from './components/TripDetail';
import TripList from './components/TripList';
import Cookies from 'js-cookie';
import { ProvinceApi } from '../../../utils/provinceApi';

const AdminTrip = (props) => {
  const [data, setData] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [filterParams, setFilterParams] = useState(null);
  const [fromStationId, setFromStationId] = useState(null);
  const [toStationId, setToStationId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDrawerCreate, setShowDrawerCreate] = useState(false);
  const [optionStation, setOptionStation] = useState([]);
  const [disable, setDisable] = useState(true);
  const [showDrawerEdit, setShowDrawerEdit] = useState(false);
  const [idTrip, setIdTrip] = useState(null);
  const [detailTrip, setDetailTrip] = useState('');
  const [showDrawerDetail, setShowDrawerDetail] = useState(false);
  const isManager = Cookies.get('isManager');

  const [fromToProvince, setFromToProvince] = useState([]);
  const [optionsProvince, setOptionsProvince] = useState([]);
  
  const handelDetail = (id) => {
    setShowDrawerDetail(true);
    setIdTrip(id);
  };

  const filterDateTime = [
    {
      id: 1,
      code: 'ALL',
      name: 'Tất cả',
    },
    {
      id: 2,
      code: 'option',
      name: 'Tùy chọn',
    },
  ];
  const handelGetOptionStations = async () => {
    try {
      const stationApi = new StationApi();
      const response = await stationApi.getList();
      setOptionStation(response?.data?.data);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    handelGetOptionStations();
  }, []);

  const getDetailTrip = async (id) => {
    if (!id) return;
    const tripApi = new TripApi();
    const response = await tripApi.getById(id);
    setDetailTrip(response.data.data);
  };
  useEffect(() => {
    getDetailTrip(idTrip);
  }, [idTrip]);

  const handleShowDetail = (id) => {
    setShowDrawerEdit(true);
    setIdTrip(id);
  };

  const handleGetData = async () => {
    try {
      const tripApi = new TripApi();
      const response = await tripApi.getAll({
        page: page + 1,
        pageSize: pageSize,
        ...filterParams,
      });
      setData(response);

      const provinceIds = response.data.data
        .map((item) => ({
          fromProvinceId: item.fromStation.provinceId,
          toProvinceId: item.toStation.provinceId,
        }))
        .reduce((acc, current) => {
          const x = acc.find(
            (item) => item.fromProvinceId === current.fromProvinceId && item.toProvinceId === current.toProvinceId
          );
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
      setFromToProvince(provinceIds);
      console.log(provinceIds);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    setFilterParams({ ...filterParams, keywords: searchValue });
  }, [searchValue]);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    setSearchValue('');
    getDataProvince();
  }, []);

  useEffect(() => {
    setFilterParams({
      ...filterParams,
      fromStationId: fromStationId,
      toStationId: toStationId,
      startDate: startDate,
      endDate: endDate,
    });
  }, [fromStationId, toStationId, startDate, endDate]);

  useEffect(() => {
    handleGetData();
  }, [page, pageSize, filterParams]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    setPage(0);
  };

  const defaultValues = {
    typeSearch: null,
    licensePlateSearch: null,
    floorNumber: null,
  };
  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit, reset, watch } = methods;
  const watchFromStation = watch('codeStationFrom');
  const watchToStation = watch('codeStationTo');

  useEffect(() => {
    const params = {
      ...filterParams,
      fromStationId: watchFromStation?.id,
      toStationId: watchToStation?.id,
    };
    setFilterParams(params);
  }, [watchFromStation, watchToStation]);

  const buildOptionSelect = (option, props) => {
    return (
      <div style={{ width: '150px' }} {...props}>
        <Grid container style={{ alignItems: 'center' }}>
          <Grid item style={{ marginLeft: '5px' }}>
            <div className={'class-display'}>
              <span style={{ fontSize: '13px', color: '#0C59CC' }}> {option?.code}</span>
              <span style={{ fontSize: '13px' }}>- {option?.name}</span>
            </div>
          </Grid>
        </Grid>
        <Divider />
      </div>
    );
  };
  const watchTime = watch('time');
  useEffect(() => {
    const params = {
      ...filterParams,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    setFilterParams(params);
  }, [watchTime, startDate, endDate]);
  useEffect(() => {
    const now = new Date();

    if (watchTime?.code === 'option') {
      // setSelectedDate({ ...selectedDate, dateFrom: '', dateTo: '' });
    } else {
      const currentYear = new Date().getFullYear();
      const firstDay = new Date(currentYear, 0, 1);
      const lastDay = new Date(currentYear, 11, 31);

      setStartDate(null);
      setEndDate(null);
    }
  }, [watchTime]);

  useEffect(() => {
    if (watchTime?.code === 'option') {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [watchTime]);

  const resetFilterParams = () => {
    setPage(0);
    setPageSize(10);
    setSearchValue('');
    setStartDate(null);
    setEndDate(null);
    handleGetData();
    customToast.success('Làm mới dữ liệu thành công');
  };

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

  console.log(optionsProvince);
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Helmet>
        <title> CITY BUS - Quản lý chuyến xe</title>
      </Helmet>
      <Grid container className={'align-items-center header_title'}>
        <Grid item md={7}>
          <h2 className={'txt-title'} style={{ marginTop: 20 }}>
            DANH SÁCH CÁC CHUYẾN ĐI
          </h2>
        </Grid>
        <Grid item md={5}>
          <Box style={{ display: 'flex', justifyContent: 'flex-end' }} flexDirection={{ xs: 'column', md: 'row' }}>
            <Button
              className={'btn-create'}
              style={{ marginTop: 20, marginRight: 20 }}
              variant="contained"
              color="info"
              startIcon={<RefreshOutlinedIcon />}
              onClick={() => resetFilterParams()}
            >
              <span className={'txt'}>Làm mới</span>
            </Button>
            {isManager == 'true' && (
              <Button
                variant="contained"
                color="warning"
                className={'btn-create'}
                startIcon={<AddIcon />}
                style={{ marginTop: 20, marginRight: 20 }}
                onClick={() => setShowDrawerCreate(true)}
              >
                <span className={'txt'}>Thêm mới</span>
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
      <Divider style={{ marginTop: 10 }} />
      <Grid className="search" container style={{ marginTop: 10, marginBottom: 10 }}>
        <FormProvider {...methods}>
          <Grid item md={8.5}>
            <Box style={{ display: 'flex', justifyContent: 'flex-start' }} flexDirection={{ xs: 'column', md: 'row' }}>
              <FormControlCustom label="Thời gian" fullWidth>
                <div className="view-input">
                  <SelectCustom options={filterDateTime} placeholder={'Tất cả'} name={'time'} />
                </div>
              </FormControlCustom>
              {/* <FormControlCustom label="Ngày bắt đầu" fullWidth>
                <div className="view-input">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disabled={disable}
                      onChange={(e) => {
                        setStartDate(new Date(e));
                      }}
                      value={dayjs(startDate)}
                      className={'date-picker'}
                      renderInput={(params) => <TextField {...params} />}
                      format="DD/MM/YYYY"
                    />
                  </LocalizationProvider>
                </div>
              </FormControlCustom>
              <FormControlCustom label="Ngày kết thúc" fullWidth>
                <div className="view-input">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disabled={disable}
                      value={dayjs(endDate)}
                      onChange={(e) => {
                        setEndDate(new Date(e));
                      }}
                      className={'date-picker'}
                      renderInput={(params) => <TextField {...params} />}
                      format="DD/MM/YYYY"
                    />
                  </LocalizationProvider>
                </div>
              </FormControlCustom> */}

              <FormControlCustom label="Nơi đi" fullWidth>
                <div className="view-input">
                  <AutocompleteCustom
                    name={'codeStationFrom'}
                    placeholder={'Chọn nơi đi'}
                    options={optionStation || []}
                    optionLabelKey={'code'}
                    renderOption={buildOptionSelect}
                  />
                </div>
              </FormControlCustom>
              <FormControlCustom label="Nơi đến" fullWidth>
                <div className="view-input">
                  <AutocompleteCustom
                    name={'codeStationTo'}
                    placeholder={'Chọn nơi đến'}
                    options={optionStation || []}
                    optionLabelKey={'code'}
                    renderOption={buildOptionSelect}
                  />
                </div>
              </FormControlCustom>
            </Box>
          </Grid>
          <Grid item md={3.3} style={{ marginTop: 3 }}>
            <div style={{ marginBottom: 5 }}>
              <span className="txt-find">Tìm kiếm</span>
            </div>

            <SearchInput
              className="txt-search"
              placeholder={'Tìm kiếm chuyến xe'}
              value={searchValue}
              setSearchValue={setSearchValue}
              handleSearch={handleSearch}
            />
          </Grid>
        </FormProvider>
      </Grid>
      <Grid
        item
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 10,
          marginRight: 30,
          color: '#000',
          marginRight: 5,
          fontSize: 15,
          fontWeight: 'bold',
        }}
        md={6}
      >
        <span className="title-price" style={{ marginRight: 10 }}>
          Tổng số chuyến xe:{' '}
        </span>
        <span className="txt-price">{data?.data?.pagination?.total}</span>
      </Grid>
      {fromToProvince.map((item) => {
        console.log(item);
        const filtedData = data?.data?.data.filter((val) => {
          return (
            val?.fromStation?.provinceId == item?.fromProvinceId && val?.toStation?.provinceId == item?.toProvinceId
          );
        });
        const fromName = optionsProvince.find(value => value?.code == +item?.fromProvinceId);
        const toName = optionsProvince.find(value => value?.code == +item?.toProvinceId);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <p>Tuyến {fromName?.name} - {toName?.name}</p>
            <div style={{ flexGrow: 1 }}>
              <TripList
                data={filtedData || []}
                handleChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                handelDetail={handelDetail}
                handleShowDetail={handleShowDetail}
                total={data?.data?.pagination?.total}
                handleGetData={handleGetData}
                page={page}
                pageSize={pageSize}
              ></TripList>
            </div>
          </div>
        );
      })}

      <AddTrip
        showDrawer={showDrawerCreate}
        setShowDrawer={setShowDrawerCreate}
        handleGetData={handleGetData}
      ></AddTrip>
      <EditTrip
        setShowDrawer={setShowDrawerEdit}
        showDrawer={showDrawerEdit}
        dataTrip={detailTrip}
        handleGetData={handleGetData}
      ></EditTrip>
      <TripDetail
        setShowDrawerDetail={setShowDrawerDetail}
        showDrawerDetail={showDrawerDetail}
        dataTrip={detailTrip}
      ></TripDetail>
    </Box>
  );
};

export default AdminTrip;
