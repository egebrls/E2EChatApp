import { useCallback, useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';

function useResendEmail() {
    const { authUser } = useAuthContext();
    const [lastClicked, setLastClicked] = useState(null);
    const [loading, setLoading] = useState(false);
    const [disableResend, setDisableResend] = useState(false);

    const resendEmail = useCallback(async () => {
        setLoading(true);
        setDisableResend(true);
        if (loading) {
            console.log('Loading user data...');
            return;
        }

        const now = Date.now();
        const tenSeconds = 5 * 1000; // 10 seconds in milliseconds
        if (lastClicked && now - lastClicked < tenSeconds) {
            console.log('Please wait for 10 seconds between each click');
            setDisableResend(true);
            return;
        }

       
        
        const authUser = JSON.parse(localStorage.getItem('authUser'));
        const email = authUser ? authUser.email : null;
        try {
            const response = await fetch('api/auth/resendemail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Error resending email');
            }

            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error:', error);
        }
        finally {
            setLoading(false);
        }

        // Update the last clicked time and store it in local storage
        setLastClicked(now);
        localStorage.setItem('lastClickedTimestamp', now.toString());
    }, [lastClicked, loading]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const lastClickedTimestamp = localStorage.getItem('lastClickedTimestamp');
            if (lastClickedTimestamp) {
                const now = Date.now();
                const tenSeconds = 5 * 1000; // 10 seconds in milliseconds
                setDisableResend(now - parseInt(lastClickedTimestamp) < tenSeconds);
            }
        }, 1); // Check every second
    
        // Clear the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, []); // Run this effect once when the component mounts


    return { resendEmail, loading, disableResend };
}

export default useResendEmail;