import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useProfileData = () => {
    const { authUser } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({});

    const fetchProfileData = useCallback(async () => {
        if (!authUser?.userName) {
            toast.error("User is not authenticated");
            return;
        }
        if (Object.keys(profileData).length === 0) {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/auth/profile/${authUser.userName}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!response.ok) {
                    console.error("Error with fetch:", response.statusText);
                    return;
                }

                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                if (JSON.stringify(data) !== JSON.stringify(profileData)) {
                    setProfileData(data);
                }
            } catch (error) {
                console.error("Error in fetchProfileData:", error);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }
    }, [authUser, profileData]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData, authUser]);

    return { loading, profileData, fetchProfileData };
};

export default useProfileData;
