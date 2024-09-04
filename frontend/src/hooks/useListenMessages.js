import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import { useEffect } from "react";
import notificationSound from "../assets/sounds/notification.mp3";
import notificationSoundInChat from "../assets/sounds/notificationinchat.mp3";
import { toast } from "react-hot-toast";

const useListenMessages = () => {
    const { socket, userId } = useSocketContext(); // Get the current user's ID
    const { messages, setMessages, selectedConversation } = useConversation();

    useEffect(() => {
        socket?.on("newMessage", (decryptedMessage) => {
            if (
                selectedConversation?._id === decryptedMessage.senderId &&
                decryptedMessage.sender !== userId
            ) {
                // Check if the conversationId of the message matches the selected conversation and the sender is not the current user
                const sound = new Audio(notificationSoundInChat);
                sound.play();
                setMessages([...messages, decryptedMessage]);
            } else if (decryptedMessage.sender !== userId) {
                // Check if the sender is not the current user
                const sound = new Audio(notificationSound);
                sound.play();
                /* toast(`New message from ${decryptedMessage.senderName}`, {
                    duration: 7000,
                }); */
            }
        });

        return () => {
            socket?.off("newMessage");
        };
    }, [socket, messages, setMessages, userId, selectedConversation]); // Add userId and selectedConversation to the dependency array
};

export default useListenMessages;
