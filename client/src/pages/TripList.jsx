import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer"

const TripList = () => {
    const [loading, setLoading] = useState(true);
    const userId = useSelector((state) => state.user._id);
    const tripList = useSelector((state) => state.user.tripList);

    const dispatch = useDispatch();

    useEffect(() => {
        getTripList();
    }, []);

    const getTripList = async () => {
        try {
            const response = await fetch(
                `http://localhost:3001/users/${userId}/trips`,
                {
                    method: "GET",
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                }
            );

            const data = await response.json();
            const filteredData = data.filter(booking => booking.status !== 'cancelled');
            console.log('Filtered data:', filteredData);
            dispatch(setTripList(Array.isArray(filteredData) ? filteredData : []));
            setLoading(false);
        } catch (err) {
            console.log("Fetch Trip List failed!", err.message);
        }
    };



    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const sortTripsByDate = (trips) => {
        return [...trips].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    };

    return loading ? (
        <Loader />
    ) : (
        <>
            <Navbar />
            <h1 className="title-list">Rezervările tale</h1>
            <div className="list">
                {tripList && sortTripsByDate(tripList).map(({ listingId, hostId, startDate, endDate, status, totalPrice, booking = true }, index) => (
                    listingId && hostId ? (
                        <ListingCard
                            key={index}
                            listingId={listingId._id}
                            creator={hostId._id}
                            listingPhotoPaths={listingId.listingPhotoPaths}
                            city={listingId.city}
                            province={listingId.province}
                            country={listingId.country}
                            category={listingId.category}
                            startDate={formatDate(startDate)}
                            endDate={formatDate(endDate)}
                            totalPrice={totalPrice}
                            booking={booking}
                            showReviewButton={new Date(endDate) < new Date() && status !== 'cancelled'}
                            showReservedBy={false}
                        />
                    ) : null
                ))}
            </div>
            <Footer />
        </>
    );
};

export default TripList;