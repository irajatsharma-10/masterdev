import "./App.css"
import { Routes, Route } from "react-router-dom"
import Home from "../src/pages/Home"
import Navbar from "./components/common/Navbar"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import About from "./pages/About"
import VerifyEmail from "./pages/VerifyEmail"
import { Toaster } from 'react-hot-toast';
import OpenRoute from "./components/core/Auth/OpenRoute"
import ForgotPassword from "./pages/forgotPassword"
import UpdatePassword from "./pages/UpdatePassword"
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import Dashboard from "./pages/Dashboard"
import Settings from "./components/core/Dashboard/Settings/index"
import MyProfile from "./components/core/Dashboard/MyProfile"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses"
import ConfirmationModal from "./components/common/ConfirmationModal"
import Error from "./pages/Error"

function App() {
    return (
        <div className="flex min-h-screen flex-col bg-richblack-900 font-inter">
            <Toaster />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route
                    path="login"
                    element={
                        <OpenRoute>
                            <Login />
                        </OpenRoute>
                    }
                />
                <Route
                    path="signup"
                    element={
                        <OpenRoute>
                            <Signup />
                        </OpenRoute>
                    }
                />
                <Route
                    path="forgot-password"
                    element={
                        <OpenRoute>
                            <ForgotPassword />
                        </OpenRoute>
                    }
                />

                <Route
                    path="verify-email"
                    element={
                        <OpenRoute>
                            <VerifyEmail />
                        </OpenRoute>
                    }
                />
                <Route
                    path="update-password/:id"
                    element={
                        <OpenRoute>
                            <UpdatePassword />
                        </OpenRoute>
                    }
                />
                <Route
                    path="CM"
                    element={
                        <OpenRoute>
                            <ConfirmationModal/>
                        </OpenRoute>
                    }
                />

                <Route
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                >
                    <Route path="dashboard/my-profile" element={<MyProfile />} />
                    <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />

                    <Route path="dashboard/Settings" element={<Settings />} />
                </Route>

                <Route path="/about" element={<About />}></Route>
                <Route path = "*" element = {<Error/>}></Route>
            </Routes>

        </div>
    )
}

export default App;