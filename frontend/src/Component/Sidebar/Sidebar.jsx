import React from "react";
import SearchInput from "../../Component/Sidebar/SearchInput.jsx";
import Conversations from "../../Component/Sidebar/Conversations.jsx";
import "./Sidebar.css";

const Sidebar = () => {
    return (
        <div className="side1">
            <SearchInput />
            <hr className="" />
            <Conversations />
        </div>
    );
};
export default Sidebar;
