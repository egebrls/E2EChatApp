import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";

const useGetGroupMessages = (groupId) => {
    const [loading, setLoading] = useState(false);
    const { groupMessages, setGroupMessages } = useConversation();

    useEffect(() => {
        let isMounted = true; // Flag to check if component is still mounted

        const getGroupMessages = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `/api/groupChat/getMessages/${groupId}`,
                    {
                        headers: {
                            "Cache-Control": "no-cache",
                            Pragma: "no-cache",
                            Expires: "0",
                        },
                    }
                );
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                if (isMounted) {
                    setGroupMessages(data);
                }
            } catch (error) {
                if (isMounted) {
                    toast.error(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        if (groupId) {
            setGroupMessages([]); // Clear the groupMessages state
            getGroupMessages();
        }

        // Clear the isMounted flag when the component is unmounted or groupId changes
        return () => {
            isMounted = false;
        };
    }, [groupId, setGroupMessages]);

    return { groupMessages, loading };
};

export default useGetGroupMessages;
