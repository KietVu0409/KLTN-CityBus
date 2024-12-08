import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Divider, Grid } from "@mui/material";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import SearchInput from "../../../components/InputSearch";
import ModalAlert from "../../../components/Modal";
import customToast from "../../../components/ToastCustom";
import { StationApi } from "../../../utils/stationApi";
import CreateStation from "./Components/CreateEditStation/CreateStation";
import EditStation from "./Components/CreateEditStation/EditStation";
import DetailStation from "./Components/DetailStation/DetailStation";
import StationList from "./Components/StationList";
import Cookies from "js-cookie";


const AdminStation = (props) => {
  const [loadings, setLoadings] = useState([]);
  const [showDrawerEdit, setShowDrawerEdit] = useState(false);
  const [showDrawerCreate, setShowDrawerCreate] = useState(false);
  const [showDrawerDetail, setShowDrawerDetail] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [idStation, setIdStation] = useState(null);
  const [detailStation, setDetailStation] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStation, setSelectedStation] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filterParams, setFilterParams] = useState(null);
  const [data, setData] = useState([]);
  const isManager = Cookies.get("isManager");

  const handleGetData = async () => {
    try {
      enterLoading(0);
      const stationApi = new StationApi();
      const response = await stationApi.getAllStations({
        page: page + 1,
        pageSize: pageSize,
        ...filterParams,
      });
      setData(response);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };
  const getDetailStation = async (id) => {
    if (!id) return;
    const stationApi = new StationApi();
    const response = await stationApi.getStationById(id);
    setDetailStation(response.data.data);
  };
  useEffect(() => {
    getDetailStation(idStation);
  }, [idStation]);

  useEffect(() => {
    handleGetData();
  }, [showDrawerCreate]);

  useEffect(() => {
    const tmpSelected = [];
    if (!isEmpty(selected)) {
      selected.map((item) =>
        data?.data?.data?.map((elm) => {
          if (item === elm?.id) {
            tmpSelected.push(elm);
            setSelectedStation(tmpSelected);
          }
        })
      );
    } else {
      setSelectedStation([]);
    }
  }, [selected]);

  useEffect(() => {
    setFilterParams({ ...filterParams, keywords: searchValue });
  }, [searchValue]);

  useEffect(() => {
    if (!showDrawerEdit) {
      setIdStation("");
    }
  }, [showDrawerEdit]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data?.data?.data?.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handelShowDetail = (id) => {
    setShowDrawerEdit(true);
    setIdStation(id);
  };

  const handelDetail = (id) => {
    setShowDrawerDetail(true);
    setIdStation(id);
  };

  const handleSearch = (e) => {
    setFilterParams({ keywords: searchValue || undefined });
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    setPage(0);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = () => {
    if (!isEmpty(selected)) {
      setOpenModal(true);
    } else {
      customToast.warning("Vui lòng chọn mã");
    }
  };

  const handleConfirm = async () => {
    const params = {
      ids: selected,
    };

    try {
      const stationApi = new StationApi();
      const response = await stationApi.deleteMultiple({ ids: selected });

      if (response.status == 200) {
        customToast.success("Xóa thành công");
      }
      handleGetData();
      setOpenModal(false);
      setSelected([]);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    handleGetData();
  }, [page, pageSize, filterParams]);

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
  };

  const stopLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = false;
      return newLoadings;
    });
  };

  const [value, setValue] = useState({
    textfield: "",
    select: "",
    radio: "",
    checkbox: false,
  });

  const handleChange = (event) => {
    setValue({
      ...value,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const exportExcel = () => {
    const params = {};
    const data = {};
    // mutationExportExcel.mutate(params);
    // toast('info', 'Coming soon');
  };
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <Helmet>
        <title> CITY BUS - Quản lý bến xe</title>
      </Helmet>
      <Grid container className={"align-items-center header_title"}>
        <Grid item md={7}>
          <h2 className={"txt-title"} style={{ marginTop: 20 }}>
            QUẢN LÝ BẾN XE
          </h2>
        </Grid>
        {isManager == "true" &&  <Grid item md={5}>
        <Box
          style={{ display: "flex", justifyContent: "flex-end" }}
          flexDirection={{ xs: "column", md: "row" }}
        >
          <Button
            variant="contained"
            color="warning"
            className={"btn-create"}
            onClick={() => {
              setShowDrawerCreate(true);
            }}
            startIcon={<AddIcon />}
            style={{ marginTop: 20, marginRight: 20 }}
          >
            <span className={"txt"}>Thêm mới</span>
          </Button>

          <Button
            variant="contained"
            color="error"
            className={"btn-create"}
            startIcon={<DeleteIcon />}
            style={{ marginTop: 20 }}
            onClick={() => handleOpenModal()}
          >
            <span className={"txt"}>Xóa</span>
          </Button>
        </Box>
      </Grid>}
       
      </Grid>
      <Divider style={{ marginTop: 20 }} />

      <Grid
        container
        className="search"
        style={{ marginTop: 15, marginBottom: 18 }}
      >
        <Grid item md={4}>
          <div style={{ marginBottom: 5 }}>
            <span className="txt-find" style={{ marginBottom: 20 }}>
              Tìm kiếm
            </span>
          </div>

          <SearchInput
            className="txt-search"
            placeholder={"Tìm kiếm theo mã, tên, địa chỉ bến xe"}
            value={searchValue}
            setSearchValue={setSearchValue}
            handleSearch={handleSearch}
          />
        </Grid>
        <Grid item md={4}></Grid>
        <Grid item md={4}>
          <div
            style={{
              marginBottom: 5,
              float: "right",
              marginTop: 30,
              marginRight: 10,
            }}
          >
            <span style={{ fontSize: 20, fontWeight: "bolder" }}>
              Tổng số bến xe: {data?.data?.pagination?.total || 0}
            </span>
          </div>
        </Grid>
      </Grid>

      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 1 }}>
          <StationList
            data={data?.data?.data || []}
            handleShowDetail={handelShowDetail}
            handelDetail={handelDetail}
            selectionModel={selected}
            handleSelectionModeChange={handleSelectAllClick}
            handleClick={handleClick}
            handleChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            total={data?.data?.pagination?.total}
            page={page}
            pageSize={pageSize}
          ></StationList>
        </div>
      </div>
      <CreateStation
        setShowDrawer={setShowDrawerCreate}
        showDrawer={showDrawerCreate}
        handleGetData={handleGetData}
      ></CreateStation>

      <EditStation
        setShowDrawer={setShowDrawerEdit}
        showDrawer={showDrawerEdit}
        dataStation={detailStation}
        handleGetData={handleGetData}
      ></EditStation>

      <DetailStation
        setShowDrawerDetail={setShowDrawerDetail}
        showDrawerDetail={showDrawerDetail}
        dataStation={detailStation}
      ></DetailStation>

      <ModalAlert
        open={openModal}
        handleClose={() => handleCloseModal()}
        handleCancel={() => handleCloseModal()}
        handleConfirm={() => handleConfirm()}
        title={"Xác nhận xóa"}
        description={
          "Thao tác sẽ không thể hoàn tác, bạn có chắc chắn muốn tiếp tục không?"
        }
        type={"error"}
        icon={true}
        renderContentModal={
          <div className="view-input-discount">
            <span>Số bến đã chọn: {selectedStation?.length}</span>
          </div>
        }
      />
    </Box>
  );
};

export default AdminStation;
