import React, { useEffect, useState } from "react";
import axios from "axios";
import { SKINS, CATEGORIES, HOST, BASKET } from "../../apiEndpoints";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { addTokenToHeader } from "../Utils/utils";


const Skins = () => {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [order, setOrder] = useState("asc");
    const [sortBy, setSortBy] = useState("realPrice");
    const [category, setCategory] = useState(null);
    const navigate = useNavigate();

    const isAuthenticated = localStorage.getItem("access");

    const fetchData = async () => {
        try {
            const params = {
                size: itemsPerPage,
                page: currentPage,
                search,
                order,
                sortBy,
                category,
            };

            const response = await axios.get(SKINS, { params });
            setItems(response.data.items);
            setTotalPages(response.data.pagination.count);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, itemsPerPage, search, order, sortBy, category]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(CATEGORIES);
                setCategories(response.data.categories);
            } catch (error) {
                console.log(error);
            }
        };

        fetchCategories();
    }, []);

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    };

    const handleSort = (event) => {
        setSortBy("realPrice");
        setOrder(event.target.value);
        setCurrentPage(1);
    };

    const handleCategoryFilter = (selectedCategory) => {
        const category = selectedCategory === 0 ? "" : selectedCategory;
        setCategory(category);
        setCurrentPage(1);
    };

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
                { skin_id: item.id }
            );
            alert('Товар успешно добавлен в корзину');
        } catch (error) {
            console.log(error);
            alert('Произошла ошибка при добавлении товара в корзину');
        }
    };

    const handleItemClick = async (item) => {
        navigate(`/${item}`);
    };

    return (
        <div className="my-shop">
            <div className="shop-header">
                <button className="shop-fill-header" onClick={handleCabinetClick}>Personal Cabinet</button>
                <button className="shop-fill-header" onClick={handleBasketClick}>Basket</button>
                <button className="shop-fill-header" onClick={handleLogoutClick}>Logout</button>
            </div>
            <div className="shop-main">
                <div className="shop-sidebar">
                    <div className="categories-list">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                className={`category ${category.number === handleCategoryFilter ? "active" : ""}`}
                                onClick={() => handleCategoryFilter(category.number)}
                            >
                                <img src={HOST + category.image} alt={category.name} />
                                {/* <p className="category-name">{category.name}</p> */}
                            </button>
                        ))}
                    </div>
                    <div className="empty"></div>
                </div>
                <div className="shop-content">
                    <div className="shop-filters">
                        <div className="items-per-page">
                            {[20, 40, 60].map((value) => (
                                <button
                                    key={value}
                                    className={itemsPerPage === value ? "active" : ""}
                                    onClick={() => handleItemsPerPageChange(value)}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                        <div className="search">
                            <label htmlFor="search">Search:</label>
                            <input type="text" id="search" value={search} onChange={handleSearch} />
                            <button onClick={handleSearch}>Search</button>
                        </div>
                        <div className="sort">
                            <label htmlFor="sort">Sort by:</label>
                            <select id="sort" value={sortBy} onChange={handleSort}>
                                <option value="">None</option>
                                <option value="asc">Price (Low to High)</option>
                                <option value="desc">Price (High to Low)</option>
                            </select>
                        </div>
                    </div>
                    <div className="item-list">
                        {items.map((item) => (
                            <div className="item" key={item.id}>
                                <img src={HOST + item.image} alt={item.title} />
                                <h3 onClick={() => handleItemClick(item.id)}>Name: {item.name}</h3>
                                <p>Title: {item.title}</p>
                                <p>Category: {item.grade}</p>
                                <p>Rating: {item.rating}</p>
                                <p>Price: {item.priceWithoutSale}</p>
                                <p>Sale: {item.sale}</p>
                                <p>Total Price: {item.realPrice}</p>
                                <button className="to-basket" onClick={() => handleAddBasket(item)}>
                                    В корзину
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="pagination">
                        <button onClick={goToPreviousPage} disabled={currentPage === 1} className="prev-button">
                            Previous Page
                        </button>
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="next-button"
                        >
                            Next Page
                        </button>
                    </div>
                </div>
            </div>
            <div className="shop-footer">
                <div className="shop-fill-footer">Some...</div>
                <div className="shop-fill-footer">Some...</div>
                <div className="shop-fill-footer">Some...</div>
            </div>
        </div>
    );

};

export default Skins;
