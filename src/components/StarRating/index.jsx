import React, { useState } from 'react';
import './style.css';

function StarRating({ rating, onRatingChange, allowHalf = false }) {
  const [hover, setHover] = useState(0); 
  const totalStars = 5;

  const calculateRating = (e, index) => {
    if (!allowHalf) return index + 1; 

    const star = e.currentTarget;
    const { left, width } = star.getBoundingClientRect();
    const x = e.clientX - left; 

    return (x < width / 2) ? index + 0.5 : index + 1;
  };

  const handleClick = (ratingValue) => {
    if (ratingValue === rating && allowHalf) {
      onRatingChange(0); 
    } else {
      onRatingChange(ratingValue);
    }
  };

  const handleMouseMove = (e, index) => {
    if (!allowHalf) {
      setHover(index + 1);
    } else {
      setHover(calculateRating(e, index));
    }
  };

  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1; 
        
        let isOn = false;
        let isHalf = false;

        if (hover !== 0) { 
          isOn = starValue <= hover;
          isHalf = allowHalf && (hover > index) && (hover < starValue); 
        } else { 
          isOn = starValue <= rating;
          isHalf = allowHalf && (rating > index) && (rating < starValue);
        }

        return (
          <button
            type="button"
            key={index}
            onClick={() => handleClick(allowHalf ? calculateRating(null, index) : index + 1)}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={() => setHover(0)}
            className="star-button" 
          >
            <span className={`star ${isOn ? 'on' : 'off'} ${isHalf ? 'half' : ''}`}>
              &#9733; 
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;