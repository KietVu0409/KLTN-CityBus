import React, { useEffect, useState } from "react";
import statusCards from "../../../assets/JsonData/status-card-data.json";
import StatusCard from "../../../components/StatusCard";
// import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import TableDashboard from "../../../components/TableDashboard";
import Badge from "../../../components/Badge";
import { Helmet } from "react-helmet";
import { OrderApi } from "../../../utils/orderApi";
import customToast from "../../../components/ToastCustom";
import moment from "moment";
import { convertCurrency } from "../../../data/curren";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { StatisticsApi } from "../../../utils/statisticsApi";
// //moment.locale('vi');
const AdminDashboard = (props) => {
  const [dataOrder, setDataOrder] = useState([]);
  const [statistics, setStatistics] = useState();
  const [topCustomer, setTopCustomer] = useState([]);
  var now = new Date();
  var sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const [dataRevenue, setDataRevenue] = useState([]);

  const [total, setTotal] = useState([]);

  var dates = [];
  var dataDate = [];

  for (var i = 0; i < 7; i++) {
    var now = new Date();
    var day = now.getDate() - i;
    var sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), day);
    var data = moment(sevenDaysAgo).format("DD/MM/YYYY");
    var data2 = moment(sevenDaysAgo).format("DD/MM");
    dates.push(data);
    dataDate.push(data2);
  }
  dates.reverse();
  dataDate.reverse();

  const handleTotalDate = () => {
    var recentData = [];
    for (var i = 0; i < dates.length; i++) {
      var found = false;
      for (var j = 0; j < dataRevenue.length; j++) {
        var dataDate = moment(new Date(dataRevenue[j].day)).format(
          "DD/MM/YYYY"
        );
        if (dates[i] === dataDate) {
          recentData.push(dataRevenue[j].total);
          found = true;
          break;
        }
      }
      if (!found) {
        recentData.push(0);
      }
    }
    setTotal(recentData);
  };

  const handleGetData = async () => {
    try {
      const orderApi = new OrderApi();
      const response = await orderApi.getListOrderBill({
        page: 1,
        pageSize: 5,
      });
      setDataOrder(response?.data?.data);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };
  const handleGetStatistics = async () => {
    try {
      const statisticApi = new StatisticsApi();
      const response = await statisticApi.statistics();
      setStatistics(response?.data?.data);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };
  const handleGetTopCustomer = async () => {
    try {
      const statisticApi = new StatisticsApi();
      const response = await statisticApi.topCustomers();
      setTopCustomer(response?.data?.data);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };
  const handleGetDataRevenue = async () => {
    try {
      const statisticApi = new StatisticsApi();
      const response = await statisticApi.revenue();
      setDataRevenue(response?.data?.data);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    handleGetData();
    handleGetStatistics();
    handleGetTopCustomer();
    handleGetDataRevenue();
  }, []);

  useEffect(() => {
    handleTotalDate();
  }, [dataRevenue]);

  const chartOptions = {
    series: [
      {
        name: "Doanh thu đặt vé",
        data: total,
      },
    ],
    options: {
      color: ["#6ab04c"],
      chart: {
        background: "transparent",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: dataDate,
      },
      legend: {
        position: "top",
      },
      grid: {
        show: false,
      },
      
    },
  };

  const topCustomers = {
    head: ["Khách hàng", "Tổng đơn đặt", "Tổng chi"],
  };

  const renderCusomerHead = (item, index) => <th key={index}>{item}</th>;

  const renderCusomerBody = (item, index) => (
    <tr key={index}>
      <td>{item.username}</td>
      <td>{item.order}</td>
      <td>{item.price}</td>
    </tr>
  );

  const renderOrderBody = (item, index) => (
    <tr key={item?.id}>
      <td>{item?.code}</td>
      <td>{item?.customer?.fullName}</td>
      <td>{item?.finalTotal}</td>
      <td>{moment(item?.createdAt).format("DD/MM/YYYY")}</td>
      <td>{item.status}</td>
    </tr>
  );

  return (
    <div>
      <Helmet>
        <title> CITY BUS - Dashboard</title>
      </Helmet>
      <div style={{ marginBottom: 20 }}>
        <h2>Dashboard</h2>
        <span>
          (Từ ngày {moment(sevenDaysAgo).format("DD/MM/YYYY")} đến ngày{" "}
          {moment(now).format("DD/MM/YYYY")})
        </span>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-4">
              <StatusCard
                icon={"bx bx-shopping-bag"}
                count={statistics?.totalTicketsSold}
                title={"Vé bán"}
              />
            </div>
            <div className="col-4">
              <StatusCard
                icon={"bx bx-cart"}
                count={statistics?.totalCustomers}
                title={"Khách hàng"}
              />
            </div>
            <div className="col-4">
              <StatusCard
                icon={"bx bx-dollar-circle"}
                count={convertCurrency(statistics?.totalRevenue)}
                title={"Tổng doanh thu"}
              />
            </div>
            <div className="col-4">
              <StatusCard
                icon={"bx bx-receipt"}
                count={statistics?.totalOrders}
                title={"Hóa đơn"}
              />
            </div>
          </div>
        </div>
        {/* <div className="col-6">
          <div
            className="card full-height"
            style={{ backgroundColor: "#baf4f2" }}
          >
            <Chart
              options={chartOptions.options}
              series={chartOptions.series}
              type="bar"
              height="100%"
            />
          </div>
        </div> */}
        <div className="col-5">
          <div className="card">
            <div className="card__header">
              <h3>Top khách hàng đặt vé</h3>
            </div>
            <div className="card__body">
              <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table sx={{ minWidth: 400 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" style={{ width: 150 }}>
                        Khách hàng
                      </TableCell>
                      <TableCell style={{ width: 150 }} align="center">
                        Tổng đơn đặt
                      </TableCell>
                      <TableCell align="center" style={{ width: 110 }}>
                        Tổng chi
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topCustomer.map((row) => (
                      <TableRow
                        key={row?.customerId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row?.fullName}
                        </TableCell>
                        <TableCell align="center">
                          {row?.numberOfOrders}
                        </TableCell>
                        <TableCell align="center">
                          {convertCurrency(row?.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="card__footer">
              <Link to="/admin/customer">View All Customers</Link>
            </div>
          </div>
        </div>
        <div className="col-7">
          <div className="card">
            <div className="card__header">
              <h3>Đơn đặt vé mới nhất</h3>
            </div>
            <div className="card__body">
              <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table sx={{ minWidth: 600 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: 50 }}>Mã hóa đơn</TableCell>
                      <TableCell align="right" style={{ width: 150 }}>
                        Khách hàng
                      </TableCell>
                      <TableCell style={{ width: 100 }} align="right">
                        Tổng tiền
                      </TableCell>
                      <TableCell align="right" style={{ width: 100 }}>
                        Ngày tạo
                      </TableCell>
                      <TableCell align="center" style={{ width: 220 }}>
                        Trạng thái
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataOrder.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="right">
                          {row?.code}
                        </TableCell>
                        <TableCell align="right">
                          {row?.customer?.fullName}
                        </TableCell>
                        <TableCell align="right">
                          {convertCurrency(row?.finalTotal)}
                        </TableCell>
                        <TableCell align="right">
                          {moment(row?.createdAt).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell align="right">
                          <Badge
                            type={
                              row?.status == "Đã thanh toán"
                                ? "success"
                                : "danger"
                            }
                            content={
                              row?.status == "Đã thanh toán"
                                ? "Thành công"
                                : "Trả vé"
                            }
                          />{" "}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="card__footer">
              <Link to="/admin/order/order-list">view all</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
