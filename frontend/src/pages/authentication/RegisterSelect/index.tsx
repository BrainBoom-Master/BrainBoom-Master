import {
  Button,
  Card,
  Row,
  Col,
  message
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo1 from "../../../assets/logo1.png";
import studentpic from "../../../assets/studentpic.png";
import tutorpic from "../../../assets/tutorpic.png";

function SignUpSelectPages() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

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

        <Col xs={24} sm={20} md={20} lg={20} xl={20} style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
          <Card className="card-login" style={{ width: "100%", height: "100%", maxWidth: 1100, border: "none", position: "relative", padding: "20px" }}>
            <Button type="link" onClick={() => navigate(-1)} style={{ position: "absolute", top: "10px", left: "10px", fontSize: "16px" }}>
              <ArrowLeftOutlined /> ย้อนกลับ
            </Button>
            <p style={{ fontSize: "3rem", textAlign: "center", display: "block", marginTop: "10px", fontFamily: "'Inter', sans-serif" }}>ประเภทบัญชีที่ต้องการสมัคร</p>
            <Row align={"middle"} justify={"center"} gutter={[16, 16]} style={{ textAlign: "center" }}>
              <Col xs={24} sm={12} md={12} lg={12} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <img
                  alt="tutor"
                  style={{ width: "60%", marginBottom: "20px" }}
                  src={tutorpic}
                  className="pic1"
                />
                <Button type="primary" className="select-form-button" style={{ marginBottom: 20 }} onClick={() => navigate("/tutorsignup" , )}>
                  Tutor
                </Button>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <img
                  alt="student"
                  style={{ width: "60%", marginBottom: "20px" }}
                  src={studentpic}
                  className="pic1"
                />
                <Button type="primary" className="select-form-button" style={{ marginBottom: 20 }} onClick={() => navigate("/studentsignup", )} >
                  Student
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default SignUpSelectPages;
