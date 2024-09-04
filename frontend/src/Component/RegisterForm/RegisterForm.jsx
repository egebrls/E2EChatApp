import React from "react";
import { LuUser2 } from "react-icons/lu";
import "./RegisterForm.css";
import { useState } from "react";
import useRegister from "../../hooks/useRegister";
import { Link } from "react-router-dom";
import ProfilePage from "../ProfilePage/ProfilePage";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
    const [inputs, setInputs] = useState({
        fullName: "",
        userName: "",
        password: "",
        confirmPassword: "",
        email: "",
        gender: "",
    });

    const navigate = useNavigate();

    const { loading, register } = useRegister();

    const handleCheckBoxChange = (gender) => {
        setInputs({ ...inputs, gender });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const registrationIsSuccessful = await register(inputs);
        if (registrationIsSuccessful) {
            navigate("/verification");
        }
    };

    return (
        <div className="wrapper2">
            <form onSubmit={handleSubmit}>
                <div className="logo"></div>
                <div className="input-box">
                    <LuUser2 />
                    <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={inputs.fullName}
                        onChange={(e) =>
                            setInputs({
                                ...inputs,
                                fullName: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Username"
                        required
                        value={inputs.userName}
                        onChange={(e) =>
                            setInputs({
                                ...inputs,
                                userName: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={inputs.password}
                        onChange={(e) =>
                            setInputs({
                                ...inputs,
                                password: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Confirmed Password"
                        required
                        value={inputs.confirmPassword}
                        onChange={(e) =>
                            setInputs({
                                ...inputs,
                                confirmPassword: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={inputs.email}
                        onChange={(e) =>
                            setInputs({
                                ...inputs,
                                email: e.target.value,
                            })
                        }
                    />
                </div>

                <input
                    type="radio"
                    name="gender"
                    value="Male"
                    required
                    onChange={(e) =>
                        setInputs({
                            ...inputs,
                            gender: e.target.value,
                        })
                    }
                />
                <label htmlFor="Male">Male </label>
                <input
                    type="radio"
                    name="gender"
                    value="Female"
                    required
                    onChange={(e) =>
                        setInputs({
                            ...inputs,
                            gender: e.target.value,
                        })
                    }
                />
                <label htmlFor="Female"> Female</label>
                <br />
                <br />

                <button type="submit">Register</button>
                <div className="login-link"></div>
                <p>
                    Already have an account? <a href="login">Login</a>
                </p>
            </form>
        </div>
    );
}

export default RegisterForm;
