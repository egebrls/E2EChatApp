import "./ChatPage.css";
import React, { useState } from "react";
import { Link, Route } from "react-router-dom"; // react-router-dom'dan Link componentini içe aktarın
import useLogout from "../../hooks/useLogout.js";
//import "./HomeForm.css";
import { HiOutlineHome } from "react-icons/hi2";
import { FiUser } from "react-icons/fi";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import Sidebar from "../../Component/Sidebar/Sidebar.jsx";
import MessageContainer from "../../Component/MessageContainer/MessageContainer.jsx";
import GroupChat from "../GroupChat/GroupChat.jsx";
import GroupChatInfo from "../GroupChat/GroupChatInfo.jsx";
import GroupChatItem from "../GroupChat/GroupChatItem.jsx";
import useConversation from "../../zustand/useConversation";
import useListenGroupMessages from "../../hooks/useListenGroupMessages";
import { RefreshContext } from "../../context/RefreshContext.jsx";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import useListenMessages from "../../hooks/useListenMessages.js";
import Notifications from "../../hooks/useGetNotifications.jsx";
import { FaRegBell } from "react-icons/fa6";

const ChatPage = () => {
    const { loading, logout } = useLogout();
    const [showGroupChat, setShowGroupChat] = useState(false);
    //const [selectedGroupChatId, setSelectedGroupChat] = useState(null);
    const { selectedConversation, setSelectedConversation } = useConversation();
    const [refreshKey, setRefreshKey] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const toggleDropdown = () => {
      setIsActive(!isActive);
    };

    useListenMessages();
    useListenGroupMessages();

    const handleClick = () => {
        setShowGroupChat((prevState) => !prevState);
    };

    /*     const handleGroupChatClick = (groupChat) => {
        console.log("Clicked group chat:", groupChat);
        console.log("Setting selected conversation to:", {
            ...groupChat,
            isGroup: true,
        });
        setSelectedConversation({ ...groupChat, isGroup: true });
    }; */

    if (selectedConversation && selectedConversation.isGroup) {
        selectedConversation._id;
    }

    //selectedConversation !== null && selectedConversation.isGroup === true;

    return (
        <RefreshContext.Provider value={{ refreshKey, setRefreshKey }}>
            <div>
                <Notifications />
                <div className="navigation">
                    <ul>
                        <li className="list">
                            <Link to="/">
                                <span className="icon">
                                    <HiOutlineHome />
                                </span>
                                <span className="text">Home</span>
                            </Link>
                        </li>
                        <li className="list">
                            <Link to="/profile">
                                <span className="icon">
                                    <FiUser />
                                </span>
                                <span className="text">Profile</span>
                            </Link>
                        </li>
                        <li className="list">
                            <Link to="/chat">
                                <span className="icon">
                                    <BiMessageRoundedDetail />
                                </span>
                                <span className="text">Chat</span>
                            </Link>
                        </li>
                        <li className="list">
                            <a>
                                <span className="icon" onClick={handleClick}>
                                    <AiOutlineUsergroupAdd />
                                </span>
                                <span className="text" onClick={handleClick}>
                                    Create Group
                                </span>
                            </a>
                        </li>
                        <li className="list">
                            <a href="#" onClick={logout}>
                                <span className="icon">
                                    <MdOutlinePowerSettingsNew />
                                </span>
                                <span className="text">Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="chat1">
                    {showGroupChat && <GroupChat />}
                    <Sidebar key={refreshKey} />
                    <MessageContainer />
                    {selectedConversation && selectedConversation.isGroup && (
                        <GroupChatInfo
                            conversation={selectedConversation}
                            refreshKey={refreshKey}
                        />
                    )}
                </div>
            </div>
        </RefreshContext.Provider>
    );
};

export default ChatPage;
