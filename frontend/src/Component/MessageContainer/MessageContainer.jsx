import React, { useEffect } from "react";
import "./MessageContainer.css";
import Messages from "../MessageContainer/Messages.jsx";
import useConversation from "../../zustand/useConversation";
import MessageInput from "../MessageContainer/MessageInput.jsx";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import useProfileData from "../../hooks/useProfileData.js";

const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation } = useConversation();

    //console.log("Selected conversation:", selectedConversation);

    useEffect(() => {
        return () => {
            setSelectedConversation(null);
        };
    }, [setSelectedConversation]);

    return (
        <div className="messagecon1">
            {!selectedConversation ? (
                <NoChatSelected />
            ) : (
                <>
                    <div className="messagecon2">
                        <span className="messagecon3">to:</span>{" "}
                        <span className="messagecon4">
                            {selectedConversation.isGroup
                                ? selectedConversation.name
                                : selectedConversation.fullName}
                        </span>
                        <hr></hr>
                    </div>

                    <Messages
                        key={selectedConversation._id}
                        groupId={
                            selectedConversation.admin
                                ? selectedConversation._id
                                : null
                        }
                    />
                    <MessageInput />
                </>
            )}
        </div>
    );
};
export default MessageContainer;

const NoChatSelected = () => {
    const { profileData } = useProfileData();
    return (
        <div className="">
            <p className="nochatscreen">Select a chat to start messaging</p>
            <p className="nochatscreen-icon">
                <HiOutlineChatBubbleLeftRight />
            </p>
        </div>
    );
};
