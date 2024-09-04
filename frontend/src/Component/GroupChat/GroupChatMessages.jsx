import React, { useState } from "react";
import useConversation from "../../zustand/useConversation";
import Message from "./Message";
import useGetGroupMessages from "../../hooks/useGetGroupMessages";
import useListenGroupMessages from "../../hooks/useListenGroupMessages"; // Import the hook
import Messages from "./Messages";

const GroupChatMessages = ({ groupId, userId }) => {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null); // Add this line
    const { groupMessages, loading } = useConversation(); // Get the groupMessages state from useConversation

    useGetGroupMessages(groupId); // Call the hook
    useListenGroupMessages(); // Call the hook

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData(); // Create a new FormData object
            formData.append("sender", userId);
            formData.append("content", message);
            if (file) {
                formData.append("file", file); // Add the file to the FormData object
            }

            const response = await fetch(`/api/groupChat/${groupId}`, {
                method: "POST",
                body: formData, // Send the FormData object
            });
            const data = await response.json();
            //console.log(data);
            setMessage("");
            setFile(null); // Reset the file state
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {/* Pass the groupMessages state as the messages prop */}
            <Messages messages={groupMessages} loading={loading} />

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here"
                />
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])} // Set the file state when a file is selected
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default GroupChatMessages;
