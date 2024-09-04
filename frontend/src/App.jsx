import { Navigate, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginForm from "./Component/LoginForm/LoginForm";
import RegisterForm from "./Component/RegisterForm/RegisterForm";
import HomeForm from "./Component/HomeForm/HomeForm";
import ProfilePage from "./Component/ProfilePage/ProfilePage";
import ChatPage from "./Component/ChatPage/ChatPage";
import MailVerificationPage from "./Component/MailVerificationPage/MailVerificationPage";
// import ForgotPage from "./Component/ForgotPage/ForgotPage";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import VerifiedPage from "./Component/VerifiedPage/VerifiedPage";

function App() {
    const { authUser } = useAuthContext();
    const isUserVerified = authUser?.isVerified || false;

    return (
        <div className="App">
            <Routes>
                <Route
                    path="/"
                    element={
                        authUser ? (
                            isUserVerified ? (
                                <HomeForm />
                            ) : (
                                <Navigate to="/verification" />
                            )
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route path="/login" element={<LoginForm />} />

                <Route path="/register" element={<RegisterForm />} />

                <Route
                    path="/profile"
                    element={
                        authUser ? (
                            isUserVerified ? (
                                <ProfilePage />
                            ) : (
                                <Navigate to="/verification" />
                            )
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/chat"
                    element={
                        authUser ? (
                            isUserVerified ? (
                                <ChatPage />
                            ) : (
                                <Navigate to="/verification" />
                            )
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/verification"
                    element={
                        authUser ? (
                            isUserVerified ? (
                                <Navigate to="/" />
                            ) : (
                                <MailVerificationPage />
                            )
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                {/* <Route
                    path="/changepassword"
                    element={ <ForgotPage /> }
                /> */}

                <Route
                    path="/verified"
                    element={ <VerifiedPage /> }
                /> 
            </Routes>
            <Toaster />
        </div>
    );
}

export default App;
