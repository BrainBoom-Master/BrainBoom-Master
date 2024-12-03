import { useState, useEffect } from 'react';
import { Card, Button, Typography, Divider } from 'antd';
import { useNavigate, useLocation  } from 'react-router-dom';
import HeaderComponent from '../../../components/header';
import moment from 'moment';
import Example_Review from './Model/Example_Review';
import ModalTest from "./Model/Model"; 
import { GetPaymentByIdCourseAndIdUser, GetUserByTutorId } from '../../../services/https';
import { UsersInterface } from '../../../interfaces/IUser';

const { Title, Text } = Typography;

function CourseDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const course = location.state?.course;
  const userID = Number(localStorage.getItem('id')) || 0;
  const [checkPayments, setCheckPayments] = useState<number>();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const updatedAt = course.UpdatedAt;
  const formattedDate = moment(updatedAt).format('DD MMMM YYYY');
  const formattedTime = moment(updatedAt).format('HH:mm');

  const [user, setUser] = useState<UsersInterface>();

  const showModal = () => {
      setIsModalVisible(true);
  };

  const CheckPayment = async (courseID: number) => {
    try {
      const paymentsData = await GetPaymentByIdCourseAndIdUser(courseID, userID);
      
      setCheckPayments(Array.isArray(paymentsData) ? 1 : 0);

    } catch (error) {
      console.error(`Error fetching payments for course ${courseID}:`, error);
    }
  };
  
  useEffect(() => {
    if (course.ID) {
      CheckPayment(course.ID); 
    }
  });

  const getUser = async (tutorProfileID: string) => {
    try {
        const UserData = await GetUserByTutorId(tutorProfileID);
        setUser(UserData.data);
    } catch (error) {
        console.error(`Unknown User`, error);
    }
};
  

useEffect(() => {
  
  if (!user) {
      const tutorProfileID = course.TutorProfileID;
      if (tutorProfileID !== undefined) {
          getUser(tutorProfileID.toString());
      }
  }
}, [course, user]);
  

  
  const handleCourseClick = () => {
    navigate(`/payment`, { state: { course } });
  };

  const handleCancel = () => {setIsModalVisible(false);};

  return (
    <>
      <HeaderComponent />
      <section
        style={{
          padding: '95px 50px 30px 50px',
          backgroundColor: '#f5f5f5',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            margin: '0px auto',
            maxWidth: '1200px',
            borderRadius: '20px',
            border: '2px solid #CBD0D8',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '50px 65px',
            backgroundColor: '#ffffff',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                width: '30%',
                height: '375px',
              }}
            >
              <Card
                cover={
                  <img
                    src={course.ProfilePicture || "https://via.placeholder.com/300x300"}
                    alt="Course"
                    style={{
                      borderRadius: '10px',
                      objectFit: 'cover',
                      width: '100%',
                      height: '250px',
                      padding: '10px',
                    }}
                  />
                }
                bordered={false}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '20px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
                styles={{body: { padding: '10px 25px' }}}
              >
                <Text type="secondary">Created by: {user?.Username|| "Unknown"}</Text>
                <br />
                <Text type="secondary">Updated: {formattedDate} {formattedTime || "N/A"}</Text>
              </Card>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '70%',
                padding: '20px',
              }}
            >
              <Title level={2}>{course.Title || "Course Title"}</Title>
              <Text
                style={{
                  fontSize: '24px',
                  color: '#003459',
                  fontWeight: 'bold',
                }}
              >
                {course.Price?.toFixed(2) || "0.00"} Bath
              </Text>
              { checkPayments === 1 ? (
                <div key={course.ID}>
                  <Button
                    type="primary"
                    style={{
                      borderRadius: '25px',
                      marginTop: '10px',
                      backgroundColor: '#696969',
                      borderColor: '#696969',
                    }}
                  >
                    คุณลงทะเบียนคอร์สนี้แล้ว
                  </Button>
                </div>
                ) : (
                  <div key={course.ID} onClick={() => handleCourseClick()}>
                    <Button
                      type="primary"
                      style={{
                        borderRadius: '25px',
                        marginTop: '10px',
                        backgroundColor: '#003459',
                        borderColor: '#003459',
                        transition: 'background-color 0.3s, border-color 0.3s',
                      }}

                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#002a3d';
                        e.currentTarget.style.borderColor = '#002a3d';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#003459';
                        e.currentTarget.style.borderColor = '#003459';
                      }}
                    >
                      ซื้อเลย
                    </Button>
                </div>
                )
              }

              <Divider style={{ margin: '20px' }} />

              <Text strong style={{ fontSize: '18px' }}>
                <u>This group consists of</u>
              </Text>

              <Text style={{ lineHeight: '2.0' }}>
                เวลาในการเรียน: {course.Duration || "N/A"} ชั่วโมง
                <br />
                รูปแบบในการเรียน: {course.TeachingPlatform || "N/A"}
                <br />
              </Text>

              <Divider style={{ margin: '20px' }} />

              <div
                style={{
                  borderRadius: '20px',
                  border: '2px solid rgba(63, 54, 54, 0.304)',
                  padding: '20px',
                  marginBottom: '10px',
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Text>
                  {course.Description || "Course description not available."}
                </Text>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '0px 45px',
            }}
          >
            <Divider />
            <Title level={3} style={{ color: '#667479' }}>
              Review
            </Title>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
              }}
            >
              <Example_Review course_id={course.ID}></Example_Review>
            </div>
            <div
              style={{
                flex: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Button
                type="link"
                style={{  
                  display: 'block',
                  textAlign: 'center',
                  color: '#002A48',
                  margin: '10px 0',
                }} onClick={showModal}
              >
                ดูเพิ่มเติม
              </Button>
            </div>
          </div>
        </div>
      </section>
      <ModalTest isVisible={isModalVisible} handleCancel={handleCancel} id={course.ID} />
    </>
  );
}

export default CourseDetail;
