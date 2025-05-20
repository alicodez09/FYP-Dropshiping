import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Toast from "./components/toast/Toast"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

import CreateCategory from "./pages/dashboard/createcategory/index"
import CreateProduct from "./pages/dashboard/createproduct/index"
import CreateFaq from "./pages/dashboard/createfaq/index"

import CreateNewsfeed from "./pages/dashboard/createnewsfeed/index"
import CreateJob from "./pages/dashboard/createjob/index"

import CreateUsers from "./pages/dashboard/createusers/index"

import Product from "./pages/product/Product"

import Header from "./components/header"
import Home from "./pages/home/Home"

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
                    <Route path="admin/create-job" element={<CreateJob />} />

                    <Route path="admin/users" element={<CreateUsers />} />
                    <Route path="/" element={<Home />} />

                    <Route path="/products" element={<Product />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </Router>
            <Toast />
        </>
    )
}

export default App
