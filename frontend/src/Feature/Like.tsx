import React, { useState, useEffect } from 'react'; // นำเข้า React และ hook useState, useEffect จาก React
import { onLikeButtonClick, fetchLikeStatus, onUnlikeButtonClick } from '../services/https'; // นำเข้าฟังก์ชันสำหรับจัดการไลค์และดึงสถานะไลค์จาก API
import "./feture.css"; // นำเข้าไฟล์ CSS สำหรับสไตล์ของคอมโพเนนต์นี้
import { Heart } from 'phosphor-react'; // นำเข้าไอคอน Heart จากไลบรารี phosphor-react
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // นำเข้า FontAwesomeIcon จากไลบรารี Font Awesome
import { faHeart } from '@fortawesome/free-solid-svg-icons'; // นำเข้าไอคอน heart จาก Font Awesome

interface LikeProps { // กำหนดประเภทของ props สำหรับคอมโพเนนต์ Like
    reviewID: number; // รับ props reviewID ซึ่งเป็นหมายเลขของรีวิว
    userID: number; // รับ props userID ซึ่งเป็นหมายเลขของผู้ใช้
}

const Like: React.FC<LikeProps> = ({ reviewID, userID }) => { // สร้างคอมโพเนนต์ Like โดยรับ props reviewID และ userID
    const [hasLiked, setHasLiked] = useState<boolean>(false); // สร้าง state เพื่อตรวจสอบว่าสถานะไลค์เป็นจริงหรือไม่
    const [likeCount, setLikeCount] = useState<number>(0); // สร้าง state สำหรับเก็บจำนวนไลค์

    useEffect(() => { // useEffect เพื่อเรียกฟังก์ชันเมื่อคอมโพเนนต์ติดตั้งหรือ reviewID, userID เปลี่ยน
        const fetchData = async () => { // ฟังก์ชันเพื่อดึงข้อมูลสถานะไลค์
            try {
                const status = await fetchLikeStatus(reviewID, userID); // เรียกฟังก์ชันเพื่อดึงสถานะไลค์จาก API
                if (status) { // หากได้รับสถานะ
                    setHasLiked(status.hasLiked); // ตั้งค่า hasLiked ตามสถานะ
                    setLikeCount(status.likeCount); // ตั้งค่า likeCount ตามจำนวนไลค์
                }
            } catch (error) { // จัดการข้อผิดพลาด
                console.error('ข้อผิดพลาดในการดึงข้อมูลสถานะไลค์:', error); // แสดงข้อความผิดพลาด
            }
        };

        fetchData(); // เรียกใช้ฟังก์ชัน fetchData
    }, [reviewID, userID]); // กำหนด dependencies เป็น reviewID และ userID

    const handleLikeIconClick = async () => { // ฟังก์ชันสำหรับจัดการการคลิกที่ไอคอนไลค์
        try {
            const response = hasLiked ? await onUnlikeButtonClick(reviewID, userID) : await onLikeButtonClick(reviewID, userID); // ตรวจสอบสถานะไลค์แล้วเรียกฟังก์ชันที่เหมาะสม
            if (response) { // หากมีการตอบกลับ
                const updatedStatus = await fetchLikeStatus(reviewID, userID); // เรียกฟังก์ชันเพื่อดึงสถานะไลค์ที่อัปเดต
                if (updatedStatus) { // หากได้รับสถานะอัปเดต
                    setHasLiked(updatedStatus.hasLiked); // ตั้งค่า hasLiked ตามสถานะอัปเดต
                    setLikeCount(updatedStatus.likeCount); // ตั้งค่า likeCount ตามจำนวนไลค์อัปเดต
                }
            }
        } catch (error) { // จัดการข้อผิดพลาด
            console.error('ข้อผิดพลาดในการจัดการคลิกไอคอนไลค์:', error); // แสดงข้อความผิดพลาด
        }
    };

    return ( // คืนค่าผลลัพธ์ของคอมโพเนนต์
        <div className='box-thumup-like'> {/* คอนเทนเนอร์หลักสำหรับไลค์ */}
            {hasLiked ? ( // ตรวจสอบว่ามีการไลค์หรือไม่
                <span className='thank'>Thank you for your feedback</span> // แสดงข้อความขอบคุณหากมีการไลค์
            ) : (
                <span className='hekpful'>Was this review helpful?</span> // แสดงข้อความถามหากยังไม่ได้ไลค์
            )}
            <div className="icon-and-count"> {/* คอนเทนเนอร์สำหรับไอคอนและจำนวนไลค์ */}
                <FontAwesomeIcon // ใช้ไอคอนจาก Font Awesome
                    icon={faHeart} // กำหนดไอคอนเป็น heart
                    size="2x" // ตั้งขนาดไอคอนเป็น 2x
                    color={hasLiked ? '#ec4a4a' : 'gray'} // ตั้งสีไอคอนตามสถานะไลค์
                    onClick={handleLikeIconClick} // เรียกฟังก์ชัน handleLikeIconClick เมื่อคลิกที่ไอคอน
                    style={{ cursor: 'pointer' }} // ตั้งค่า cursor ให้เป็น pointer
                />
                <span>{likeCount}</span> {/* แสดงจำนวนไลค์ */}
            </div>
        </div>
    ); // จบการคืนค่าคอมโพเนนต์
};

export default Like; // ส่งออกคอมโพเนนต์ Like
