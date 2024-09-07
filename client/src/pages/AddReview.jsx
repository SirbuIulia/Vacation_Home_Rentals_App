import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import '../styles/Review.scss';

const AddReview = () => {
    const { listingId } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const user = useSelector((state) => state.user);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (rating === '' || !comment) {
            setErrorMessage('Both rating and comment are required.');
            return;
        }

        const reviewData = { listingId, userId: user._id, rating, comment };
        console.log("Submitting review:", reviewData);

        try {
            const response = await fetch('http://localhost:3001/reviews/addReview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('HTTP error! status:', response.status, 'message:', errorResponse.message);
                setErrorMessage(`Failed to add review: ${errorResponse.message}`);
                return;
            }

            const data = await response.json();
            Swal.fire({
                title: 'Recenzie trimisă',
                text: 'Recenzia ta a fost trimisă cu succes, mulțumim!',
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then(() => {
                navigate('/');
            });
            setRating(1);
            setComment('');
            setErrorMessage('');
        } catch (error) {
            console.error('Failed to add review:', error);
            setErrorMessage('Failed to add review. Please try again.');
        }
    };

    return (
        <div className="review-page">
            <div className="review-container">
                <h2 className="review-title">Adaugă o recenzie</h2>
                <form className="review-form" onSubmit={handleSubmit}>
                    <label className="review-label">
                        Scor:
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${star <= rating ? 'active' : ''}`}
                                    style={{ fontSize: 24, color: star <= rating ? '#ffd700' : '#ccc', cursor: 'pointer' }}
                                    onClick={() => handleRatingChange(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </label>
                    <label className="review-label">
                        Lasă un comentariu:
                        <textarea
                            className="review-textarea"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                    </label>
                    <button className="review-button" type="submit">Trimite recenzie</button>
                    {errorMessage && <p className="review-error">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default AddReview;
