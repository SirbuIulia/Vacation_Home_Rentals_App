import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { format, differenceInCalendarDays, isWithinInterval } from 'date-fns';
import { DateRange } from "@umakantp/react-date-range";
import { ro } from 'date-fns/locale';
import { loadStripe } from '@stripe/stripe-js';
import Swal from 'sweetalert2';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Map from "../components/Map";
import Reviews from "../components/Reviews";
import Loader from "../components/Loader";
import { facilities } from "../data";
import "../styles/ListingDetails.scss";
import "@umakantp/react-date-range/dist/styles.css";
import "@umakantp/react-date-range/dist/theme/default.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const ListingDetails = () => {
    const [loading, setLoading] = useState(true);
    const [listing, setListing] = useState(null);
    const [occupiedDates, setOccupiedDates] = useState([]);
    const [dateRange, setDateRange] = useState([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
    const [dayCount, setDayCount] = useState(0);
    const { listingId } = useParams();
    const navigate = useNavigate();
    const user = useSelector(state => state.user);

    useEffect(() => {
        const fetchData = async () => {
            if (!listingId) {
                console.error("Invalid listing ID");
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const detailsResponse = await fetch(`http://localhost:3001/properties/${listingId}`);
                if (!detailsResponse.ok) {
                    throw new Error(`Failed to fetch listing details. Status code: ${detailsResponse.status}`);
                }
                const detailsData = await detailsResponse.json();
                setListing(detailsData);

                const datesResponse = await fetch(`http://localhost:3001/bookings/occupied-dates/${listingId}`);
                if (!datesResponse.ok) throw new Error('Failed to fetch occupied dates.');
                const datesData = await datesResponse.json();
                setOccupiedDates(datesData);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error.message);
                Swal.fire('Error', 'Failed to load listing details.', 'error');
                setLoading(false);
            }
        };

        fetchData();
    }, [listingId]);

    useEffect(() => {
        if (dateRange[0].startDate && dateRange[0].endDate) {
            const newDayCount = differenceInCalendarDays(dateRange[0].endDate, dateRange[0].startDate);
            setDayCount(newDayCount);
        }
    }, [dateRange]);

    const handleSelect = (ranges) => {
        setDateRange([ranges.selection]);
    };

    const handleSubmit = async () => {
        if (!user) {
            Swal.fire({
                title: 'Autentificare necesară!',
                text: 'Te rugăm să te loghezi pentru a face o rezervare.',
                icon: 'warning',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                }
            });
            return;
        }

        if (user._id === listing?.creator?._id) {
            Swal.fire('Operațiune nereușită', 'Nu poți rezerva o proprietate pe care tu însuți ai listat-o.', 'error');
            return;
        }

        const bookingForm = {
            customerId: user._id,
            listingId: listing._id,
            hostId: listing.creator._id,
            startDate: dateRange[0].startDate.toDateString(),
            endDate: dateRange[0].endDate.toDateString(),
            totalPrice: listing.price * dayCount
        };

        try {
            const response = await fetch("http://localhost:3001/bookings/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingForm)
            });
            const result = await response.json();

            if (response.status === 409) {
                Swal.fire('Error', result.message, 'error');
                return;
            }
            if (!response.ok) {
                throw new Error(result.message || 'Booking failed.');
            }
            await initiateStripeSession(result.bookingId, bookingForm.totalPrice);
        } catch (error) {
            console.error("Booking error:", error);
            Swal.fire('Error', error.message, 'error');
        }
    };

    const initiateStripeSession = async (bookingId, totalPrice) => {
        const stripeResponse = await fetch("http://localhost:3001/bookings/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ totalPrice, bookingId })
        });
        const stripeResult = await stripeResponse.json();
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({ sessionId: stripeResult.sessionId });
        if (error) throw new Error(error.message);
    };

    if (loading || !listing) return <Loader />;

    const profileImageUrl = listing?.creator?.profileImagePath?.includes('http://') || listing?.creator?.profileImagePath?.includes('https://') ?
        listing.creator.profileImagePath :
        `http://localhost:3001/${listing?.creator?.profileImagePath?.replace("public", "")}`;

    const isDateOccupied = (date) => {
        return occupiedDates.some(({ startDate, endDate }) => {
            return isWithinInterval(date, { start: new Date(startDate), end: new Date(endDate) });
        });
    };

    return (
        <>
            <Navbar />

            <div className="listing-details">
                <div className="title">
                    <h1>{listing.title}</h1>
                    <div></div>
                </div>

                <div className="photos">
                    {listing.listingPhotoPaths.map((path, index) => (
                        <img
                            key={index}
                            src={`http://localhost:3001/${path.replace("public", "")}`}
                            alt={`Listing photo ${index + 1}`}
                        />
                    ))}
                </div>

                <h2>
                    {listing.type} în {listing.city}, {listing.province},{" "}
                    {listing.country}
                </h2>
                <p>
                    {listing.guestCount} oaspeți - {listing.bedroomCount} dormitoare -{" "}
                    {listing.bedCount} paturi - {listing.bathroomCount} băi
                </p>
                <hr />

                <div className="profile">
                    <img
                        src={profileImageUrl} alt={`Profile of ${listing.creator.firstName}`} />

                    <h3>
                        Găzduit de {listing.creator.firstName} {listing.creator.lastName}
                    </h3>
                </div>
                <hr />

                <h3>Descriere</h3>
                <p>{listing.description}</p>
                <hr />

                <h3>Descriere pe scurt</h3>
                <p>{listing.highlight}</p>
                <hr />
                <div className="map">
                    <Map
                        address={listing?.streetAddress}
                        city={listing?.city}
                        country={listing?.country}
                    />
                </div>
                <p />
                <div className="booking">
                    <div>
                        <h2>Ce oferă acest loc?</h2>
                        <div className="amenities">
                            {listing.amenities.map((item, index) => {
                                const facility = facilities.find((facility) => facility.name === item);
                                return (
                                    <div className="facility" key={index}>
                                        <div className="facility_icon">
                                            {facility?.icon}
                                        </div>
                                        <p>{facility?.name}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h2>Cât timp dorești să stai?</h2>
                        <div className="date-range-calendar">
                            <DateRange
                                ranges={dateRange}
                                onChange={handleSelect}
                                locale={ro}
                                minDate={new Date()}
                                disabledDates={occupiedDates.flatMap(({ startDate, endDate }) => {
                                    const dates = [];
                                    for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
                                        dates.push(new Date(d));
                                    }
                                    return dates;
                                })}
                            />
                            {dayCount > 1 ? (
                                <h2>
                                    {listing.price} ron x {dayCount} nopți
                                </h2>
                            ) : (
                                <h2>
                                    {listing.price} ron x {dayCount} noapte
                                </h2>
                            )}
                            <h2>Pret total: {listing.price * dayCount} ron</h2>
                            <p>Data început: {format(dateRange[0].startDate, 'EEEE, MMMM d, yyyy', { locale: ro })}</p>
                            <p>Data sfârșit: {format(dateRange[0].endDate, 'EEEE, MMMM d, yyyy', { locale: ro })}</p>

                            <button className="button" type="submit" onClick={handleSubmit}>
                                REZERVĂ
                            </button>
                        </div>
                    </div>
                </div>
                <p></p>
                <Reviews listingId={listingId} />
            </div>

            <Footer />
        </>
    );
};

export default ListingDetails;
