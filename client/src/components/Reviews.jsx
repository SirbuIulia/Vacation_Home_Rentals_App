import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Review.scss';
import moment from 'moment';

const Reviews = ({ listingId }) => {
    const [reviews, setReviews] = useState([]);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:3001/reviews/${listingId}`);
                const data = await response.json();
                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setReviews(sortedData);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, [listingId]);

    const handleDelete = async (reviewId) => {
        try {
            const response = await fetch(`http://localhost:3001/reviews/${reviewId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete review');
            }

            Swal.fire({
                title: 'Recenzie ștearsă',
                icon: 'success',
                confirmButtonText: 'Ok'
            })
            setReviews(reviews.filter((review) => review._id !== reviewId));
        } catch (error) {
            Swal.fire('Error', 'Failed to delete review', 'error');
        }
    };

    const renderStars = (rating) => {
        const totalStars = 5;
        const stars = [];
        for (let i = 1; i <= totalStars; i++) {
            stars.push(
                <svg
                    key={i}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={i <= rating ? '#ffd700' : '#ccc'}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M12 .587l3.668 7.425 8.2 1.195-5.938 5.782 1.408 8.184L12 18.896l-7.338 3.877 1.408-8.184L.132 9.207l8.2-1.195L12 .587z" />
                </svg>
            );
        }
        return <div className="star-rating">{stars}</div>;
    };

    return (
        <div className="reviews-container">
            <h2>Recenzii</h2>
            {reviews.length === 0 ? (
                <p>Pentru această proprietate nu sunt recenzii momentan</p>
            ) : (
                reviews.map((review) => (
                    <div key={review._id} className="review">
                        {review.userId ? (
                            <>
                                <p><strong>{review.userId.firstName} {review.userId.lastName}</strong></p>
                                <p>Scor: {renderStars(review.rating)}</p>
                                <p>{review.comment}</p>
                                <small>{moment(review.createdAt).format('DD/MM/YYYY HH:mm')}</small>
                                {user && user._id === review.userId._id && (
                                    <button className="delete-button" onClick={() => handleDelete(review._id)}>
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                )}
                            </>
                        ) : (
                            <p>Utilizator șters</p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};


export default Reviews;
