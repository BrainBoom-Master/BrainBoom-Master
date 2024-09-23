import { useState } from "react";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { CreateUser } from "../../../services/https";
import { UsersInterface } from "../../../interfaces/IUser";
import logo1 from "../../../assets/logo1.png";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { Button, Card, Form, Input, message, Row, Col, DatePicker, Upload, Select } from "antd";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

function SignUpTutorPages() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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

  const onFinish = async (values: UsersInterface) => {
    values.Profile = fileList[0].thumbUrl;
    let res = await CreateUser(values);
    console.log(res);
    if (res.status === 201) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Row style={{ height: "100vh", backgroundColor: "#FFFF" }}>
        <Col xs={24} sm={4} md={4} lg={4} xl={4} style={{ backgroundColor: "#333D51", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", position: "relative" }}>
          <img
            alt="logo"
            style={{ width: "50%" , marginTop: "-200%"}}
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
          <Card
            className="card-login"
            style={{ width: 1100, height: "100%", border: "none" , padding: "30px" }}
          >
            <Button
              type="link"
              onClick={() => navigate(-1)}
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                fontSize: "16px",
              }}
            >
              <ArrowLeftOutlined /> ย้อนกลับ
            </Button>
            <Row align={"middle"} justify={"center"}>
              <Col xs={24} sm={20} md={20} lg={20} xl={20}>
                <h2 className="header" style={{ marginBottom: "50px" , textAlign: 'center'}}>
                  Tutor Account Sign Up
                </h2>

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
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกชื่อ !",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        label="นามสกุล"
                        name="last_name"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกนามสกุล !",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        label="อีเมล"
                        name="email"
                        rules={[
                          {
                            type: "email",
                            message: "รูปแบบอีเมลไม่ถูกต้อง !",
                          },
                          {
                            required: true,
                            message: "กรุณากรอกอีเมล !",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        label="วัน/เดือน/ปี เกิด"
                        name="birthday"
                        rules={[
                          {
                            required: true,
                            message: "กรุณาเลือกวัน/เดือน/ปี เกิด !",
                          },
                        ]}
                      >
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกรหัสผ่าน !",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกรหัสผ่าน !",
                          },
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกรหัสผ่าน !",
                          },
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
                        rules={[
                          {
                            required: true,
                            message: "กรุณาเลือกเพศ !",
                          },
                        ]}
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

                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        label="รูปประจำตัว"
                        name="profile"
                        valuePropName="fileList"
                      >
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
                              <div style={{ marginTop: 8 }}>
                                คลิกเพื่ออัพโหลด
                              </div>
                            </div>
                          </Upload>
                        </ImgCrop>
                      </Form.Item>
                    </Col>

                    {/* New Field for User Role */}
                    
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
  <Form.Item
    label="Role"
    name="user_role_id"
    initialValue={2} // This is the value for 'Student'
    noStyle
  >
    <Input type="hidden" value={2} />
  </Form.Item>
  <Form.Item label="Role Display">
    <Input disabled value="This is Tutor User!" />
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
}

export default SignUpTutorPages;
