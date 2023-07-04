import React, { useState } from "react";
import axios from "axios";
import { RESET_PASSWORD } from "../../apiEndpoints";
import { useNavigate } from "react-router-dom";
import "./reset.css"

const ResetPassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(RESET_PASSWORD, formData);
            console.log(response.data);

            setFormData({
                username: '',
                email: ''
            });

            alert(response.data.success.message);
            navigate('/auth');
        } catch (error) {
            if (error.response.data.error.email) {
                const errorFields = Object.keys(error.response.data.error);

                errorFields.forEach((field) => {
                    const errorMessage = error.response.data.error[field];
                    alert(`${field}: ${errorMessage}`);
                });
            } else {
                alert(error.response.data.error);
            }
        }
    };

    return (
        <div className="reset-page">
            <div className="reset-form">
                <h2>Сброс пароля</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Имя пользователя"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Почта"
                        />
                    </div>
                    <button type="submit">Сбросить</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;