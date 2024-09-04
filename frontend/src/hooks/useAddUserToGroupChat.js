import { useState } from "react";

export const useAddUserToGroupChat = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addUser = async (userId, groupId) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/groupChat/addUser/${groupId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error("Error adding user to group chat");
            }

            const data = await response.json();
            setLoading(false);
            return data;
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return { addUser, loading, error };
};

export default useAddUserToGroupChat;
