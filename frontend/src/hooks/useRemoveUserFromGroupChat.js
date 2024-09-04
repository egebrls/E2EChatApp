import { useState } from "react";

export const useRemoveUserFromGroupChat = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const removeUser = async (userId, groupId) => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/groupChat/removeUser/${groupId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId }),
                }
            );

            if (!response.ok) {
                throw new Error("Error removing user from group chat");
            }

            const data = await response.json();
            setLoading(false);
            return data;
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return { removeUser, loading, error };
};

export default useRemoveUserFromGroupChat;
