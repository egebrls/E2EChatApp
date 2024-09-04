import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();
    const navigate = useNavigate();

    const login = async (userName, password) => {
        const success = handleInputErrors(userName, password);
        if (!success) return;

        setLoading(true);
        try {
            const res = await fetch("api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userName, password }),
            });

            const data = await res.json();
            if (data.error === "Email is not verified") {
                setAuthUser({ userName });
                localStorage.setItem("authUser", JSON.stringify(data));
                navigate("/verification");
            } else if (data.error) {
                throw new Error(data.error);
            } else {
                localStorage.setItem("authUser", JSON.stringify(data));
                setAuthUser(data);
                navigate("/");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

export default useLogin;

function handleInputErrors(userName, password) {
    if (
        !userName ||
        userName.length === 0 ||
        !password ||
        password.length === 0
    ) {
        toast.error("Please fill all fields");
        return false;
    }

    return true;
}
