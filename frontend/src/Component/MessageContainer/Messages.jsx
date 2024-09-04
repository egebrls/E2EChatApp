import React, { useEffect, useRef, useState } from "react";
import "./MessageContainer.css";
import Message from "../MessageContainer/Message";
import useGetMessages from "../../hooks/useGetMessages";
import useGetGroupMessages from "../../hooks/useGetGroupMessages";
import { CiLock } from "react-icons/ci";

const Messages = ({ groupId }) => {
    let messagesData;

    if (groupId) {
        let { groupMessages } = useGetGroupMessages(groupId);
        messagesData = groupMessages;
    } else {
        let { messages } = useGetMessages();
        messagesData = messages;
    }

    let messages = Array.isArray(messagesData) ? messagesData : [messagesData];

    const lastMessageRef = useRef();
    const [messageListVersion, setMessageListVersion] = useState(0);

    useEffect(() => {
        setMessageListVersion((prevVersion) => prevVersion + 1);
    }, [messages]);

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messageListVersion]);

    return (
        <div className="messages1">
            <div className="notif">
                <CiLock />
                Messages are end to end encrypted. No one outside of this chat
                can read them, not even Chatcrypt.
            </div>
            <br></br>
            {messages &&
                messages.map((message, index) => {
                    const isLastMessage = index === messages.length - 1;
                    return (
                        <div
                            key={index}
                            ref={isLastMessage ? lastMessageRef : null}
                        >
                            <Message message={message} />
                        </div>
                    );
                })}
        </div>
    );
};

export default Messages;
