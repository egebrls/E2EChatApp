import React, { useEffect, useState } from "react";
import { extractTime } from "../../../backend/utils/extractTime";
import useConversation from "../zustand/useConversation";
import { useSocketContext } from "../context/SocketContext";
import "../Component/Notifications.css";
import { FaRegBell } from "react-icons/fa6";
import { FaTrashCan } from "react-icons/fa6";
import useGetConversations from "./useGetConversations";

function Notifications() {
    const { socket, userId } = useSocketContext();
    const [isActive, setIsActive] = useState(false);
    const { conversations } = useGetConversations();
    const [isLoading, setIsLoading] = useState(!userId);
    const [notifications, setNotifications] = useState([]);
    const [latestNotifications, setLatestNotifications] = useState({});
    const { selectedConversation, setSelectedConversation } = useConversation();

    const toggleDropdown = () => {
        setIsActive(!isActive);
    };
    useEffect(() => {
        if (!userId) return;

        const fetchNotifications = async () => {
            try {
                const response = await fetch(`/api/notifications/${userId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await response.json();
                setNotifications(data);
                setIsLoading(false);

                // Populate latestNotifications state
                const latestNotifications = {};
                data.forEach((notification) => {
                    if (notification.groupChat) {
                        latestNotifications[
                            `${notification.groupChat}-${notification.senderId}`
                        ] = notification;
                    } else {
                        latestNotifications[notification.senderId] =
                            notification;
                    }
                });
                setLatestNotifications(latestNotifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, [userId]);
    useEffect(() => {
        if (notifications.length === 0) {
            setIsActive(false);
        }
    }, [notifications]);

    useEffect(() => {
        if (!socket || isLoading) return;

        socket.emit("userConnected", userId);

        socket.on("newNotification", function (notification) {
            //console.log("Received newNotification event", notification);
            setNotifications((prevNotifications) => [
                ...prevNotifications,
                notification,
            ]);

            setLatestNotifications((prevLatestNotifications) => ({
                ...prevLatestNotifications,
                [notification.senderId]: notification,
            }));
        });

        socket.on("newGroupNotification", function (notification) {
            //console.log("Received newGroupNotification event", notification);
            setNotifications((prevNotifications) => [
                ...prevNotifications,
                notification,
            ]);

            setLatestNotifications((prevLatestNotifications) => ({
                ...prevLatestNotifications,
                [`${notification.groupChat}-${notification.senderId}`]:
                    notification,
            }));
        });

        return () => {
            socket.off("newNotification");
            socket.off("newGroupNotification");
        };
    }, [userId, socket, isLoading]);

    useEffect(() => {
        if (selectedConversation) {
            notifications.forEach((notification) => {
                if (
                    notification.senderId === selectedConversation._id &&
                    !notification.groupChat
                ) {
                    handleMarkAsSeen(notification._id);
                }

                if (
                    notification.groupChat &&
                    notification.groupChat === selectedConversation._id
                ) {
                    handleMarkAsSeen(notification._id);
                }
            });
        }
    }, [selectedConversation, notifications]);

    const handleMarkAsSeenButton = async (_id) => {
        const notification = notifications.find(
            (notification) => notification._id === _id
        );

        if (!notification) {
            console.error(`No notification found with _id: ${_id}`);
            return;
        }

        // Optimistically update state
        setNotifications((prevNotifications) =>
            prevNotifications.filter(
                (oldNotification) =>
                    !(
                        oldNotification.senderId === notification.senderId &&
                        oldNotification.groupChat === notification.groupChat
                    )
            )
        );

        try {
            // Mark all notifications from the same sender and group as seen
            notifications.forEach((oldNotification) => {
                if (
                    oldNotification.senderId === notification.senderId &&
                    oldNotification.groupChat === notification.groupChat
                ) {
                    handleMarkAsSeen(oldNotification._id);
                }
            });

            // Update latestNotifications state
            setLatestNotifications((prevLatestNotifications) => {
                const updatedNotifications = { ...prevLatestNotifications };

                if (notification.groupChat) {
                    delete updatedNotifications[
                        `${notification.groupChat}-${notification.senderId}`
                    ];
                } else {
                    delete updatedNotifications[notification.senderId];
                }

                return updatedNotifications;
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAsSeen = async (_id) => {
        const notification = notifications.find(
            (notification) => notification._id === _id
        );

        if (!notification) {
            return;
        }
        const notificationKey = notification.groupChat
            ? `${notification.groupChat}-${notification.senderId}`
            : notification.senderId;
        if (!latestNotifications[notificationKey]) {
            return;
        }

        try {
            const response = await fetch(`/api/notifications/${_id}/seen`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Error marking notification as seen");
            }

            setNotifications((prevNotifications) =>
                prevNotifications.filter(
                    (notification) =>
                        !(
                            notification._id === _id &&
                            ((notification.senderId ===
                                selectedConversation._id &&
                                !notification.groupChat) ||
                                notification.groupChat ===
                                    selectedConversation._id)
                        )
                )
            );

            // Update latestNotifications state
            setLatestNotifications((prevLatestNotifications) => {
                const updatedNotifications = { ...prevLatestNotifications };
                const notification = notifications.find(
                    (notification) => notification._id === _id
                );

                if (notification) {
                    if (notification.groupChat) {
                        delete updatedNotifications[
                            `${notification.groupChat}-${notification.senderId}`
                        ];
                    } else {
                        delete updatedNotifications[notification.senderId];
                    }
                }

                return updatedNotifications;
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    let shouldShowBell = false;
    if (notifications.length > 0) {
        if (!selectedConversation) {
            shouldShowBell = true;
        } else {
            const filteredNotifications = notifications.filter(
                (notification) =>
                    !(
                        notification._id === notification._id &&
                        ((notification.senderId === selectedConversation._id &&
                            !notification.groupChat) ||
                            notification.groupChat === selectedConversation._id)
                    )
            );

            shouldShowBell = filteredNotifications.length > 0;
        }
    }

    return (
        <div className={`dropdown ${isActive ? "active" : ""}`}>
            {shouldShowBell && (
                <div className="animated-button">
                    <button className="dropbtn" onClick={toggleDropdown}>
                        <FaRegBell />
                    </button>
                </div>
            )}
            <div className="dropdown-content">
                {Object.values(latestNotifications).map((notification) => (
                    <div key={notification._id}>
                        <div className="notification-content">
                            <a
                                onClick={() => {
                                    let conversation;
                                    if (notification.groupChat) {
                                        conversation =
                                            conversations.groupChats.find(
                                                (groupChat) =>
                                                    groupChat._id ===
                                                    notification.groupChat
                                            );
                                    } else {
                                        conversation = conversations.users.find(
                                            (user) =>
                                                user._id ===
                                                notification.senderId
                                        );
                                    }
                                    setSelectedConversation({
                                        ...conversation,
                                        isGroup: !!notification.groupChat,
                                    });
                                }}
                            >
                                {notification.message}
                            </a>
                            <span className="">
                                {extractTime(notification.timestamp)}
                            </span>
                            <button
                                onClick={() =>
                                    handleMarkAsSeenButton(notification._id)
                                }
                                className="close-notifi"
                            >
                                <FaTrashCan />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Notifications;
