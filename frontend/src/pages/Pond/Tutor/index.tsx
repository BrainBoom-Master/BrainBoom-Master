import { useState, useEffect } from 'react';
import HeaderComponent from '../../../components/header';
import { Button, Input, Card, Row, Col, Typography, Space, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { GetCourseByTutorID, DeleteCourseByID, GetTutorProfileById, SearchCourseByKeyword } from '../../../services/https';
import { CourseInterface } from '../../../interfaces/ICourse';
import { TutorInterface } from '../../../interfaces/Tutor';

const { Search } = Input;
const { Text, Title } = Typography;

function Tutor() {
  const [courses, setCourses] = useState<CourseInterface[]>([]);
  const [tutor, setTutor] = useState<TutorInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const userID = localStorage.getItem('id') ? Number(localStorage.getItem('id')) : 0;

  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<string>();
  const [deleteId, setDeleteId] = useState<number>();

  const navigate = useNavigate();

  const handleCourseClick = (course: CourseInterface) => {
    navigate(`/tutor/${course.ID}`, { state: { course } });
  };

  const handleCreateClick = () => {
    if (tutor) {
      navigate(`/tutor/create`, { state: { tutor } });
    }
  };

  const handleEditClick = (course: CourseInterface) => {
    navigate(`/tutor/edit/${course.ID}`, { state: { course } });
  };

  const showModal = (val: CourseInterface) => {
    setModalText(
      `คุณต้องการลบคอร์ส "${val.Title}" หรือไม่?`
    );
    setDeleteId(val.ID);
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    if (deleteId !== undefined) { 
        const res = await DeleteCourseByID(deleteId);
        if (res) {
            setOpen(false);
            messageApi.open({
                type: "success",
                content: "ลบข้อมูลสำเร็จ",
            });
            if (tutor) {
              const updatedCourses = await GetCourseByTutorID(tutor.ID);
              setCourses(updatedCourses);
          }

        } else {
            setOpen(false);
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาด!",
            });
        }
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSearch = async (value: string) => {
    try {
      if (value.trim() === '') {
        if(tutor){
          const coursesData = await GetCourseByTutorID(tutor.ID);
          setCourses(coursesData);
        }
      } else {
        const searchResults = await SearchCourseByKeyword(value);
        
        if (searchResults && Array.isArray(searchResults)) {
          setCourses(searchResults);
        } else {
          console.error('ไม่พบหลักสูตรหรือเกิดข้อผิดพลาดในการค้นหา');
          message.error('ไม่พบหลักสูตรที่ค้นหา');
        }
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการค้นหา:', error);
      message.error('เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง');
    }
  };
  
  

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const tutorProfile = await GetTutorProfileById(userID);
        setTutor(tutorProfile.data);

        if (tutorProfile && tutorProfile.data.ID) {
          const coursesData = await GetCourseByTutorID(tutorProfile.data.ID);
          if (Array.isArray(coursesData)) {
            setCourses(coursesData);
          } else {
            console.error('Received data is not an array:', coursesData);
          }
        } else {
          console.error('Tutor profile not found:', tutorProfile);
        }
      } catch (error) {
        console.error('Error fetching courses or tutor profile:', error);
        message.error('เกิดข้อผิดพลาดในการดึงข้อมูลหลักสูตรหรือโปรไฟล์ผู้สอน');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [userID]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {contextHolder}
      <HeaderComponent />
      <section style={{ padding: "95px 50px 30px 50px", backgroundColor: "#f9f9f9" }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '0px auto',
          maxWidth: '1200px',
          borderRadius: '20px',
          border: '2px solid #e0e0e0',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          padding: '50px 100px',
          backgroundColor: '#ffffff',
          fontFamily: 'Inter, sans-serif',
        }}>
          <Title level={2} style={{ color: '#333d51' }}>หลักสูตร</Title>
          <Space style={{ marginBottom: '20px', justifyContent: 'space-between' }}>
            <Search
              placeholder="ค้นหาหลักสูตร"
              onSearch={handleSearch}
              style={{
                width: 500,
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Button
              type="primary"
              onClick={handleCreateClick}
              style={{
                backgroundColor: '#333d51',
                borderColor: '#333d51',
                borderRadius: '10px',
                padding: '0 20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              สร้างหลักสูตร
            </Button>
          </Space>

          <Row gutter={[15, 15]} justify="start">
            {courses.map(course => (
              <Col xs={24} sm={24} md={12} lg={12} key={course.ID}>
                <Card
                  style={{
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    transition: 'transform 0.3s',
                    height: '100%',
                  }}
                  hoverable
                  actions={[
                    <div onClick={() => handleEditClick(course)}><EditOutlined /></div>,
                    <DeleteOutlined key="delete" onClick={() => showModal(course)} />,
                  ]}
                >
                  <div onClick={() => handleCourseClick(course)}>
                    <Row gutter={100} align="top">
                      <Col span={7}>
                        <img
                          alt={course.Title}
                          src={course.ProfilePicture || "https://via.placeholder.com/200x200"}
                          style={{
                            borderRadius: '20px',
                            width: '120px',
                            height: '120px',
                            objectFit: 'cover',
                          }}
                        />
                      </Col>
                      <Col span={17}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Title level={4} style={{ color: '#333d51', margin: "0px" }}>{course.Title}</Title>
                          <Text style={{ color: '#7d7d7d' }}>จำนวนผู้สมัคร: {/*{course.CountStd || 0}*/}</Text>
                          <Space>
                            <Text>5.0{/*{course.Rating || 'N/A'} Tawun Edit Reviews*/}</Text>
                          </Space>
                          <Text strong style={{ color: '#ff4500' }}>฿{course.Price}</Text>
                        </Space>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>
      <Modal
        title="ลบข้อมูล?"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
}

export default Tutor;
