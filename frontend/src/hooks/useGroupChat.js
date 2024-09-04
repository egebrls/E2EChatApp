import { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";

const useGroupChat = () => {
    const [groupChats, setGroupChats] = useState([]);
    const { authUser } = useAuthContext();

    const createGroupChat = async (name, users, callback) => {
        try {
            const response = await fetch("/api/groupChat/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    adminId: authUser._id,
                    name,
                    users,
                }),
            });

            if (!response.ok) {
                const responseBody = await response.json();
                throw new Error(
                    `HTTP error! status: ${
                        response.status
                    }, body: ${JSON.stringify(responseBody)}`
                );
            }

            const data = await response.json();
            //console.log("Group chat created:", data); // Log the response data
            setGroupChats((prevGroupChats) => [...prevGroupChats, data]);

            if (callback) {
                callback();
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const addUserToGroupChat = async (id, userId) => {
        try {
            const response = await fetch(`/api/groupChat/addUser/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });
            const data = await response.json();
            // Handle response here
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const removeUserFromGroupChat = async (id, userId) => {
        try {
            const response = await fetch(`/api/groupChat/removeUser/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });
            const data = await response.json();
            // Handle response here
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const sendMessageInGroupChat = async (id, sender, content) => {
        try {
            const response = await fetch(`/api/groupChat/sendMessage/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sender, content }),
            });
            const data = await response.json();
            // Handle response here
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const removeGroupChat = async (id) => {
        try {
            const response = await fetch(`/api/groupChat/removeGroup/${id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            // Handle response here
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return {
        createGroupChat,
        addUserToGroupChat,
        removeUserFromGroupChat,
        sendMessageInGroupChat,
        removeGroupChat,
    };
};

export default useGroupChat;
