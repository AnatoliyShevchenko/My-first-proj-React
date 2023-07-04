import React, { useState } from "react";
import axios from "axios";
import { CHANGE_PASSWORD } from "../../apiEndpoints";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        old_password : '',
        new_password : ''
    }); 

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await axios.patch(CHANGE_PASSWORD, formData);
            console.log(response.data);

            setFormData({
                old_password: '',
                new_password: ''
              });
            
            alert('Success!');
            navigate('/auth');
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
        };
    };
    
    return(
        <div>
            <h2>Смена пароля</h2>
            <form onSubmit={handleSubmit}>
                <input
                  type="password"
                  name="old_password"
                  value={formData.old_password}
                  onChange={handleChange}
                  placeholder="старый пароль"
                />
                <input
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  placeholder="новый пароль"
                />
                <button type="submit">Change</button>
            </form>
        </div>
    );
};

export default ChangePassword;