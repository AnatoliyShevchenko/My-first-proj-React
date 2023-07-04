import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASKET, HOST } from "../../apiEndpoints";
import { addTokenToHeader } from "../Utils/utils";
import { Navigate, useNavigate } from "react-router-dom";
import './basket.css'

const Basket = () => {
    const [items, setItems] = useState({});
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("access");

    useEffect(() => {
        const fetchData = async () => {
            try {
                addTokenToHeader(isAuthenticated);
                const response = await axios.get(BASKET);
                setItems(response.data);
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    if (!isAuthenticated) {
        return <Navigate to="/auth" />;;
    }

    const handleCatalogClick = () => {
        navigate('/');
    };

    const handleLogoutClick = () => {
        navigate('/logout');
    };

    const handleCabinetClick = () => {
        navigate('/cabinet');
    };

    const handleItemClick = async (item) => {
        navigate(`/${item}`);
    };

    const handleAddBasket = async (item) => {
        try {
            addTokenToHeader(isAuthenticated);
            await axios.put(BASKET,
                { skin_id: item.id }
            );
            window.location.reload();
        } catch (error) {
            console.log(error);
            alert('Произошла ошибка при добавлении товара в корзину');
        }
    };

    const handleDecreaseBasket = async (item) => {
        try {
            addTokenToHeader(isAuthenticated);
            await axios.patch(BASKET, {
                skin_id: item.id,
                action: "decrease"
            }
            );
            window.location.reload();
        } catch (error) {
            console.log(error);
            alert('Произошла ошибка');
        }
    };

    const handleRemoveBasket = async (item) => {
        try {
            addTokenToHeader(isAuthenticated);
            await axios.patch(BASKET, {
                skin_id: item.id,
                action: "remove"
            }
            );
            window.location.reload();
        } catch (error) {
            console.log(error);
            alert('Произошла ошибка');
        }
    };

    const handleClearBasket = async () => {
        addTokenToHeader(isAuthenticated);
        await axios.delete(BASKET);
        window.location.reload();
    };

    const handleBuyBasket = async () => {
        try {
            addTokenToHeader(isAuthenticated);
            await axios.post(BASKET);
            alert('Поздравляем с покупкой!');
        } catch (error) {
            alert('У вас не хватает денег, пополните кошелек в личном кабинете');
        }
    }

    return (
        <div className="basket-view">
            <div className="basket-header">
                <button className="basket-fill-header" onClick={handleCatalogClick}>Catalog</button>
                <button className="basket-fill-header" onClick={handleCabinetClick}>Personal Cabinet</button>
                <button className="basket-fill-header" onClick={handleLogoutClick}>Logout</button>
            </div>
            <div className="basket-main">
                {items.recommended ? (
                    <div className="recommended">
                        <div className="message">Your basket is empty, look this skins:</div>
                        <div className="rec-items">
                            {items.recommended.map((item) => (
                                <div key={item.id} className="item-block" onClick={() => handleItemClick(item.id)}>
                                    <div>
                                        <img src={HOST + item.image} alt={item.title} />
                                    </div>
                                    <div className="item-title">{item.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="loading">Loading...</p>
                )}
                {items.basket ? (
                    <div className="user-basket">
                        <div className="all-items">
                            {items.basket.basket_items.map((item) => (
                                <div key={item.skin.id} className="every-item">
                                    <div>
                                        <img src={HOST + item.skin.image} alt={item.title} />
                                    </div>
                                    <div className="item-info">
                                        <h3>Title: {item.skin.title}</h3>
                                        <h3>Name: {item.skin.name}</h3>
                                        <p>Category: {item.skin.grade}</p>
                                        <p>Rating: {item.skin.rating}</p>
                                    </div>
                                    <div className="item-money">
                                        <div className="empty-div"></div>
                                        <div className="full-div">
                                            <div>
                                                <button onClick={() => handleRemoveBasket(item.skin)}>X</button>
                                            </div>
                                            <div>Price: {item.price}</div>
                                            <div className="add-remove">
                                                <button onClick={() => handleDecreaseBasket(item.skin)}>-</button>
                                                {item.quantity}
                                                <button onClick={() => handleAddBasket(item.skin)}>+</button>
                                            </div>
                                            <div>
                                                <h3>Total Price: {item.totalPrice}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="buy-or-remove">
                            <div>
                                <button onClick={() => handleClearBasket()}>Очистить корзину</button>
                            </div>
                            <div>
                                <button onClick={() => handleBuyBasket()}>Купить</button>
                            </div>
                            <div>
                                <h1>Итого: {items.basket.total_price}</h1>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="loading">Loading...</p>
                )}
            </div>
            <div className="basket-footer">
                <div className="basket-fill-footer">Some...</div>
                <div className="basket-fill-footer">Some...</div>
                <div className="basket-fill-footer">Some...</div>
            </div>
        </div >
    );

};

export default Basket;