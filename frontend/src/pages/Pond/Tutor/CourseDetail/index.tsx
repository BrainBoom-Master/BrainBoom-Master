//import { useEffect, useState } from 'react';
import { Card, Button, Typography, Divider } from 'antd';
import { useLocation  } from 'react-router-dom';
import HeaderComponent from '../../../components/header';
import moment from 'moment';

const { Title, Text } = Typography;

function CourseDetail() {
  const location = useLocation();
  const course = location.state?.course;
  console.log(course.ID);  

  const updatedAt = course.UpdatedAt;
  const formattedDate = moment(updatedAt).format('DD MMMM YYYY');
  const formattedTime = moment(updatedAt).format('HH:mm');

  // Your existing code with course data rendering
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
                      height: '300px',
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
                <Text type="secondary">Created by: {course.TutorProfileID || "Unknown"}</Text>
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
              {/* {reviews.map((review) => (
                <Card
                  key={review.id}
                  hoverable
                  style={{
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    padding: '0px',
                  }}
                  bodyStyle={{ padding: '10px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '15px',
                    }}
                  >
                    <img
                      src={review.imageUrl}
                      alt={review.name}
                      style={{
                        borderRadius: '50%',
                        objectFit: 'cover',
                        width: '65px',
                        height: '65px',
                      }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <Text strong style={{ fontSize: '16px' }}>
                        {review.name}
                      </Text>
                      <span style={{ color: '#FFD700', fontSize: '16px', fontWeight: 'bold' }}>
                        {'★'.repeat(Math.floor(review.rating))}
                      </span>
                      <Text type="secondary" style={{ marginTop: '5px' }}>
                        {review.comment}
                      </Text>
                    </div>
                  </div>
                </Card>
              ))} */}
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
                }}
              >
                ดูเพิ่มเติม
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CourseDetail;
