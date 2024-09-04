import React from "react";
import "./MessageContainer.css";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { extractTime } from "../../../../backend/utils/extractTime";

const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const formattedTime = extractTime(message.createdAt || message.timestamp);
    const fromMe =
        (message.senderId || message.sender || message.userId) === authUser._id;
    const chatClassName = fromMe ? "messagesend1" : "receivedmessage1";
    const fileUrl = `http://localhost:5000/${message.filePath}`;

    const senderName = fromMe
        ? "You"
        : selectedConversation.isGroup
        ? message.senderName
        : selectedConversation.fullName;

    let fileComponent = null;
    if (message.filePath) {
        const ext = message.filePath.split(".").pop().toLowerCase();
        if (["png", "jpg", "jpeg", "gif"].includes(ext)) {
            fileComponent = (
                <img className="chat-image" src={fileUrl} alt="Uploaded file" />
            );
        } else if (["mp3", "wav", "ogg"].includes(ext)) {
            fileComponent = (
                <audio className="chat-audio" controls src={fileUrl}>
                    Your browser does not support the audio element.
                </audio>
            );
        } else if (["mp4", "webm", "ogg"].includes(ext)) {
            fileComponent = (
                <video className="chat-video" controls src={fileUrl}>
                    Your browser does not support the video element.
                </video>
            );
        } else {
            const fileName = message.filePath.split(/(\\|\/)/).pop();
            fileComponent = (
                <a
                    href={fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {fileName}
                </a>
            );
        }
    }

    return (
        <div className="">
            <div className={` ${chatClassName} `}>
                <div className="receivedmessagetime">{senderName}</div>
                {!message.filePath && (message.message || message.content)}
                {fileComponent}
                <div className="receivedmessagetime">{formattedTime}</div>
            </div>
        </div>
    );
};
export default Message;