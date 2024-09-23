import React, { useEffect, useState } from "react";
import { Space, Button, Col, Row, Divider, Form, Input, Card, message, DatePicker, Select, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { UsersInterface } from "../../../interfaces/IUser";
import { GetUserById, UpdateUserById } from "../../../services/https/index";
import { useNavigate, Link } from "react-router-dom";
import dayjs from "dayjs";
import ImgCrop from "antd-img-crop";
import { UploadFile, UploadProps } from "antd";

function EditUser() {
  const navigate = useNavigate();
  const id = localStorage.getItem('id') || 'Unknown User';
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // ฟังก์ชันอัปเดตรายการไฟล์รูปภาพ
  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as File);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  // ดึงข้อมูลผู้ใช้เมื่อ id มีการเปลี่ยนแปลง
  useEffect(() => {
    if (id) {
      getUserById(id);
    }
  }, [id]);

  // ฟังก์ชันดึงข้อมูลผู้ใช้
  const getUserById = async (id: string) => {
    try {
      const res = await GetUserById(id);
      if (res.status === 200) {
        form.setFieldsValue({
          FirstName: res.data.FirstName,
          LastName: res.data.LastName,
          birthday: dayjs(res.data.birthday),
          gender_id: res.data.gender?.ID,
        });
        // ตั้งค่าโปรไฟล์รูปภาพ (ถ้ามี)
        if (res.data.Profile) {
          setFileList([
            {
              uid: "-1",
              name: "profile",
              status: "done",
              url: res.data.Profile, // URL รูปโปรไฟล์ที่ดึงมาจาก API
            },
          ]);
        }
      } else {
        messageApi.open({ type: "error", content: "ไม่พบข้อมูลผู้ใช้" });
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      messageApi.open({ type: "error", content: "ไม่สามารถดึงข้อมูลผู้ใช้ได้" });
    }
  };

  // ฟังก์ชันบันทึกข้อมูลผู้ใช้เมื่อแก้ไขเสร็จ
  const onFinish = async (values: UsersInterface) => {
    values.Profile = fileList[0].thumbUrl
    const res = await UpdateUserById(id, values);

    if (res.status === 200) {
      messageApi.open({ type: "success", content: res.data.message });
      setTimeout(() => navigate("/users"), 2000);
    } else {
      messageApi.open({ type: "error", content: res.data.error });
    }
  };

  return (
    <div>
      {contextHolder}
      <Row style={{ height: "100vh", backgroundColor: "#FFFFFF", margin: 0 }}>
        <Card
          className="card-profile"
          style={{
            marginTop: "100px",
            width: "100%",
            maxWidth: 1400,
            height: "auto",
            border: "none",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
        >
          <h2>แก้ไขข้อมูลผู้ใช้</h2>
          <Divider />
          <Form name="basic" form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item label="ชื่อจริง" name="FirstName" rules={[{ required: true, message: "กรุณากรอกชื่อ !" }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="นามสกุล"
                  name="LastName"
                  rules={[{ required: true, message: "กรุณากรอกนามสกุล !" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="วัน/เดือน/ปี เกิด"
                  name="birthday"
                  rules={[{ required: true, message: "กรุณาเลือกวัน/เดือน/ปี เกิด !" }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="เพศ"
                  name="gender_id"
                  rules={[{ required: true, message: "กรุณาเลือกเพศ !" }]}
                >
                  <Select
                    defaultValue=""
                    style={{ width: "100%" }}
                    options={[
                      { value: "", label: "กรุณาเลือกเพศ", disabled: true },
                      { value: 1, label: "Male" },
                      { value: 2, label: "Female" },
                    ]}
                  />
                </Form.Item>
              </Col>

              {/* ส่วนแก้ไขรูปโปรไฟล์ */}
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item label="รูปประจำตัว" name="profile" valuePropName="fileList">
                  <ImgCrop rotationSlider>
                    <Upload
                      fileList={fileList}
                      onChange={onChange}
                      onPreview={onPreview}
                      beforeUpload={(file) => {
                        setFileList([file]);
                        return false;
                      }}
                      maxCount={1}
                      multiple={false}
                      listType="picture-card"
                    >
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>คลิกเพื่ออัพโหลด</div>
                      </div>
                    </Upload>
                  </ImgCrop>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col style={{ marginTop: "40px" }}>
                <Form.Item>
                  <Space>
                    <Link to="/customer">
                      <Button htmlType="button" style={{ marginRight: "10px" }}>
                        ยกเลิก
                      </Button>
                    </Link>
                    <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                      บันทึก
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Row>
    </div>
  );
}

export default EditUser;
