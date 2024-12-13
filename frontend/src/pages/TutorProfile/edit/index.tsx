import React, { useEffect } from "react";
import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Tutor } from "../../../interfaces/Tutor";
import { GetTutorProfileByUserId, UpdateTutorById } from "../../../services/https/index";
import { useNavigate, Link } from "react-router-dom";

function EditTutor() {
  const navigate = useNavigate();
  const UserID = localStorage.getItem('id') || 'Unknown User';
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  useEffect(() => {
    if (UserID) {
      fetchTutorProfile(UserID);
    }
  }, [UserID]);

  // Fetch tutor data by ID
  const fetchTutorProfile = async (id: string) => {
    try {
      const res = await GetTutorProfileByUserId(id);
      if (res.status === 200) {
        form.setFieldsValue({
          Bio: res.data.Bio,
          Education: res.data.Education,
          Experience: res.data.Experience,
        });
      } else {
        messageApi.open({
          type: "error",
          content: "ไม่พบข้อมูลผู้สอน",
        });
        setTimeout(() => {
          navigate("/users");
        }, 2000);
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูล",
      });
    }
  };

  // Update tutor data
  const onFinish = async (values: Tutor) => {
    const payload = { ...values };
    const res = await UpdateTutorById(UserID, payload);

    if (res.status === 200) {
      messageApi.open({ type: "success", content: res.data.message });
      setTimeout(() => navigate(`/tutor_profiles`), 2000);
    } else {
      messageApi.open({ type: "error", content: res.data.error });
    }
  };

  return (
    <div>
      {contextHolder}
      <Row style={{ height: '100vh', backgroundColor: '#FFFFFF', margin: 0 }}>
        <Card
          className="card-profile"
          style={{
            marginTop: '100px',
            width: '100%',
            maxWidth: 1400,
            height: 'auto',
            border: 'none',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          <h2 style={{ textAlign: 'left' }}>แก้ไขข้อมูลผู้สอน</h2>
          <Divider />
          <Form
            name="tutorEditForm"
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Row gutter={[16, 0]}>
              <Col xs={24}>
                <Form.Item
                  label="ประวัติย่อ"
                  name="Bio"
                  rules={[{ required: true, message: "กรุณากรอกประวัติย่อ!" }]}
                >
                  <Input.TextArea rows={2} placeholder="กรุณากรอกประวัติย่อ" style={{ textAlign: 'left' }} />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="การศึกษา"
                  name="Education"
                  rules={[{ required: true, message: "กรุณากรอกการศึกษา!" }]}
                >
                  <Input.TextArea rows={2} placeholder="กรุณากรอกการศึกษา" style={{ textAlign: 'left' }} />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="ประสบการณ์"
                  name="Experience"
                  rules={[{ required: true, message: "กรุณากรอกประสบการณ์!" }]}
                >
                  <Input.TextArea rows={2} placeholder="กรุณากรอกประสบการณ์" style={{ textAlign: 'left' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col style={{ marginTop: "40px" }}>
                <Form.Item>
                  <Space>
                    <Link to="/users">
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

export default EditTutor;
