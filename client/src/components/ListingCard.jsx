import { useState, useEffect } from "react";
import "../styles/ListingCard.scss";
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ArrowForwardIos, ArrowBackIosNew, Favorite } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setWishList } from "../redux/state";
const ListingCard = ({
    listingId,
    creator,
    listingPhotoPaths,
    city,
    province,
    country,
    category,
    type,
    price,
    startDate,
    endDate,
    totalPrice,
    customerFirstName,
    customerLastName,
    booking,
    showLikeIcon = true,
    showActionButtons = false,
    isPropertyList = false,
    onEdit,
    onDelete,
    showReservedBy = false,
    showReviewButton = false
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [averageRating, setAverageRating] = useState(null);
    const [reviewCount, setReviewCount] = useState(0);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const wishList = user?.wishList || [];

    useEffect(() => {
        const fetchAverageRating = async () => {
            try {
                const response = await fetch(`http://localhost:3001/reviews/averageRating/${listingId}`);
                const data = await response.json();
                setAverageRating(data.averageRating);
                setReviewCount(data.reviewCount);
            } catch (error) {
                console.error('Error fetching average rating:', error);
            }
        };

        fetchAverageRating();
    }, [listingId]);

    const isLiked = wishList?.find((item) => item?._id === listingId);
    console.log("User object at the time of PATCH request:", user);

    if (!user || !user._id) {
        console.error("User ID is undefined at the time of request.");
    }

    const goToPrevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length);
    };

    const goToNextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
    };

    const handleReviewClick = () => {
        navigate(`/addReview/${listingId}`);
    };

    const patchWishList = async () => {
        console.log("User object at the time of PATCH request:", user?._id);

        if (user?._id === creator._id) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Nu poți adăuga la favorite proprietățile listate de tine.'
            });
        } else {
            const response = await fetch(
                `http://localhost:3001/users/${user?._id}/${listingId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                dispatch(setWishList(data.wishList));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Eroare!',
                    text: 'Nu s-a putut adăuga proprietatea la favorite. Încearcă din nou mai târziu.',
                });
            }
        }
    };
    ListingCard.propTypes = {
        showActionButtons: PropTypes.bool,
        showReviewButton: PropTypes.bool,
        showReservedBy: PropTypes.bool
    };
    return (
        <div className="listing-card" onClick={() => navigate(`/properties/${listingId}`)}>
            {showLikeIcon && (
                <div className="slider-container">
                    <div className="slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {listingPhotoPaths?.map((photo, index) => (
                            <div key={index} className="slide">
                                <img src={`http://localhost:3001/${photo.replace("public", "")}`} alt={`photo ${index + 1}`} />
                                <div className="prev-button" onClick={(e) => { e.stopPropagation(); goToPrevSlide(e); }}>
                                    <ArrowBackIosNew sx={{ fontSize: "15px" }} />
                                </div>
                                <div className="next-button" onClick={(e) => { e.stopPropagation(); goToNextSlide(e); }}>
                                    <ArrowForwardIos sx={{ fontSize: "15px" }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {showActionButtons && isPropertyList && (
                        <div className="action-buttons">
                            <button onClick={(e) => {
                                e.stopPropagation();
                                onEdit(listingId);
                            }}>
                                <FontAwesomeIcon icon={faEdit} /> Editează
                            </button>
                            <button onClick={() => onDelete(listingId)}>
                                <FontAwesomeIcon icon={faTrashAlt} /> Șterge
                            </button>
                        </div>
                    )}

                </div>
            )}
            <h3>{city}, {province}, {country}</h3>
            <p>{category}</p>
            {!booking ? (
                <>
                    <p>{type}</p>
                    <p><span>{price} ron/</span> noapte</p>
                    {averageRating !== null && (
                        <p>
                            {averageRating}/5
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="#ffd700"
                                xmlns="http://www.w3.org/2000/svg"
                                className="star-icon"
                            >
                                <path d="M12 .587l3.668 7.425 8.2 1.195-5.938 5.782 1.408 8.184L12 18.896l-7.338 3.877 1.408-8.184L.132 9.207l8.2-1.195L12 .587z" />
                            </svg>
                            ({reviewCount} {reviewCount === 1 ? 'recenzie' : 'recenzii'})
                        </p>
                    )}
                </>
            ) : (
                <>
                    <p>{startDate} - {endDate}</p>
                    <p><span>{totalPrice} ron</span> total</p>
                    {showReservedBy && (
                        <p>Rezervat de: {customerFirstName} {customerLastName}</p>
                    )}
                    {showReviewButton && (
                        <button className="review-button" onClick={(e) => {
                            e.stopPropagation();
                            handleReviewClick();
                        }}>Lasă o recenzie</button>
                    )}
                </>
            )}
            <button className="favorite" onClick={(e) => {
                e.stopPropagation();
                if (!user) {
                    navigate('/login');
                } else {
                    patchWishList();
                }
            }}>
                {isLiked ? <Favorite sx={{ color: "red" }} /> : <Favorite sx={{ color: "white" }} />}
            </button>
        </div>
    );
};

export default ListingCard;