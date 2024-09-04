import { useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    const sendMessage = async (message, file) => {
        setLoading(true);
        try {
            const formData = new FormData(); // create a new FormData object
            formData.append("message", message); // append the message
            if (file) {
                formData.append("file", file); // append the file if it exists
            }

            const res = await fetch(
                `/api/messages/send/${selectedConversation._id}`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            setMessages([...messages, data]);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading };
};
export default useSendMessage;
