import React, { useState, useEffect } from "react";
import Select from "react-select";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";

const SearchInput = () => {
    const { selectedConversation, setSelectedConversation } = useConversation();
    const { conversations } = useGetConversations();
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (selectedConversation) {
            setSelectedOption(null);
        }
    }, [selectedConversation]);

    const sortedGroupChats = [...(conversations?.groupChats || [])].sort((a, b) => a.name.localeCompare(b.name));
    const sortedUsers = [...(conversations?.users || [])].sort((a, b) => a.fullName.localeCompare(b.fullName));

    const options = [
        ...sortedGroupChats.map((group) => ({
            value: group,
            label: group.name,
            isGroup: true,
        })),
        ...sortedUsers.map((user) => ({
            value: user,
            label: user.fullName,
            isGroup: false,
        })),
    ];

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        const updatedConversation = {
            ...selectedOption.value,
            isGroup: selectedOption.isGroup,
        };
        setSelectedConversation(updatedConversation);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedOption) return;
        if (selectedOption.label.length < 3) {
            return toast.error("Search query must be at least 3 characters");
        }
    };

    return (
        <form onSubmit={handleSubmit} >
            <Select
                value={selectedOption}
                onChange={handleChange}
                options={options}
                className="search2"
                placeholder="Search..."
                isSearchable
            />
        </form>
    );
};

export default SearchInput;