import React, { useEffect, useState, useRef } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setReservationList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import GooglePieChart from '../components/GooglePieChart';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ReservationList = () => {
    const [loading, setLoading] = useState(true);
    const [showChart, setShowChart] = useState(false);
    const [seasonalData, setSeasonalData] = useState({});
    const userId = useSelector(state => state.user._id);
    const reservationList = useSelector(state => state.user.reservationList);
    const dispatch = useDispatch();
    const chartRefs = useRef({});

    useEffect(() => {
        const fetchReservations = async () => {
            if (!userId) {
                console.error("User ID is undefined.");
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`http://localhost:3001/users/${userId}/reservations`, {
                    method: "GET",
                });
                if (!response.ok) throw new Error(`Failed to fetch, status code: ${response.status}`);

                const reservations = await response.json();
                console.log("Fetched reservations:", reservations);
                dispatch(setReservationList(reservations.map(reservation => ({
                    ...reservation,
                    customer: reservation.customer || { firstName: 'Unknown', lastName: '' }
                }))));
                calculateSeasonalData(reservations);
                setLoading(false);
            } catch (err) {
                console.error("Fetch Reservation List failed!", err);
                setLoading(false);
            }
        };

        fetchReservations();
    }, [userId, dispatch]);



    const calculateSeasonalData = (reservations) => {
        const propertySeasonData = {};

        reservations.forEach(res => {
            const propertyId = res.listingId._id;
            const propertyTitle = res.listingId.title;
            if (!propertySeasonData[propertyId]) {
                propertySeasonData[propertyId] = {
                    title: propertyTitle,
                    data: [0, 0, 0, 0]
                };
            }

            const month = new Date(res.startDate).getMonth() + 1;
            if (month >= 3 && month <= 5) propertySeasonData[propertyId].data[0]++;
            else if (month >= 6 && month <= 8) propertySeasonData[propertyId].data[1]++;
            else if (month >= 9 && month <= 11) propertySeasonData[propertyId].data[2]++;
            else propertySeasonData[propertyId].data[3]++;
        });

        setSeasonalData(propertySeasonData);
    };

    const toggleChart = () => {
        setShowChart(!showChart);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const generatePDF = async (propertyId) => {
        const chartRef = chartRefs.current[propertyId];
        const propertyData = seasonalData[propertyId];

        if (!chartRef) {
            console.error("Chart reference is not defined for propertyId:", propertyId);
            return;
        }
        const canvas = await html2canvas(chartRef, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("landscape", "pt", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        const total = propertyData.data.reduce((sum, value) => sum + value, 0);
        const percentages = propertyData.data.map(value => ((value / total) * 100).toFixed(1));

        const textLines = [
            `Total rezervari: ${total}`,
            `Primavara: ${propertyData.data[0]} rezervari (${percentages[0]}%)`,
            `Vara: ${propertyData.data[1]} rezervari (${percentages[1]}%)`,
            `Toamna: ${propertyData.data[2]} rezervari (${percentages[2]}%)`,
            `Iarna: ${propertyData.data[3]} rezervari (${percentages[3]}%)`
        ];

        const textYPosition = pdfHeight + 20;
        textLines.forEach((line, index) => {
            pdf.text(line, 20, textYPosition + (index * 20));
        });

        const propertyTitle = propertyData.title.replace(/\s+/g, '_');
        pdf.save(`SeasonsChart_${propertyTitle}.pdf`);
    };

    if (loading) {
        return <Loader />;
    }


    return (
        <>
            <Navbar />
            <div className="header-container">
                <h1 className="title-list">Proprietățile tale rezervate de clienți</h1>
                {reservationList.length > 0 && (
                    <>
                        <div className="button-group">
                            <button className="stats-button" onClick={toggleChart}>
                                {showChart ? "Ascunde statistici" : "Vezi statistici"}
                            </button>
                        </div>
                    </>
                )}
            </div>
            {showChart && (
                <div>
                    {Object.keys(seasonalData).map(propertyId => (
                        <div key={propertyId} className="chart-container">
                            <div ref={el => chartRefs.current[propertyId] = el} className="chart">
                                <GooglePieChart data={seasonalData[propertyId].data} title={`Distribuția rezervărilor pe sezoane pentru proprietatea ${seasonalData[propertyId].title}`} />
                            </div>
                            <div className="button-group">
                                <button className="pdf-button" onClick={() => generatePDF(propertyId)}>
                                    Generare PDF
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="list">
                {reservationList.map((reservation) => (
                    <ListingCard
                        key={reservation.listingId._id}
                        listingId={reservation.listingId._id}
                        creator={reservation.hostId._id}
                        listingPhotoPaths={reservation.listingId.listingPhotoPaths}
                        city={reservation.listingId.city}
                        province={reservation.listingId.province}
                        country={reservation.listingId.country}
                        category={reservation.listingId.category}
                        startDate={formatDate(reservation.startDate)}
                        endDate={formatDate(reservation.endDate)}
                        totalPrice={reservation.totalPrice}
                        customerFirstName={reservation.customerId.firstName}
                        customerLastName={reservation.customerId.lastName}
                        booking={true}
                        showReservedBy={true}
                        showReviewButton={false}
                    />
                ))}
            </div>
            <Footer />
        </>
    );
};

export default ReservationList;
