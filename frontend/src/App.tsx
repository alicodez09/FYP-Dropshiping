import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Toast from "./components/toast/Toast"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

import CreateCategory from "./pages/dashboard/createcategory/index"
import CreateProduct from "./pages/dashboard/createproduct/index"
import CreateUsers from "./pages/dashboard/createusers/index"

import Home from "./pages/home/Home"
import Header from "./components/header"

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

                    <Route path="admin/users" element={<CreateUsers />} />

                    <Route path="/" element={<Home />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </Router>
            <Toast />
        </>
    )
}

export default App
