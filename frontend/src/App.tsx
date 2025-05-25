import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Toast from "./components/toast/Toast"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

import CreateCategory from "./pages/dashboard/createcategory/index"
import CreateProduct from "./pages/dashboard/createproduct/index"
import CreateFaq from "./pages/dashboard/createfaq/index"

import CreateNewsfeed from "./pages/dashboard/createnewsfeed/index"
import Userproduct from "./pages/dashboard/userproduct/userproduct"

import CreateJob from "./pages/dashboard/createjob/index"

import CreateUsers from "./pages/dashboard/createusers/index"

import Header from "./components/header"
import Home from "./pages/home/Home"
import Product from "./pages/product/Product"
import About from "./pages/about/About"
import Team from "./pages/team/Team"
import Faq from "./pages/faqs/Faq"
import Order from "./pages/orders/Order"
import AdminOrder from "./pages/dashboard/adminorder/Order"
import UserTickets from "./pages/usertickets/UserTickets"
import Ticket from "./pages/dashboard/adminticket/Ticket"

const App = () => {
    return (
        <>
            <Router>
                <Header />
                <Routes>
                    <Route
                        path="admin/create-category"
                        element={<CreateCategory />}
                    />

                    <Route
                        path="admin/create-product"
                        element={<CreateProduct />}
                    />
                    <Route path="admin/create-faq" element={<CreateFaq />} />

                    <Route
                        path="admin/create-newsfeed"
                        element={<CreateNewsfeed />}
                    />
                    <Route
                        path="admin/user_product"
                        element={<Userproduct />}
                    />
                    <Route
                        path="admin/order_anayltics"
                        element={<AdminOrder />}
                    />

                    <Route path="admin/tickets" element={<Ticket />} />

                    <Route path="admin/create-job" element={<CreateJob />} />

                    <Route path="admin/users" element={<CreateUsers />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/order" element={<Order />} />

                    <Route path="/products" element={<Product />} />
                    <Route path="/faqs" element={<Faq />} />
                    <Route path="/user_tickets" element={<UserTickets />} />

                    <Route path="/team" element={<Team />} />

                    <Route path="/about" element={<About />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </Router>
            <Toast />
        </>
    )
}

export default App
