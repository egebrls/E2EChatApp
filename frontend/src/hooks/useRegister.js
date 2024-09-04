import React from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useRegister = () => {
    const [loading, setLoading] = React.useState(false);
    const { setAuthUser } = useAuthContext();

    const register = async (inputs) => {
        const { fullName, userName, password, confirmPassword, email, gender } =
            inputs;

        const success = handleInputErrors(
            fullName,
            userName,
            password,
            confirmPassword,
            email,
            gender
        );
        if (!success) return false;

        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName,
                    userName,
                    password,
                    confirmPassword,
                    email,
                    gender,
                    isVerified: false,
                }),
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            localStorage.setItem("authUser", JSON.stringify(data));

            setAuthUser(data);

            return true;
        } catch (error) {
            toast.error(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, register };
};

export default useRegister;

function handleInputErrors(
    fullName,
    userName,
    password,
    confirmPassword,
    email,
    gender
) {
    if (
        !fullName ||
        fullName.length === 0 ||
        !userName ||
        userName.length === 0 ||
        !password ||
        password.length === 0 ||
        !confirmPassword ||
        confirmPassword.length === 0 ||
        !email ||
        email.length === 0 ||
        !gender ||
        gender.length === 0
    ) {
        toast.error("Please fill all fields");
        return false;
    }
    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return false;
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return false;
    }

    return true;
}