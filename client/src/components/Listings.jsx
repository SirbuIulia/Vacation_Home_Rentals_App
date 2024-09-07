import { useEffect, useState } from "react";
import { categories } from "../data";
import "../styles/Listings.scss";
import ListingCard from "./ListingCard";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";

const Listings = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("Toate");

    const listings = useSelector((state) => state.listings);

    const getFeedListings = async (category) => {
        setLoading(true);
        try {
            const response = await fetch(
                category && category !== "Toate"
                    ? `http://localhost:3001/properties?category=${category}`
                    : "http://localhost:3001/properties",
                {
                    method: "GET",
                }
            );

            const data = await response.json();
            dispatch(setListings({ listings: data }));
            setLoading(false);
        } catch (err) {
            console.log("Fetch Listings Failed", err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        getFeedListings(selectedCategory);
    }, [selectedCategory]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        getFeedListings(category);
    };

    return (
        <>
            <div className="category-list">
                {categories?.map((category, index) => (
                    <div
                        className={`category ${selectedCategory === category.label ? 'selected' : ''}`}
                        key={index}
                        onClick={() => handleCategoryClick(category.label)}
                    >
                        <div className="category_icon">{category.icon}</div>
                        <p>{category.label}</p>
                    </div>
                ))}
            </div>

            {loading ? (
                <Loader />
            ) : (
                <div className="listings">
                    {listings.map(
                        ({ _id, creator, listingPhotoPaths, city, province, country, category, type, price, booking = false }) => (
                            <ListingCard
                                key={_id}
                                listingId={_id}
                                creator={creator}
                                listingPhotoPaths={listingPhotoPaths}
                                city={city}
                                province={province}
                                country={country}
                                category={category}
                                type={type}
                                price={price}
                                booking={booking}
                            />
                        )
                    )}
                </div>
            )}
        </>
    );
};

export default Listings;
