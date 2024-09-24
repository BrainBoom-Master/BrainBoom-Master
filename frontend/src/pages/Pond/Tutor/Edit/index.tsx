import { useState, useEffect } from 'react';
import HeaderComponent from '../../../../components/header';
import { Typography, message, Select } from 'antd';
const { Title } = Typography;
import { Input, Button, Upload, UploadFile } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
const { TextArea } = Input;
import { CourseInterface } from "../../../../interfaces/ICourse";
import { CourseCategoryInterface } from "../../../../interfaces/ICourse_Category"
import { GetCourseCategories, UpdateCourse } from '../../../../services/https';
import { PlusOutlined } from '@ant-design/icons';

function Edit() {
  const location = useLocation();
  const [categories, setCategories] = useState<CourseCategoryInterface[]>([]);
  //const tutor = location.state?.tutor;
  const course = location.state?.course;

  const GetCategory = async () => {
    try {
      const categories = await GetCourseCategories();
      if (categories) {
        setCategories(categories);
      } else {
        console.error('No categories found');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    GetCategory();
  }, []);

  const [formData, setFormData] = useState<CourseInterface>({
    Title: course?.Title || '',
    ProfilePicture: course?.ProfilePicture || '',
    Price: course?.Price || 0,
    TeachingPlatform: course?.TeachingPlatform || '',
    Description: course?.Description || '',
    Duration: course?.Duration || 0,
    CourseCategoryID: course?.CourseCategoryID || 0,
  });

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'Price') {
      const regex = /^\d*\.?\d{0,2}$/;
      if (regex.test(value) || value === '') {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value ? parseFloat(value) : 0,
        }));
      }
    } else if (name === 'Duration') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value ? parseInt(value, 10) : 0,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleUploadChange = (info: { fileList: UploadFile[] }) => {
    const file = info.fileList[0]?.originFileObj;

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevData) => ({
          ...prevData,
          ProfilePicture: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      message.error('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น');
    }

    setFileList(info.fileList);
  };

  const handleCategoryChange = (value: number) => {
    setFormData((prevData) => ({
      ...prevData,
      CourseCategoryID: value,
    }));
  };

  const handleSubmit = async () => {
    if (!course) {
      messageApi.error('ข้อมูลไม่ครบถ้วน');
      return;
    }

    const payload = {
      ...formData,
      CourseCategoryID: formData.CourseCategoryID,
    };

    if (!formData.Title || formData.Price <= 0 || formData.Duration <= 0 || formData.TeachingPlatform === '' || !formData.CourseCategoryID) {
      messageApi.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      const res = await UpdateCourse(course.ID ,payload);
      if (res) {
        messageApi.success('แก้ไขหลักสูตรสำเร็จ');
        navigate('/tutor');
      } else {
        messageApi.error(`Error: ${res.message}`);
      }
    } catch (error) {
      console.error('Error editing course:', error);
      messageApi.error('เกิดข้อผิดพลาดในการแก้ไขหลักสูตร');
    }
  };

  return (
    <>
      {contextHolder}
      <HeaderComponent />
      <section style={{ padding: "95px 50px 30px 50px" }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          margin: '0px auto',
          maxWidth: '1200px',
          borderRadius: '20px',
          border: '2px solid #e0e0e0',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          padding: '50px 100px',
          backgroundColor: '#ffffff',
          fontFamily: 'Inter, sans-serif',
          gap: '40px',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '30%',
            gap: '15px',
          }}>
            <Title level={2} style={{ color: '#333d51' }}>แก้ไขหลักสูตร</Title>
            <div style={{ width: '250px', height: '250px' }}>
              <img
                src={formData.ProfilePicture || "https://via.placeholder.com/150x150"}
                alt="Profile"
                style={{ width: '100%', height: '100%', borderRadius: '20px' }}
              />
            </div>
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              maxCount={1}
              beforeUpload={() => false}
              listType="picture-card"
              style={{ marginTop: '10px' }}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>อัพโหลดรูปประจำตัว</div>
              </div>
            </Upload>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '70%',
            justifyContent: 'center',
            padding: '20px',
            gap: '20px',
          }}>
            <div>
              <Title level={5}>ชื่อหลักสูตร</Title>
              <Input
                placeholder="ชื่อหลักสูตร"
                name="Title"
                value={formData.Title}
                onChange={handleChange}
                style={{
                  padding: '12px 15px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              />
            </div>
            <div>
              <Title level={5}>ราคา</Title>
              <Input
                placeholder="ราคา"
                name="Price"
                type="text"
                value={formData.Price.toString()}
                onChange={handleChange}
                style={{
                  padding: '12px 15px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              />
            </div>
            <div>
              <Title level={5}>ระยะเวลา (ชั่วโมง)</Title>
              <Input
                placeholder="ระยะเวลา (ชั่วโมง)"
                name="Duration"
                type="number"
                value={formData.Duration}
                onChange={handleChange}
                style={{
                  padding: '12px 15px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              />
            </div>
            <div>
              <Title level={5}>แพลตฟอร์มที่ใช้สอน</Title>
              <Input
                placeholder="แพลตฟอร์มที่ใช้สอน"
                name="TeachingPlatform"
                value={formData.TeachingPlatform}
                onChange={handleChange}
                style={{
                  padding: '12px 15px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              />
            </div>
            <div>
              <Title level={5}>คำอธิบาย</Title>
              <TextArea
                placeholder="คำอธิบาย"
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                style={{
                  padding: '12px 15px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  height: '150px',
                  resize: 'vertical',
                }}
              />
            </div>
            <div>
              <Title level={5}>เลือกหมวดหมู่</Title>
              <Select
                placeholder="เลือกหมวดหมู่"
                onChange={handleCategoryChange}
                style={{ width: '100%' }}
              >
                {categories.map((category) => (
                  <Select.Option key={category.ID} value={category.ID}>
                    {category.CategoryName}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{
                padding: '12px 20px',
                backgroundColor: '#333d51',
                color: 'white',
                borderRadius: '20px',
                fontSize: '18px',
                fontWeight: 'bold',
                width: '150px',
                height: '50px',
              }}
            >
              ยืนยัน
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Edit;
