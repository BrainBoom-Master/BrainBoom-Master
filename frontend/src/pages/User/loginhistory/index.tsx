import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Table, message, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import HeaderComponent from '../../../components/header/index'; 
import { GetLoginHistoryByUserId as getLoginHistoryByUserIdFromService } from '../../../services/https/index';
import { HistoryInterface } from '../../../interfaces/IHistory';
import dayjs from 'dayjs';

const LoginHistory = () => {
  const navigate = useNavigate();
  const [loginHistory, setLoginHistory] = useState<HistoryInterface[]>([]);
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
      
      if (res && Array.isArray(res)) {
        setLoginHistory(res);
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

  const columns = [
    {
      title: 'ลำดับ',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1, // แสดงลำดับโดยใช้ index
    },
    {
      title: 'วันและเวลา',
      dataIndex: 'LoginTimestamp',
      key: 'loginTimestamp',
      render: (text: string) => dayjs(text).format("dddd DD MMM YYYY HH:mm:ss"),
    },
  ];

  return (
    <>
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
              rowKey="ID"
              columns={columns}
              dataSource={loginHistory}
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default LoginHistory;
