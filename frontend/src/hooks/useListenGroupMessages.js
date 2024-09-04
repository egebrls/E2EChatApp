import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import { useEffect } from "react";
import notificationSound from "../assets/sounds/notification.mp3";
import notificationSoundInChat from "../assets/sounds/notificationinchat.mp3";
import { toast } from "react-hot-toast";

const useListenGroupMessages = () => {
    const { socket, userId } = useSocketContext(); // Get the current user's ID
    const { groupMessages, setGroupMessages, selectedConversation } =
        useConversation();
    const numMessages = groupMessages.length;

    useEffect(() => {
        socket?.on("newGroupMessage", (decryptedMessage) => {
            if (
                decryptedMessage.sender !== userId &&
                selectedConversation?._id !== decryptedMessage.groupId
            ) {
                // Check if the sender is not the current user and the selected group is not the group of the incoming message
                const sound = new Audio(notificationSound);
                sound.play();
                /* toast(
                    `New message in ${decryptedMessage.groupName} from ${decryptedMessage.senderName}`,
                    {
                        duration: 7000,
                    }
                ); */
            }
            if (selectedConversation?._id === decryptedMessage.groupId) {
                // Check if the groupId of the message matches the selected group
                if (decryptedMessage.sender !== userId) {
                    // If the sender is not the current user, play the in-chat notification sound
                    const sound = new Audio(notificationSoundInChat);
                    sound.play();
                }
                setGroupMessages([...groupMessages, decryptedMessage]);
            }
        });

        return () => {
            socket?.off("newGroupMessage");
        };
    }, [socket, numMessages, userId, selectedConversation]); // Add selectedConversation to the dependency array

    return { groupMessages };
};

export default useListenGroupMessages;
