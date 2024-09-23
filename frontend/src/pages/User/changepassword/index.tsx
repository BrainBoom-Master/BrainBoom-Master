import React from "react";
import { Space, Button, Col, Row, Divider, Form, Input, Card, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, Link, useParams } from "react-router-dom";
import { UpdatePasswordById } from "../../../services/https/index";

function ChangePassword() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    if (!id) {
      messageApi.error('ID ผู้ใช้ไม่พบ');
      return;
    }

    try {
      // ใช้ชื่อฟิลด์ที่ตรงกับที่คาดหวัง
      const payload = {
        old_password: values.current_password, // เปลี่ยนเป็น old_password
        new_password: values.new_password,     // ใช้ชื่อฟิลด์ที่คาดหวัง
        confirm_password: values.confirm_password, // เพิ่ม confirm_password
      };

      const res = await UpdatePasswordById(id, payload);

      if (res.status === 200) {
        messageApi.success(res.data.message || 'รหัสผ่านถูกเปลี่ยนเรียบร้อยแล้ว');
        setTimeout(() => {
          navigate("/profileuser");
        }, 2000);
      } else {
        messageApi.error(res.data.error || 'ไม่สามารถเปลี่ยนรหัสผ่านได้');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      messageApi.error('ไม่สามารถเปลี่ยนรหัสผ่านได้');
    }
  };

  return (
    <div>
      {contextHolder}
      <Row style={{ height: '100vh', backgroundColor: '#FFFFFF', margin: 0 }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}>
          <Card className="card-profile" style={{
            width: '100%',
            maxWidth: 600,
            height: 'auto',
            border: 'none',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}>
            <h2 style={{ textAlign: 'center' }}>เปลี่ยนรหัสผ่าน</h2>
            <Divider />
            <Form
              name="change-password"
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Form.Item
                    label="รหัสผ่านเดิม"
                    name="current_password"
                    rules={[{ required: true, message: "กรุณากรอกรหัสผ่านเดิม!" }]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Form.Item
                    label="รหัสผ่านใหม่"
                    name="new_password"
                    rules={[{ required: true, message: "กรุณากรอกรหัสผ่านใหม่!" }]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Form.Item
                    label="ยืนยันรหัสผ่านใหม่"
                    name="confirm_password"
                    rules={[{ required: true, message: "กรุณายืนยันรหัสผ่านใหม่!" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('new_password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="end">
                <Col style={{ marginTop: "40px" }}>
                  <Form.Item>
                    <Space>
                      <Link to="/profileuser">
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
        </Col>
      </Row>
    </div>
  );
}

export default ChangePassword;
