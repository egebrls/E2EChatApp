import { useState } from "react";

export const useRemoveGroupChat = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const removeGroup = async (groupId) => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/groupChat/removeGroup/${groupId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Error removing group chat");
            }

            const data = await response.json();
            setLoading(false);
            return data;
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return { removeGroup, loading, error };
};

export default useRemoveGroupChat;
