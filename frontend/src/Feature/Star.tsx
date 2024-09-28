import React, { useState } from "react"; 
import { FaStar } from 'react-icons/fa'; 
import './feture.css'; 

interface StarRatingProps { 
  rating: number | null; 
  onRatingChange: (rating: number) => void; 
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => { 
  const [hover, setHover] = useState<number | null>(null); 

  return ( 
    <div className='Comment-star'> {/* คอนเทนเนอร์หลักสำหรับคะแนนดาว */}
      <div className='comment'> {/* คอนเทนเนอร์สำหรับดาว */}
        {[...Array(5)].map((_, index) => { 
          const currentRating = index + 1; 
          return (
            <div key={index}> {/* ใช้ index เป็นคีย์ */}
              <label> {/* ใช้ label เพื่อจับคู่กับ input */}
                <input
                  type="radio" 
                  name='rating' 
                  value={currentRating} 
                  onClick={() => onRatingChange(currentRating)} 
                  style={{ display: 'none' }} 
                />
                <FaStar 
                  className='star' 
                  size={30} 
                  color={currentRating <= (hover ?? rating ?? 0) ? "#ffc107" : "#e4e5e9"} 
                  onMouseEnter={() => setHover(currentRating)} 
                  onMouseLeave={() => setHover(null)} 
                />
              </label>
            </div>
          );
        })} {/* จบการสร้างดาว */}
      </div>
      <p className='text-star'>{rating} STAR</p> {/* แสดงคะแนนในรูปแบบข้อความ */}
    </div>
  ); 
};

export default StarRating; 
