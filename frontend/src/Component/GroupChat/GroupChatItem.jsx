import React from "react";
import useConversation from "../../zustand/useConversation";
import "../Sidebar/Sidebar.css";
import Sidebar from "../Sidebar/Sidebar";

const GroupChatItem = ({ id, groupChat, lastIdx }) => {
    const { selectedConversation, setSelectedConversation } = useConversation();

    const isSelected = selectedConversation?._id === groupChat._id;

    const iconUrl = "/group.png";

    return (
        <>
            <div
                id={id}
                className={`other ${isSelected ? "sidebarclick" : ""}`}
                onClick={() =>
                    setSelectedConversation({ ...groupChat, isGroup: true })
                }
            >
                <div className="group-icon">
                    <img src={iconUrl} alt="Group icon" />
                </div>

                <div className="nametags">
                    <div className="nametags2">
                        <p className="nametags3">
                            {groupChat ? groupChat.name : "No group name"}
                        </p>
                    </div>
                </div>
            </div>

            {!lastIdx && <hr />}
        </>
    );
};

export default GroupChatItem;