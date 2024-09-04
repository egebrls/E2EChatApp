import { createContext, useContext, useState } from "react";

export const RegisterContext = createContext();

export const useRegisterContext = () => {
    return useContext(RegisterContext);
};

export const RegisterContextProvider = ({ children }) => {
    const [regUser, setRegUser] = useState(
        JSON.parse(localStorage.getItem("regUser")) || null
    );

    return (
        <RegisterContext.Provider value={{ regUser, setRegUser }}>
            {children}
        </RegisterContext.Provider>
    );
};
