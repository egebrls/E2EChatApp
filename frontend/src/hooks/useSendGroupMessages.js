import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import useConversation from "../zustand/useConversation";

const useSendGroupMessage = () => {
    const [loading, setLoading] = useState(false);
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();

    const sendGroupMessage = async (groupId, message, file) => {
        // Add a new parameter for the file
        setLoading(true);
        try {
            const formData = new FormData(); // Create a new FormData object
            formData.append("sender", authUser._id);
            formData.append("content", message);
            if (file) {
                formData.append("file", file); // Add the file to the FormData object
            }

            const response = await fetch(
                `/api/groupChat/sendMessage/${groupId}`,
                {
                    method: "POST",
                    body: formData, // Send the FormData object
                }
            );
            const data = await response.json();
        } catch (error) {
            console.error("Error in sendGroupMessage:", error);
        } finally {
            setLoading(false);
        }
    };

    return { loading, sendGroupMessage };
};

export default useSendGroupMessage;
