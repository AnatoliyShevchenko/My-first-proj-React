import React, { useState } from "react"; //это мы импортируем React для создания компонента и useState для управления состоянием
import axios from "axios"; //это мы импортируем для того чтобы посылать запросы
import { REGISTRATION } from "../../apiEndpoints"; //внезапно, это наш эндпоинт
import { useNavigate } from "react-router-dom";
import "./reg.css"

const Registration = () => { //создаем компонент регистрации
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ //используем useState для управления состоянием формы
        username: '',
        email: '',
        password: ''
    }); //создаем состояние которое хранит данные формы

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }; //обновляет состояние формы при наверное заполнении полей

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(REGISTRATION, formData); //посылаем ПОСТ запрос
            console.log(response.data); //выводим полученные данные в консоль

            setFormData({
                username: '',
                email: '',
                password: ''
            }); //очищаем форму после успешной регистрации

            alert('Поздравляем с регистрацией, вам выслано письмо со ссылкой активации аккаунта'); //выводим сообщение об успехе
        } catch (error) {
            if (error.response.data) {
                const errorFields = Object.keys(error.response.data);

                errorFields.forEach((field) => {
                    const errorMessage = error.response.data[field];
                    alert(`${field}: ${errorMessage}`);
                });
            } else {
                console.log(error.response.data);
                alert(error.response.data); //выводим ошибку
            }
        }
    };

    return (
        <div className="registration-page">
            <div className="block-form">
                <h2>Регистрация</h2>
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
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Электронная почта"
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
                    <button type="submit">Зарегистрироваться</button>
                </form>
            </div>
        </div>
    );
};

export default Registration;
