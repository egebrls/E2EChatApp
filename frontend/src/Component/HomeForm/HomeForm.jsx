import React from "react";
import { Link, Route } from "react-router-dom"; // react-router-dom'dan Link componentini içe aktarın
import useLogout from "../../hooks/useLogout.js";
import "./HomeForm.css";
import { HiOutlineHome } from "react-icons/hi2";
import { FiUser } from "react-icons/fi";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import useProfileData from "../../hooks/useProfileData";

const HomeForm = () => {
    const { loading, logout } = useLogout();
    const { profileData } = useProfileData();

    return (
        <div>
            <h1 className="ws">HELLO {profileData.fullName || ""}! WELCOME TO </h1>
             <img src="Fortı-removebg-preview.png" alt="No Data" width="300" height="300"></img>
             <p className="ws"> This app was designed as a graduation project by 
                    2023-2024 academic year spring semester graduates Halil Yüksel,
                    Buse Alasköz, Ege Barlas and Ahmet Fatih Saruhan.</p>
                    <p className="ws">&#169; All rights reserved 2024 </p>
            <div className="navigation">
                <ul>
                    <li className="list">
                    <Link to="/">
                            <span className="icon"><HiOutlineHome /></span>
                            <span className="text">Home</span>
                        </Link>
                    </li>
                    <li className="list">
                    <Link to="/profile">
                            <span className="icon"><FiUser /></span>
                            <span className="text">Profile</span>
                        </Link>
                    </li>
                    <li className="list">
                    <Link to="/chat">
                            <span className="icon"><BiMessageRoundedDetail /></span>
                            <span className="text">Chat</span>
                        </Link>
                    </li>
                    {/* <li className="list">
                    <a href="ProfilePage.jsx">
                            <span className="icon"><MdOutlineAddToPhotos /></span>
                            <span className="text">Create Group Chat</span>
                        </a>
                    </li>  */}
                    <li className="list">
                        <a href="#" onClick={logout}>
                            <span className="icon"><MdOutlinePowerSettingsNew /></span>
                            <span className="text">Logout</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default HomeForm;
