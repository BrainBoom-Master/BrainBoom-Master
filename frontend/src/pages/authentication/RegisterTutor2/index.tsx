import { Button, Card, Form, Input, message, Row, Col, Upload } from "antd";
import React, { useState } from "react";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { CreateUser } from "../../../services/https"; // เรียกใช้ API สำหรับสร้างผู้ใช้
import ImgCrop from "antd-img-crop";
import type { UploadFile, UploadProps } from "antd";
import logo1 from "../../../assets/logo1.png";

type FileType = Parameters<UploadProps["beforeUpload"]>[0];

function SignUpTutor2Pages() {
  const navigate = useNavigate();
  const location = useLocation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [messageApi, contextHolder] = message.useMessage(); // ใช้ message เพื่อแสดงผลข้อความ
  
  // รับข้อมูลจากหน้าที่หนึ่ง
  const initialValues = location.state || {};

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onFinish = async (values: any) => {
    const formData = new FormData(); // ใช้ FormData เพื่อแนบไฟล์ภาพ
  
    // ข้อมูลสำหรับตาราง Users
    formData.append("first_name", initialValues.first_name);
    formData.append("last_name", initialValues.last_name);
    formData.append("email", initialValues.email);
    formData.append("birthday", initialValues.birthday);
    formData.append("username", initialValues.username);
    formData.append("password", initialValues.password);
    formData.append("gender_id", initialValues.gender);
  
    // ข้อมูลสำหรับตาราง TutorProfiles
    formData.append("education", values.education);
    formData.append("experience", values.experience);
    formData.append("bio", values.bio);
  
    // ตรวจสอบว่ามีรูปภาพที่ผู้ใช้อัพโหลดหรือไม่
    if (fileList.length > 0) {
      formData.append("profile_picture", fileList[0].originFileObj as File);
    }
  
    try {
      const response = await CreateUser(formData); // เรียก API สร้างผู้ใช้
      
      // ตรวจสอบสถานะการตอบกลับของ API
      if (response && response.status === 200) {
        messageApi.success("สมัครสมาชิกสำเร็จ"); // แสดงข้อความสำเร็จ
        navigate("/login"); // ไปยังหน้าเข้าสู่ระบบ
      } else {
        throw new Error("ไม่สามารถสมัครสมาชิกได้");
      }
    } catch (error) {
      console.error(error);
      messageApi.error("การสมัครไม่สำเร็จ"); // แสดงข้อความข้อผิดพลาด
    }
  };
  

  return (
    <>
      {contextHolder}
      <Row style={{ height: "100vh", backgroundColor: "#FFFF" }}>
        <Col
          xs={24}
          sm={4}
          md={4}
          lg={4}
          xl={4}
          style={{
            backgroundColor: "#333D51",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <img
            alt="logo"
            style={{ width: "50%", marginTop: "-200%" }}
            src={logo1}
            className="images-logo"
          />
        </Col>

        <Col
          xs={24}
          sm={20}
          md={20}
          lg={20}
          xl={20}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: "50px",
          }}
        >
          <Card className="card-login" style={{ width: "100%", height: "100%", border: "none", padding: "30px" }}>
            <Button
              type="link"
              onClick={() => navigate(-1)}
              style={{ position: "absolute", top: "10px", left: "10px", fontSize: "16px" }}
            >
              <ArrowLeftOutlined /> ย้อนกลับ
            </Button>
            <Row align={"middle"} justify={"center"}>
              <Col xs={24} sm={20} md={20} lg={20} xl={20}>
                <h2 className="header" style={{ marginBottom: "50px", textAlign: "center" }}>
                  Tutor Account Sign Up (Step 2)
                </h2>

                <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">
                  <Row gutter={[16, 0]} align={"middle"}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        label="Education"
                        name="education"
                        rules={[{ required: true, message: "กรุณากรอกข้อมูลการศึกษา !" }]}
                      >
                        <Input placeholder="Bachelor's in..." />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        label="Experience"
                        name="experience"
                        rules={[{ required: true, message: "กรุณากรอกข้อมูลประสบการณ์ !" }]}
                      >
                        <Input placeholder="5 years of teaching..." />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        label="Bio"
                        name="bio"
                        rules={[{ required: true, message: "กรุณากรอกข้อมูลประวัติส่วนตัว !" }]}
                      >
                        <Input.TextArea placeholder="Brief bio..." rows={4} />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        label="Profile Picture"
                        name="profile_picture"
                        valuePropName="fileList"
                        getValueFromEvent={(e: any) => {
                          if (Array.isArray(e)) {
                            return e;
                          }
                          return e && e.fileList;
                        }}
                        rules={[{ required: true, message: "กรุณาอัพโหลดรูปโปรไฟล์ !" }]}
                      >
                        <ImgCrop rotationSlider>
                          <Upload
                            fileList={fileList}
                            onChange={onChange}
                            onPreview={onPreview}
                            beforeUpload={(file) => {
                              setFileList([file]); // Update fileList with the new file
                              return false; // Prevent auto-upload
                            }}
                            listType="picture-card"
                            maxCount={1}
                          >
                            {fileList.length < 1 && (
                              <div>
                                <PlusOutlined /> Upload
                              </div>
                            )}
                          </Upload>
                        </ImgCrop>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{ marginBottom: 20 }}>
                          สมัครสมาชิก
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default SignUpTutor2Pages;
