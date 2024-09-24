import React, { useEffect, useState } from 'react';
import { Card, Col, Row, message, Button } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';
import HeaderComponent from '../../../components/headertutor/index';
import studentpic from '../../../assets/tutorpic.png';
import { EditOutlined } from '@ant-design/icons';
import { GetUserById as getUserByIdFromService, GetTutorProfileById as getTutorProfileByIdFromService } from "../../../services/https/index";

function MyProfile() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [userData, setUserData] = useState<any>(null); 
  const [profileData, setProfileData] = useState<any>(null); 
  const id = localStorage.getItem("id") || ""; 

  console.log("Editing tutor with ID:", id);

  const fetchUserProfile = async (id: string) => {
    try {
      if (!id) {
        messageApi.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้ เนื่องจาก ID ไม่ถูกต้อง');
        return;
      }

      // ดึงข้อมูลผู้ใช้
      const userRes = await getUserByIdFromService(id);
      console.log('User Response:', userRes); // เพิ่มการตรวจสอบที่นี่
      if (userRes.status === 200) {
        setUserData(userRes.data);

        // ดึงข้อมูลโปรไฟล์อาจารย์
        const profileRes = await getTutorProfileByIdFromService(id);
        console.log('Profile Response:', profileRes); // เพิ่มการตรวจสอบที่นี่
        if (profileRes.status === 200) {
          setProfileData(profileRes.data);
        } else {
          messageApi.open({
            type: 'error',
            content: 'ไม่พบข้อมูลโปรไฟล์อาจารย์',
          });
        }
      } else {
        messageApi.open({
          type: "error",
          content: "ไม่พบข้อมูลผู้ใช้",
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error('Error fetching user data or tutor profile:', error);
      messageApi.error('ไม่สามารถดึงข้อมูลผู้ใช้หรือโปรไฟล์ได้');
    }
  };

  useEffect(() => {
    if (id && id !== 'undefined') {
      fetchUserProfile(id);
    } else {
      messageApi.error('ไม่พบ ID ผู้ใช้');
    }
  }, [id]);

  return (
    <>
      <HeaderComponent />
      {contextHolder}
      <Row style={{ height: '100vh', backgroundColor: '#FFFFFF', margin: 0 }}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={24}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <Card
            className="card-profile"
            style={{
              width: '100%',
              maxWidth: 1400,
              height: 'auto',
              border: 'none',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Row gutter={[16, 24]} justify="center">
              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <img
                  src={studentpic}
                  alt="Profile"
                  className="pic2"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '100%',
                    marginBottom: '20px',
                  }}
                />
              </Col>
            </Row>
            <div style={{ textAlign: 'center' }}>
              <h1>{userData?.first_name} {userData?.last_name}</h1>
              <h3 style={{ color: 'gray' }}>{userData?.email}</h3>
              <p><strong>การศึกษา:</strong> {profileData?.education}</p>
              <p><strong>ประสบการณ์:</strong> {profileData?.experience}</p>
              <div style={{ marginTop: '20px' }}>
                <strong>ประวัติย่อ:</strong>
                <p>{profileData?.bio}</p>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                flexWrap: 'wrap',
                marginTop: '20px',
              }}
            >
              <Button
                style={{ width: 'calc(50% - 10px)' }}
                onClick={() => navigate(`/tutor_profiles/edit/${id}`)}
              >
                <EditOutlined /> แก้ไขข้อมูลโปรไฟล์
              </Button>
            </div>
            <Outlet />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default MyProfile;
