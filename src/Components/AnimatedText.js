import React, { useState, useEffect } from "react";

const AnimatedText = ({ amount, position, onAnimationEnd }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsVisible(false);
            onAnimationEnd();
        }, 500);
        return () => clearTimeout(timeout);
    }, [onAnimationEnd]);

    return (
        <div
            className={`fixed ${
                isVisible ? "animate-fadeUp" : "hidden"
            } text-white font-bold text-24 font-outline-1`}
            style={{
                left: position.x,
                top: position.y,
                pointerEvents: "none", // So it doesn't interfere with other UI elements
            }}
        >
            +{amount}
        </div>
    );
};

export default AnimatedText;
