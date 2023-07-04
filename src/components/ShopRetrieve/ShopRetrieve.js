import React, { useEffect, useState } from "react";
import axios from "axios";
import { SKINS, REVIEWS, HOST, BASKET } from "../../apiEndpoints";
import { addTokenToHeader } from "../Utils/utils";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import './retrieve.css'

const ItemDetailPage = () => {
    const itemId = useParams();
    const [item, setItem] = useState(null);
    const [reviews, setReviews] = useState({});
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("access");

    useEffect(() => {
        const fetchItem = async () => {
            try {
                addTokenToHeader(isAuthenticated);
                const responseItem = await axios.get(SKINS + `${itemId.itemId}/`);
                const responseReview = await axios.get(REVIEWS + `${itemId.itemId}/`);
                setItem(responseItem.data.item);
                setReviews(responseReview.data.reviews);
            } catch (error) {
                console.error('Error retrieving item:', error);
            }
        };

        fetchItem();
    }, []);

    if (!isAuthenticated) {
        return <Navigate to="/auth" />;;
    }

    const handleBasketClick = () => {
        navigate('/basket');
    };

    const handleLogoutClick = () => {
        navigate('/logout');
    };

    const handleCabinetClick = () => {
        navigate('/cabinet');
    };

    const handleAddBasket = async (item) => {
        try {
            addTokenToHeader(isAuthenticated);
            await axios.put(BASKET,
                { skin_id: item}
            );
            alert('Товар успешно добавлен в корзину');
        } catch (error) {
            console.log(error);
            alert('Произошла ошибка при добавлении товара в корзину');
        }
    };

    const handlePostReview = async () => {
        const reviewInput = document.getElementById("review-input").value;
        const ratingInput = document.getElementById("rating-input").value;

        const reviewData = {
            skin_id: Number(itemId.itemId),
            review: reviewInput,
            rating: Number(ratingInput),
        };
        try {
            addTokenToHeader(isAuthenticated);
            await axios.post(REVIEWS, reviewData);
            alert('success')
            window.location.reload();
        } catch (error) {
            alert('NO')
            console.log("Error posting review:", error);
        }
    };

    return (
        <div className="shop-retrieve">
            <div className="retrieve-header">
                <button className="retrieve-fill-header" onClick={handleCabinetClick}>Personal Cabinet</button>
                <button className="retrieve-fill-header" onClick={handleBasketClick}>Basket</button>
                <button className="retrieve-fill-header" onClick={handleLogoutClick}>Logout</button>
            </div>
            <div className="retrieve-main">
                <div className="item-retrieve">
                    {item ? (
                        <>
                            <h1>{item.title}</h1>
                            {item.video && (
                                <video controls>
                                    <source src={HOST + item.video} type="video/mp4" />
                                </video>
                            )}
                            {!item.video && (
                                <img src={HOST + item.image} alt={item.title} />
                            )}
                            <h3>Name: {item.name}</h3>
                            <p>Category: {item.grade}</p>
                            <p>Rating: {item.rating}</p>
                            <p>{item.content}</p>
                            <p>{item.version}</p>
                            <p>{item.history}</p>
                            <p>{item.kind}</p>
                            <p>Price: {item.priceWithoutSale}</p>
                            <p>Sale: {item.sale}</p>
                            <p>Total Price: {item.realPrice}</p>
                            <button className="add-basket" onClick={() => handleAddBasket(itemId.itemId)}>
                                В корзину
                            </button>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                <div className="reviews">
                    <div className="post-review">
                        <div>
                            <h2>Оставить отзыв</h2>
                        </div>
                        <div>
                            Оцените скин: <input id="rating-input" placeholder="1-5" type="number" min="1" max="5" />
                        </div>
                        <div>
                            Напишите отзыв: <input id="review-input" placeholder="Отзыв" />
                        </div>
                        <div>
                            <button onClick={handlePostReview}>Отправить</button>
                        </div>
                    </div>
                    <div className="reviews-retrieve">
                        <div>
                            <h2>Reviews:</h2>
                        </div>
                        <div className="reviews-list">
                            {reviews && reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div key={review.user.username}>
                                        <p>User: {review.user.username}</p>
                                        <p>Rating: {review.rating}</p>
                                        <p>Review: {review.review}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="retrieve-footer">
                <div className="retrieve-fill-footer">Some...</div>
                <div className="retrieve-fill-footer">Some...</div>
                <div className="retrieve-fill-footer">Some...</div>
            </div>
        </div>
    );

};

export default ItemDetailPage;