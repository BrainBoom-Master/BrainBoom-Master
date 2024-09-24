import React, { useEffect, useState } from 'react';
import { Card, Col, Row, message, Button } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom'; // นำเข้า Outlet
import HeaderComponent from '../../components/header/index';
import studentpic from '../../assets/studentpic.png';
import { LockOutlined, EditOutlined , HistoryOutlined } from '@ant-design/icons';
import { GetUserById as getUserByIdFromService } from "../../services/https/index";

function ProfileUser() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null); 
  const id = localStorage.getItem("id");

  const [messageApi, contextHolder] = message.useMessage();

  const username = localStorage.getItem('username') || 'Unknown User';
  //const user_role_id = localStorage.getItem('user_role_id') || 'Unknown Role';

  const fetchUserById = async (id: string) => {
    try {
      if (!id) {
        messageApi.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้ เนื่องจาก ID ไม่ถูกต้อง');
        return;
      }

      const res = await getUserByIdFromService(id);
      if (res.status === 200) {
        setUserData(res.data); 
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
      console.error('Error fetching user data:', error);
      messageApi.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    }
  };

  useEffect(() => {
    if (id && id !== 'undefined') {
      fetchUserById(id); 
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
    src={userData && userData.Profile ? userData.Profile : studentpic} // ใช้รูปประจำตัวจาก userData หรือรูปโปรไฟล์เริ่มต้น
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
              <h1>ยินดีต้อนรับ, {username}</h1>
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
                style={{ width: 'calc(33% - 10px)' }}
                onClick={() => navigate(`/users/edit/${id}`)} 
              >
                <EditOutlined /> แก้ไขข้อมูลผู้ใช้
              </Button>
              <Button
                style={{ width: 'calc(33% - 10px)' }}
                onClick={() => navigate(`/users/password/${id}`)} 
              >
                <LockOutlined /> เปลี่ยนรหัสผ่าน
              </Button>
              <Button
                style={{ width: 'calc(33% - 10px)' }} 
                onClick={() => navigate(`/users/loginhistory/${id}`)} 
              >
                <HistoryOutlined /> ประวัติการเข้าสู่ระบบ
              </Button>
            </div>
            <Outlet />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default ProfileUser;
