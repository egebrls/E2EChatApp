import React, { useState, useMemo } from "react";
import Select from "react-select";
import useGetGroupInfo from "../../hooks/useGetGroupInfo";
import useAddUserToGroupChat from "../../hooks/useAddUserToGroupChat";
import useRemoveUserFromGroupChat from "../../hooks/useRemoveUserFromGroupChat";
import useRemoveGroupChat from "../../hooks/useRemoveGroupChat";
import useGetConversations from "../../hooks/useGetConversations";
import "./GroupChat.css";
import { RefreshContext } from "../../context/RefreshContext";
import { useContext } from "react";
import { useEffect } from "react";

const GroupChatInfo = ({ conversation }) => {
    const { refreshKey, setRefreshKey } = useContext(RefreshContext);

    const {
        loading: groupLoading,
        groupInfo,
        error: groupError,
    } = useGetGroupInfo(
        conversation ? conversation._id : undefined,
        refreshKey
    );

    const {
        loading: usersLoading,
        conversations,
        error: usersError,
    } = useGetConversations(refreshKey);

    const authUser = JSON.parse(localStorage.getItem("authUser"));

    const isAdmin = groupInfo?.adminInfo.id === authUser._id;

    const { addUser: addUserToGroup } = useAddUserToGroupChat();
    const { removeUser: removeUserFromGroup } = useRemoveUserFromGroupChat();
    const { removeGroup: removeGroupChat } = useRemoveGroupChat();

    const [selectedUsersToRemove, setSelectedUsersToRemove] = useState([]);
    const [selectedUsersToAdd, setSelectedUsersToAdd] = useState([]);

    const [wantToLeave, setWantToLeave] = useState(false);

    const getAllUsersAndRemoveGroupUsers = (allUsers, groupUsers) => {
        //console.log("All users before filtering:", allUsers);
        //console.log("Group users:", groupUsers);
        const filteredUsers = allUsers.filter(
            (user) =>
                !groupUsers.find((groupUser) => groupUser._id === user._id)
        );
        //console.log("All users after filtering:", filteredUsers);
        return filteredUsers;
    };

    const allUsers = useMemo(() => {
        if (Array.isArray(conversations?.users) && groupInfo?.usersInfo) {
            const groupUsersWithCorrectId = groupInfo.usersInfo.map((user) => ({
                ...user,
                _id: user.id,
            }));
            const users = getAllUsersAndRemoveGroupUsers(
                conversations.users,
                groupUsersWithCorrectId
            ).map((user) => ({
                value: user._id,
                label: user.fullName,
            }));

            // Sort users by label (full name)
            users.sort((a, b) => a.label.localeCompare(b.label));

            return users;
        } else {
            return [];
        }
    }, [conversations, groupInfo]);

    useEffect(() => {
        if (wantToLeave && selectedUsersToRemove.length > 0) {
            handleRemoveUsers();
        }
    }, [wantToLeave, selectedUsersToRemove]);

    if (groupLoading || usersLoading || !groupInfo || !conversations) {
        return <div>Loading...</div>;
    }

    if (groupError || usersError) {
        return <div>Error: {groupError || usersError}</div>;
    }

    const handleLeaveGroup = async () => {
        setWantToLeave(true);
        setSelectedUsersToRemove([{ value: authUser._id }]);
        await handleRemoveUsers();
        window.location.reload();
    };

    const handleRemoveUsers = async () => {
        for (const user of selectedUsersToRemove) {
            await removeUserFromGroup(user.value, conversation._id);
        }
        if (!wantToLeave) setRefreshKey((prevKey) => prevKey + 1);
    };

    const handleAddUsers = async () => {
        for (const user of selectedUsersToAdd) {
            await addUserToGroup(user.value, conversation._id);
        }
        setRefreshKey((prevKey) => prevKey + 1);
    };

    const handleDeleteGroup = async () => {
        await removeGroupChat(conversation._id);
        window.location.reload();
    };

    //console.log("groupInfo:", groupInfo);
    //console.log("groupInfo.usersInfo:", groupInfo?.usersInfo);

    return (
        <div className="profile-border">
            <div className="groupprof1">{groupInfo?.name}</div>
            <div className="groupprof2">
                Group Admin: {groupInfo?.adminInfo.name}
            </div>

            <div>
                Members:{" "}
                {groupInfo?.usersInfo.map((user) => user.name).join(", ")}
            </div>
            {!isAdmin && (
                <button
                    className="remove-button"
                    //style={{ marginTop: "220px" }}
                    onClick={handleLeaveGroup}
                >
                    Leave Group
                </button>
            )}
            {isAdmin && (
                <>
                    <Select
                        className="groupprof3"
                        options={groupInfo?.usersInfo
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((user) => ({
                                value: user.id,
                                label: user.name,
                            }))}
                        isMulti
                        onChange={setSelectedUsersToRemove}
                    />
                    <button
                        className="remove-button"
                        onClick={handleRemoveUsers}
                    >
                        Remove Members
                    </button>
                    <Select
                        className="groupprof3"
                        options={allUsers}
                        isMulti
                        onChange={setSelectedUsersToAdd}
                    />
                    <button className="add-button" onClick={handleAddUsers}>
                        Add Members
                    </button>
                    <button
                        className="remove-button"
                        //style={{ marginTop: "220px" }}
                        onClick={handleDeleteGroup}
                    >
                        Delete Group
                    </button>
                </>
            )}
        </div>
    );
};

export default GroupChatInfo;
