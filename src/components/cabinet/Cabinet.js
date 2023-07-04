import React, { useEffect, useState } from "react";
import axios from "axios";
import { PER_CAB, FRIENDS, COLLECTION, HOST, INVITES } from "../../apiEndpoints";
import { addTokenToHeader } from "../Utils/utils";
import { Navigate, useNavigate } from "react-router-dom";
import "./cabinet.css";

const Cabinet = () => {
    const [userData, setUserData] = useState({});
    const [friendsData, setFriendsData] = useState([]);
    const [invitesData, setInvitesData] = useState({});
    const [collectionData, setCollectionData] = useState([]);
    const [editedFirstName, setEditedFirstName] = useState("");
    const [editedLastName, setEditedLastName] = useState("");
    const [friendUsername, setFriendUsername] = useState('');
    const navigate = useNavigate();

    const isAuthenticated = localStorage.getItem("access");

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!isAuthenticated) {
                    return;
                }
                addTokenToHeader(isAuthenticated);
                const userDataResponse = await axios.get(PER_CAB);
                const friendsDataResponse = await axios.get(FRIENDS);
                const collectionDataResponse = await axios.get(COLLECTION);
                const invitesDataResponse = await axios.get(INVITES);
                setUserData(userDataResponse.data.user);
                setEditedFirstName(userDataResponse.data.user.first_name);
                setEditedLastName(userDataResponse.data.user.last_name);
                setFriendsData(friendsDataResponse.data.items.friends);
                setCollectionData(collectionDataResponse.data.items);
                setInvitesData(invitesDataResponse.data.items);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [isAuthenticated]);

    const handleSaveChanges = async () => {
        try {
            addTokenToHeader(isAuthenticated);
            await axios.patch(PER_CAB, {
                "first_name": `${editedFirstName}`,
                "last_name": `${editedLastName}`,
            });
            alert("Changes saved successfully!");
            window.location.reload();
        } catch (error) {
            console.log(error);
            alert("Failed to save changes. Please try again.");
        }
    };

    if (!isAuthenticated) {
        return <Navigate to="/auth" />;;
    }

    const handleAddPhoto = async () => {
        try {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.addEventListener('change', async (event) => {
                const file = event.target.files[0];
                if (file) {
                    // Создать объект формы данных
                    const formData = new FormData();
                    formData.append('photo', file);

                    addTokenToHeader(isAuthenticated);
                    const response = await axios.patch(PER_CAB, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    setUserData((prevUserData) => ({
                        ...prevUserData,
                        photo: response.data.photoUrl,
                    }));
                }
            });
            fileInput.click();
        } catch (error) {
            console.log(error);
        }
    };

    const handleArtMoney = () => {
        window.open("http://34.78.241.147/api/v1/art-money/", "_blank");
    };

    const handleCatalogClick = () => {
        navigate('/');
    };

    const handleBasketClick = () => {
        navigate('/basket');
    };

    const handleLogoutClick = () => {
        navigate('/logout');
    };

    const handleRemoveAccont = async () => {
        addTokenToHeader(isAuthenticated);
        await axios.delete(PER_CAB);
        navigate('/registration');
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    const handleInvite = async (value, username) => {
        await axios.patch(INVITES, {
            username: username,
            action: value,
        });
        window.location.reload();
    };

    const handleFindFriend = async () => {
        try {
            addTokenToHeader(isAuthenticated);
            const response = await axios.post(INVITES, {
                username: friendUsername
            });
            setFriendUsername('');
            alert(response.data.success.message);
        } catch (error) {
            if (error.response.data.error === 'user does not exist') {
                alert('user does not exist');
            } else {
                console.error('Failed to send friend invite:', error);
                alert('Invite already exist')
            }
        }
    };

    const handleKickFriend = async (friend) => {
        if (friend && friend.id) {
          addTokenToHeader(isAuthenticated);
          await axios.delete(FRIENDS, {
            data: { friend_id: friend.id }
          });
          alert('Друг удален!');
          window.location.reload();
        } else {
          alert('Неверный идентификатор друга');
        }
      };

    return (
        <div className="my-cabinet">
            <div className="cabinet-header">
                <button className="cabinet-fill-header" onClick={handleCatalogClick}>Catalog</button>
                <button className="cabinet-fill-header" onClick={handleBasketClick}>Basket</button>
                <button className="cabinet-fill-header" onClick={handleLogoutClick}>Logout</button>
            </div>
            <div className="cabinet-main">
                <div className="cabinet-user-info">
                    <h2>User info</h2>
                    <div className="photo-container">
                        {userData?.photo ? (
                            <img className="user-photo" src={HOST + userData.photo} alt="User Photo" />
                        ) : (
                            <button className="add-photo-btn" onClick={handleAddPhoto}>Add Photo</button>
                        )}
                    </div>
                    <div>First Name:
                        {editedFirstName !== null ? (
                            <input
                                type="text"
                                value={editedFirstName}
                                onChange={(e) => setEditedFirstName(e.target.value)}
                            />
                        ) : (
                            <span>{userData?.first_name}</span>
                        )}
                    </div>
                    <div>Last Name:
                        {editedLastName !== null ? (
                            <input
                                type="text"
                                value={editedLastName}
                                onChange={(e) => setEditedLastName(e.target.value)}
                            />
                        ) : (
                            <span>{userData?.last_name}</span>
                        )}
                    </div>
                    <div>Email: {userData?.email}</div>
                    <div>Username: {userData?.username}</div>
                    <div>Cash: {userData?.cash}</div>
                    <div className="personal-info-buttons">
                        {editedFirstName !== null && editedLastName !== null && (
                            <button className="save-changes-btn" onClick={handleSaveChanges}>
                                Сохранить изменения
                            </button>
                        )}
                        <button className="art-money" onClick={handleArtMoney}>
                            Пополнить кошелек (не работает)
                        </button>
                        <button className="remove-account" onClick={handleRemoveAccont}>
                            Удалить аккаунт
                        </button>
                        <button className="change-password" onClick={handleChangePassword}>
                            Изменить пароль
                        </button>
                    </div>
                </div>
                <div className="cabinet-friends">
                    <div>
                        <h2>Search friends</h2>
                        <div>
                            Enter friend username:
                            <input
                                type="text"
                                placeholder="Brick92"
                                value={friendUsername}
                                onChange={(e) => setFriendUsername(e.target.value)}
                            />
                            <button className="invite-actions" onClick={handleFindFriend}>
                                Пригласить
                            </button>
                        </div>
                    </div>
                    <div>
                        <h2>Friend Invitations</h2>
                        {invitesData && invitesData.length > 0 ? (
                            <ul>
                                {invitesData.map((invite) => (
                                    <li key={invite.id}>
                                        <div>From: {invite.from_user.username}</div>
                                        <button className="invite-actions" onClick={() => handleInvite("accept", invite.from_user.username)}>accept</button>
                                        <button className="invite-actions" onClick={() => handleInvite("reject", invite.from_user.username)}>reject</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No friend invitations</p>
                        )}
                    </div>
                    <div>
                        <h2>Friends</h2>
                        {Array.isArray(friendsData) &&
                            friendsData.map((friend) => (
                                <div key={friend.username}>
                                    <div>{friend.username}</div>
                                    <div className="photo-container">
                                        <img
                                            className="user-photo"
                                            src={HOST + friend.photo}
                                            alt="User Photo"
                                        />
                                    </div>
                                    <div>{friend.id} {friend.first_name} {friend.last_name}</div>
                                    <button className="invite-actions" onClick={() => handleKickFriend(friend)}>Удалить</button>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="cabinet-collection">
                    <h2>Collection</h2>
                    {Array.isArray(collectionData) && collectionData.map((item) => (
                        <div key={item.skin.id}>
                            <img src={HOST + item.skin.icon} alt={item.skin.name} />
                            <div>{item.skin.name}</div>
                            <div>Quantity: {item.quantity}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="cabinet-footer">
                <div className="cabinet-fill-footer">Some...</div>
                <div className="cabinet-fill-footer">Some...</div>
                <div className="cabinet-fill-footer">Some...</div>
            </div>
        </div >
    );
};

export default Cabinet;