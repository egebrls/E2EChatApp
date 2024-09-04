import { useState, useEffect } from "react";

const useGetGroupInfo = (id, refreshKey) => {
    const [loading, setLoading] = useState(false);
    const [groupInfo, setGroupInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/groupChat/info/${id}`, {
                    headers: {
                        "Cache-Control": "no-cache",
                        Pragma: "no-cache",
                        Expires: "0",
                    },
                });
                if (
                    !response.headers
                        .get("Content-Type")
                        .includes("application/json")
                ) {
                    setError(
                        "Expected JSON, but received " +
                            response.headers.get("Content-Type")
                    );
                    return;
                }

                const data = await response.json();

                if (response.ok) {
                    setGroupInfo(data);
                } else {
                    setError(data.error);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, refreshKey]);

    return { loading, groupInfo, error };
};

export default useGetGroupInfo;
