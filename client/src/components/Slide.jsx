import React, { useState, useEffect, useRef } from "react";
import "../styles/Slide.scss";

const imageUrls = [

    "/assets/slide2.webp",
    "/assets/slide3.webp",
    "/assets/slide4.webp",
    "/assets/slide1.webp",
];

const Slide = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const indexRef = useRef(currentImageIndex);

    useEffect(() => {
        const timer = setInterval(() => {
            const nextIndex = (indexRef.current + 1) % imageUrls.length;
            indexRef.current = nextIndex;
            setCurrentImageIndex(nextIndex);
        }, 10000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="slide" style={{ backgroundImage: `url(${imageUrls[currentImageIndex]})` }}>
            <h1>
                Explorează frumusețea României! Descoperă peisaje uimitoare și experiențe unice.<br />
                Creează amintiri de neuitat în fiecare colț al țării!
            </h1>
            <div className="slide-indicators">
                {imageUrls.map((_, index) => (
                    <span key={index} className={`indicator${index === currentImageIndex ? " active" : ""}`}></span>
                ))}
            </div>
        </div>
    );
};

export default Slide;
