import React, { useEffect, useState } from 'react';
import { Card, Col, Row, message, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import HeaderComponent from '../../../components/headertutor/index';
import studentpic from '../../../assets/tutorpic.png';
import { EditOutlined } from '@ant-design/icons';
import { GetUserById as getUserByIdFromService, GetTutorProfileByUserId as getTutorProfileByIdFromService } from "../../../services/https/index";
import { Tutor as TutorProfile } from "../../../interfaces/Tutor";

function MyProfile() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [userData, setUserData] = useState<any>(null); 
  const [profileData, setProfileData] = useState<TutorProfile | null>(null); 
  const UserID = localStorage.getItem("id") || ""; 

  const fetchUserProfile = async (id: string) => {
    try {
      if (!id) {
        messageApi.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้ เนื่องจาก ID ไม่ถูกต้อง');
        return;
      }
  
      const userRes = await getUserByIdFromService(id);
  
      if (userRes.status === 200) {
        setUserData(userRes.data);
        
        const profileRes = await getTutorProfileByIdFromService(id) as { status: number; data: TutorProfile };
        if (profileRes.status === 200) {
          setProfileData(profileRes.data);
        } else {
          messageApi.error('ไม่พบข้อมูลโปรไฟล์อาจารย์');
        }
      } else {
        messageApi.error("ไม่พบข้อมูลผู้ใช้");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      messageApi.error('ไม่สามารถดึงข้อมูลผู้ใช้หรือโปรไฟล์ได้');
    }
  };

  useEffect(() => {
    if (UserID) {
      fetchUserProfile(UserID);
    } else {
      messageApi.error('ไม่พบ ID ผู้ใช้');
    }
  }, [UserID]);

  return (
    <>
      <HeaderComponent />
      {contextHolder}
      <Row style={{ height: '100vh', backgroundColor: '#FFFFFF', margin: 0 }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
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
                  src={userData?.Profile ? userData.Profile : studentpic}
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
              <h1>{userData?.FirstName} {userData?.LastName}</h1>
              <h3 style={{ color: 'gray' }}>{userData?.Email}</h3>
              <p><strong>การศึกษา:</strong> {profileData?.Education}</p>
              <p><strong>ประสบการณ์:</strong> {profileData?.Experience}</p>
              <p>
                <strong>ประวัติย่อ:</strong>
                {profileData?.Bio}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
              <Button
                style={{ width: 'calc(50% - 10px)' }}
                onClick={() => navigate(`/tutor_profiles/edit/${UserID}`)}
              >
                <EditOutlined /> แก้ไขข้อมูลโปรไฟล์
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default MyProfile;
