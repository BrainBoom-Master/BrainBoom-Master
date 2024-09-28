
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, message, Row, Col, DatePicker, Select } from "antd";
import Sidebar from "../ADD/Sidebar";
import { CreateUserByAdmin } from "../../../services/https";
import { UsersInterface } from "../../../interfaces/IUser";
import "../Dashboard/apptest.css";

const FormCreate = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [openSidebarToggle, setOpenSidebarToggle] = useState<boolean>(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const onFinish = async (values: UsersInterface) => {
    const res = await CreateUserByAdmin(values);
    if (res.success) {
      messageApi.open({
        type: "success",
        content: res.message || "User created successfully",
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.message || "An error occurred while creating the user",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Row style={{ width: "100%", height: "100vh", backgroundColor: "#FFFF" , flexDirection:"column",}}>
        <Col
        xs={24}
        sm={24}
        md={24}
        lg={24}
        xl={24} 
        >
          <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        </Col>

        <Col
          xs={24}
          sm={20}
          md={20}
          lg={20}
          xl={20}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "50px",
          }}
        >
          <Card
            className="card-login"
            style={{ width: "100%", maxWidth: 1300, border: "none", padding: "20px" }}
          >
            <Row align={"middle"} justify={"center"}>
              <Col xs={24} sm={20}>
                <h1 style={{ textAlign: "left", color: "#3D8C3C", fontSize: "36px", fontWeight: "bold" }}>CREATE USER</h1>

                <Form
                  name="basic"
                  layout="vertical"
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  <Row gutter={[16, 0]} align={"middle"}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        label="ชื่อ"
                        name="first_name"
                        rules={[{ required: true, message: "กรุณากรอกชื่อ !" }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        label="นามสกุล"
                        name="last_name"
                        rules={[{ required: true, message: "กรุณากรอกนามสกุล !" }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        label="อีเมล"
                        name="email"
                        rules={[
                          { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง !" },
                          { required: true, message: "กรุณากรอกอีเมล !" },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        label="วัน/เดือน/ปี เกิด"
                        name="birthday"
                        rules={[{ required: true, message: "กรุณาเลือกวัน/เดือน/ปี เกิด !" }]}
                      >
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: "กรุณากรอก Username !" }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน !" }]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        rules={[
                          { required: true, message: "กรุณากรอกรหัสผ่าน !" },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) {
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

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
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

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Role"
                        name="user_role_id"
                        rules={[{ required: true, message: "กรุณาเลือกบทบาท !" }]}
                      >
                        <Select
                          defaultValue=""
                          style={{ width: "100%" }}
                          options={[
                            { value: "", label: "กรุณาเลือกบทบาท", disabled: true },
                            { value: 3, label: "Student" },
                            { value: 2, label: "Tutor" },
                            { value: 1, label: "Admin" },
                          ]}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-from-button" style={{ width: "100%" }}>
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
};

export default FormCreate;
