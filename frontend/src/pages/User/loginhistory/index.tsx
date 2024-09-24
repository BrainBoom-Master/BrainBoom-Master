import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Table, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import HeaderComponent from '../../../components/header/index'; // นำเข้า Navbar
import { GetLoginHistoryByUserId as getLoginHistoryByUserIdFromService } from '../../../services/https/index'; // บริการดึงข้อมูล login_history

const LoginHistory = () => {
  const navigate = useNavigate();
  const [loginHistory, setLoginHistory] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();
  const id = localStorage.getItem('id');

  const fetchLoginHistory = async (userId: string) => {
    try {
      if (!userId) {
        messageApi.error('ไม่สามารถดึงข้อมูลประวัติการเข้าสู่ระบบได้ เนื่องจาก ID ไม่ถูกต้อง');
        return;
      }

      const res = await getLoginHistoryByUserIdFromService(userId); 
      if (res.status === 200) {
        setLoginHistory(res.data);
      } else {
        messageApi.error('ไม่พบข้อมูลประวัติการเข้าสู่ระบบ');
      }
    } catch (error) {
      console.error('Error fetching login history:', error);
      messageApi.error('เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && id !== 'undefined') {
      fetchLoginHistory(id); 
    } else {
      messageApi.error('ไม่พบ ID ผู้ใช้');
    }
  }, [id]);

  // กำหนดคอลัมน์ของตาราง
  const columns = [
    {
      title: 'วันและเวลา',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: string) => new Date(text).toLocaleString(), // แปลง timestamp ให้เป็นรูปแบบที่อ่านง่าย
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (text === 'success' ? 'สำเร็จ' : 'ล้มเหลว'), // แปลสถานะการเข้าสู่ระบบ
    },
  ];

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
            className="card-history"
            style={{
              width: '100%',
              maxWidth: 1400,
              height: 'auto',
              border: 'none',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
          >
            <h1 style={{ textAlign: 'center' }}>ประวัติการเข้าสู่ระบบ</h1>
            <Table
              columns={columns} // กำหนดคอลัมน์
              dataSource={loginHistory} // กำหนดข้อมูล
              loading={loading} // แสดง loading ขณะรอดึงข้อมูล
              rowKey="id" // กำหนด key ของแต่ละ row
              pagination={{ pageSize: 10 }} // ตั้งค่าการแบ่งหน้า
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default LoginHistory;
