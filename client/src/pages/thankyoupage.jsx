import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/home'); // Navigate to home or booking page
    };

    return (
        <div className="thankyou-container">
            <h1>Thank You!</h1>
            <p>Your seat has been successfully booked.</p>
            <button onClick={handleBackToHome}>Back to Home</button>
        </div>
    );
};

export default ThankYouPage;
