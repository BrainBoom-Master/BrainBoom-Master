import React, { useState } from "react"; // นำเข้า React และ useState hook จาก React
import { FaStar } from 'react-icons/fa'; // นำเข้าไอคอนดาวจากไลบรารี react-icons
import './feture.css'; // นำเข้าไฟล์ CSS สำหรับสไตล์ของคอมโพเนนต์นี้

interface StarRatingProps { // กำหนดประเภทของ props สำหรับคอมโพเนนต์ StarRating
  rating: number | null; // รับ props rating ซึ่งอาจเป็นหมายเลขหรือ null
  onRatingChange: (rating: number) => void; // รับ props onRatingChange ซึ่งเป็นฟังก์ชันที่ถูกเรียกเมื่อมีการเปลี่ยนแปลงคะแนน
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => { // สร้างคอมโพเนนต์ StarRating โดยรับ props rating และ onRatingChange
  const [hover, setHover] = useState<number | null>(null); // สร้าง state สำหรับจัดเก็บคะแนนที่ถูกเลื่อนเมาส์ (hover)

  return ( // คืนค่าผลลัพธ์ของคอมโพเนนต์
    <div className='Comment-star'> {/* คอนเทนเนอร์หลักสำหรับคะแนนดาว */}
      <div className='comment'> {/* คอนเทนเนอร์สำหรับดาว */}
        {[...Array(5)].map((_, index) => { // สร้างอาร์เรย์ของดาว 5 ดวง
          const currentRating = index + 1; // กำหนดค่าคะแนนปัจจุบันตามลำดับของดาว
          return (
            <div key={index}> {/* ใช้ index เป็นคีย์ */}
              <label> {/* ใช้ label เพื่อจับคู่กับ input */}
                <input
                  type="radio" // ประเภท input เป็น radio
                  name='rating' // ตั้งชื่อ input เป็น rating
                  value={currentRating} // กำหนดค่า input เป็น currentRating
                  onClick={() => onRatingChange(currentRating)} // เรียกฟังก์ชัน onRatingChange เมื่อคลิก
                  style={{ display: 'none' }} // ซ่อน input radio
                />
                <FaStar // ใช้ไอคอนดาว
                  className='star' // กำหนดคลาสสำหรับการสไตล์
                  size={30} // ตั้งขนาดไอคอนเป็น 30
                  color={currentRating <= (hover ?? rating ?? 0) ? "#ffc107" : "#e4e5e9"} // ตั้งสีดาวตามคะแนน
                  onMouseEnter={() => setHover(currentRating)} // ตั้งค่า hover เมื่อเมาส์เข้า
                  onMouseLeave={() => setHover(null)} // ตั้งค่า hover เป็น null เมื่อเมาส์ออก
                />
              </label>
            </div>
          );
        })} {/* จบการสร้างดาว */}
      </div>
      <p className='text-star'>{rating} STAR</p> {/* แสดงคะแนนในรูปแบบข้อความ */}
    </div>
  ); // จบการคืนค่าคอมโพเนนต์
};

export default StarRating; // ส่งออกคอมโพเนนต์ StarRating
