const StarRating = ({ rating, size = 13 }) => {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= Math.round(rating) ? '' : 'empty'}`}
          style={{ fontSize: size }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
