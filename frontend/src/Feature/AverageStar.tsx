import { useState, useEffect } from "react"; // นำเข้า useState และ useEffect จาก React สำหรับการจัดการ state และ lifecycle
import "./starbar.css"; // นำเข้าไฟล์ CSS สำหรับสไตล์ของคอมโพเนนต์นี้
import { GetReviewById, GetRatingsAvgByCourseID } from "../services/https"; // นำเข้าฟังก์ชันสำหรับดึงข้อมูลรีวิวและคะแนนเฉลี่ยจาก API
import { ReviewInterface } from "../interfaces/IReview"; // นำเข้าประเภทข้อมูล ReviewInterface จากไฟล์ที่กำหนด

interface StarBarProps { // กำหนดประเภทของ props สำหรับคอมโพเนนต์ StarBar
  courseID: number; // รับ props courseID ซึ่งเป็นหมายเลขของคอร์ส
}

const StarBar = ({ courseID }: StarBarProps) => { // สร้างคอมโพเนนต์ StarBar โดยรับ props courseID
  const [averageRatings, setAverageRatings] = useState< // สร้าง state สำหรับเก็บคะแนนเฉลี่ย
    { rating: number; percentage: number }[] // ประเภทข้อมูลเป็นอาเรย์ของวัตถุที่มี rating และ percentage
  >([]); // เริ่มต้นด้วยอาเรย์ว่าง
  const [reviews, setReviews] = useState<ReviewInterface[]>([]); // สร้าง state สำหรับเก็บรีวิว

  const getAverageRatings = async () => { // ฟังก์ชันสำหรับดึงคะแนนเฉลี่ย
    const avgRatings = await GetRatingsAvgByCourseID(courseID); // เรียกฟังก์ชันเพื่อดึงคะแนนเฉลี่ยจาก API
    // If there are no average ratings, set default to 0% for each rating
    if (avgRatings && avgRatings.length > 0) { // ตรวจสอบว่ามีคะแนนเฉลี่ยหรือไม่
      setAverageRatings(avgRatings); // หากมีคะแนนเฉลี่ย ตั้งค่าให้ state averageRatings
    } else {
      setAverageRatings( // หากไม่มีคะแนนเฉลี่ย ตั้งค่าเป็น 0% สำหรับทุกคะแนน
        Array.from({ length: 5 }, (_, i) => ({ // สร้างอาเรย์ขนาด 5
          rating: i + 1, // กำหนด rating ให้เริ่มจาก 1 ถึง 5
          percentage: 0, // ตั้งค่า percentage เป็น 0
        }))
      );
    }
  };

  const getReviewsById = async (id: number) => { // ฟังก์ชันสำหรับดึงรีวิวตาม ID
    const res = await GetReviewById(id); // เรียกฟังก์ชันเพื่อดึงรีวิวจาก API
    if (res) { // หากได้รับผลลัพธ์
      setReviews(res); // ตั้งค่าให้ state reviews
    }
  };

  useEffect(() => { // useEffect เพื่อเรียกฟังก์ชันเมื่อ component ติดตั้งหรือ courseID เปลี่ยน
    getReviewsById(courseID); // เรียกฟังก์ชันเพื่อดึงรีวิวโดยใช้ courseID
  }, [courseID]); // กำหนด dependency เป็น courseID

  useEffect(() => { // useEffect อีกตัวเพื่อเรียกฟังก์ชันเมื่อมีการเปลี่ยนแปลงใน state reviews
    if (reviews.length > 0) { // หากมีรีวิว
      getAverageRatings(); // เรียกฟังก์ชันเพื่อดึงคะแนนเฉลี่ย
    }
  }, [reviews]); // กำหนด dependency เป็น reviews

  const getColor = (rating: number) => { // ฟังก์ชันสำหรับกำหนดสีตาม rating
    switch (rating) { // ใช้ switch-case เพื่อตรวจสอบค่าของ rating
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        return "gold"; // หาก rating เป็น 1-5 คืนค่า "gold"
      default:
        return "#ccc"; // หาก rating ไม่ตรงคืนค่า "#ccc"
    }
  };

  const renderStars = (rating: number) => { // ฟังก์ชันสำหรับเรนเดอร์ดาวตาม rating
    const totalStars = 5; // กำหนดจำนวนดาวทั้งหมดเป็น 5
    let stars = ""; // สร้างตัวแปรสำหรับเก็บดาว
    for (let i = 1; i <= totalStars; i++) { // วนลูปจาก 1 ถึง 5
      stars += i <= rating ? "★" : "☆"; // เติมดาวสีทองสำหรับคะแนนที่เติมแล้ว และดาวสีเทาสำหรับคะแนนที่ว่าง
    }
    return stars; // คืนค่าดาวที่เรนเดอร์
  };

  return ( // คืนค่าผลลัพธ์ของคอมโพเนนต์
    <div className="container"> {/* คอนเทนเนอร์หลัก */}
      {averageRatings.map((ratingData) => ( // วนลูปแสดง averageRatings
        <div key={ratingData.rating} className="star-rating"> {/* คอนเทนเนอร์สำหรับคะแนนดาว */}
          <div className="progress-bar"> {/* คอนเทนเนอร์สำหรับแถบความก้าวหน้า */}
            <div
              className="progress-bar-fill" // คอนเทนเนอร์สำหรับการเติมแถบ
              style={{ // ตั้งค่าสไตล์ให้แถบเติม
                width: `${ratingData.percentage}%`, // กำหนดความกว้างตาม percentage
                backgroundColor: getColor(ratingData.rating), // กำหนดสีพื้นหลังตาม rating
              }}
            ></div>
          </div>
          <div className="stars"> {/* คอนเทนเนอร์สำหรับดาว */}
            <div className="star-text"> {/* คอนเทนเนอร์สำหรับข้อความดาว */}
              {renderStars(ratingData.rating)} {/* เรียกใช้ฟังก์ชัน renderStars เพื่อนำเสนอคะแนน */}
            </div>
            <span className="percentage"> {/* แสดงเปอร์เซ็นต์ */}
              {ratingData.percentage.toFixed(2)}% {/* แสดงเปอร์เซ็นต์ในรูปแบบทศนิยม 2 ตำแหน่ง */}
            </span>
          </div>
        </div>
      ))} {/* จบการวนลูป averageRatings */}
    </div>
  ); // จบการคืนค่าคอมโพเนนต์
};

export default StarBar; // ส่งออกคอมโพเนนต์ StarBar
