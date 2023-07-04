import React, { useState } from "react";
import axios from "axios";
import { AUTHORIZATION } from "../../apiEndpoints";
import { useNavigate } from "react-router-dom";
import "./auth.css"

const Authorization = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(AUTHORIZATION, formData);
            console.log(response.data);

            setFormData({
                username: '',
                password: ''
            });

            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            // alert('Authorization success!');
            navigate('/cabinet');
        } catch (error) {
            if (error.response.data) {
                const errorFields = Object.keys(error.response.data);

                errorFields.forEach((field) => {
                    const errorMessage = error.response.data[field];
                    alert(`${field}: ${errorMessage}`);
                });
            } else {
                console.log(error.response.data);
                alert(error.response.data);
            }
        }
    };

    const handleResetPassword = () => {
        navigate('/reset-password');
    };

    return (
        <div className="auth">
            <div className="auth-form">
                <h2>Авторизация</h2>
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
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Пароль"
                        />
                    </div>
                    <div>
                        <button type="submit">Войти</button>
                    </div>
                    <div>
                        <button className="forgotten" onClick={handleResetPassword}>
                            Забыли пароль?
                        </button></div>
                </form>
            </div>
        </div>
    );
};

export default Authorization;
