import { createBrowserHistory } from 'history';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './assets/boxicons-2.0.7/css/boxicons.min.css';
import './assets/scss/grid.scss';
import './assets/scss/index.scss';
import './assets/scss/theme.scss';
import AdminLayout from './components/Layout/AdminLayout';
import NotFound from './components/NotFound/404NotFound';
import AdminAddTicket from './pages/Admin/AdminAddTicket/AdminTicket';
import AdminDashboard from './pages/Admin/AdminDashboard/AdminDashboard';
import AdminDashboardCost from './pages/Admin/AdminDashboardCost/AdminDashboardCost';
import AdminDashboardPromotion from './pages/Admin/AdminDashboardPromotion/AdminDashboardPromotion';
import AdminDashboardTicket from './pages/Admin/AdminDashboardTicket/AdminDashboardTicket';
import AdminGroupUser from './pages/Admin/AdminGroupUser/AdminGroupUser';
import Login from './pages/Admin/AdminLogin/AdminLogin';
import AdminOrder from './pages/Admin/AdminOrder/AdminOrder';
import AdminOrderRefund from './pages/Admin/AdminOrderRefund/AdminOrderRefund';
import AdminPriceList from './pages/Admin/AdminPriceList/AdminPriceList';
import DetailPriceList from './pages/Admin/AdminPriceList/components/DetailPriceList';
import AdminPromotion from './pages/Admin/AdminPromotion/AdminPromotion';
import DetailPromotion from './pages/Admin/AdminPromotion/conponents/DetailPromotion';
import AdminStation from './pages/Admin/AdminStation/AdminStation';
import AdminTrip from './pages/Admin/AdminTrip/AdminTrip';
import AdminUser from './pages/Admin/AdminUser/AdminUser';
import AdminVehicle from './pages/Admin/AdminVehicle/AdminVehicle';
import Home from './pages/Home/Home';
import SearchTrip from './pages/Home/SearchTrip';
import AdminSearchTrip from './pages/Admin/AdminAddTicket/AdminSearchTrip';
import OrderDetail from './pages/Admin/AdminOrder/OrderDetail';
import AdminTicketList from './pages/Admin/AdminTicketList/AdminTicketList';
import TicketDetail from './pages/Admin/AdminTicketList/TicketDetail';
import OrderRefundDetail from './pages/Admin/AdminOrderRefund/OrderRefundDetail';
import AdminStaff from './pages/Admin/AdminStaff/AdminStaff';
import Forgot from './pages/Admin/AdminLogin/Forgot';
import BookingPage from './pages/Home/booking/index';
import CustomerTicketDetail from './pages/Home/booking/TicketDetails';


export const history = createBrowserHistory();

function App() {
  return (
    <BrowserRouter history={history}>
      <Routes>
        <Route path="admin" element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} index />
          <Route path="/admin/customer" element={<AdminUser />} />
          <Route path="/admin/group-customer" element={<AdminGroupUser />} />
          <Route path="/admin/station" element={<AdminStation />} />
          <Route path="/admin/price-list">
            <Route path="/admin/price-list" element={<AdminPriceList />} />
            <Route path="/admin/price-list/detail/:id" element={<DetailPriceList />}></Route>
          </Route>

          <Route path="/admin/booking-trip">
            <Route path="/admin/booking-trip" element={<AdminSearchTrip />}></Route>
            <Route path="/admin/booking-trip/create-ticket/:code" element={<AdminAddTicket />}></Route>
          </Route>
          <Route path="/admin/ticket-list">
            <Route path="/admin/ticket-list" element={<AdminTicketList />}></Route>
            <Route path="/admin/ticket-list/detail/:id" element={<TicketDetail />} />
          </Route>
          <Route path="/admin/trip" element={<AdminTrip />} />
          <Route path="/admin/staff" element={<AdminStaff />} />
          <Route path="/admin/promotion">
            DetailPromotion
            <Route path="/admin/promotion" element={<AdminPromotion />}></Route>
            <Route path="/admin/promotion/detail/:id" element={<DetailPromotion />}></Route>
          </Route>
          <Route path="/admin/vehicle" element={<AdminVehicle />} />
          <Route path="/admin/order">
            <Route path="/admin/order/order-list" element={<AdminOrder />} />
            <Route path="/admin/order/detail/:id" element={<OrderDetail />} />
          </Route>

          <Route path="/admin/order-refund">
            <Route path="/admin/order-refund/list" element={<AdminOrderRefund />} />
            <Route path="/admin/order-refund/detail/:id" element={<OrderRefundDetail />} />
          </Route>
          <Route path="/admin/dashboard-ticket" element={<AdminDashboardTicket />} />
          <Route path="/admin/dashboard-promotion" element={<AdminDashboardPromotion />} />
          <Route path="/admin/dashboard-cost" element={<AdminDashboardCost />} />
        </Route>
        <Route path="/admin/login" element={<Login />} />
        {/* <Route path="/">
          <Route path="/" element={<Home />} />
          <Route path="/create-ticket/:codeTrip" element={<BookingPage />} />
          <Route path="/ticket-list/detail/:id" element={<CustomerTicketDetail />} />
          <Route
            path="/trip/from/:fromProvinceName/:codeProvinceFrom/to/:toProvinceName/:codeProvinceTo/:startDate"
            element={<SearchTrip />}
          />
        </Route> */}
        <Route path="forgot-password" element={<Forgot />} />

        <Route path="*" element={<Navigate to="/admin/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
