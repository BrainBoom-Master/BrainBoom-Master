import { Button, Card, Form, Input, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { SignIn , AddLoginHistory as LoginHistory } from "../../../services/https";
import { SignInInterface } from "../../../interfaces/SignIn";
import logo1 from "../../../assets/logo1.png";
import pic1 from "../../../assets/pic1.png";
import axios from "axios";


function SignInPages() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: SignInInterface) => {
    try {
      // ทำการเรียกฟังก์ชัน SignIn
      const res = await SignIn(values);
      console.log("Response:", res); // ตรวจสอบโครงสร้างของ response
  
      if (res.status === 200) {
        const userRoleId = res.data.user_role_id; // รับค่า user_role_id จากการตอบกลับ
        console.log("user_role_id from response:", userRoleId);
        console.log("id from response:", res.data.id);
        console.log("username from response:", res.data.username);

        await LoginHistory(res.data.id);
        // แสดงข้อความสำเร็จ
        messageApi.success("Sign-in successful");
  
        // จัดเก็บข้อมูลลง localStorage
        // หลังจากล็อกอินสำเร็จ
        console.log(res.data);
        
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("page", "dashboard");
        localStorage.setItem("token_type", res.data.token_type);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("user_role_id", userRoleId.toString()); // จัดเก็บ user_role_id
        localStorage.setItem("username", res.data.username); // จัดเก็บ username

        // เปลี่ยนเส้นทางตาม user_role_id
        setTimeout(() => {
          if (userRoleId === 2) {
            navigate("/"); 
          } else {
            navigate("/"); 
          }
        }, 2000);
      } else {
        // แสดงข้อความข้อผิดพลาดหากการตอบกลับไม่ใช่ 200
        messageApi.error(res.data.error);
      }
    } catch (error) {
      // จัดการข้อผิดพลาดที่เกิดจากการเรียก SignIn
      if (axios.isAxiosError(error)) {
        messageApi.error(error.response ? error.response.data.message : 'An unexpected error occurred');
      } else {
        messageApi.error('An unexpected error occurred');
      }
    }
  };
  
  return (
    <>
      {contextHolder}
      <Row style={{ height: "100vh" }}>
        {/* Left Side (Logo) */}
        <Col xs={24} sm={12} md={12} lg={12} xl={12} style={{ backgroundColor: "#333D51", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", position: "relative" }}>
        <img
          alt="logo"
          style={{  width: "25%" ,marginBottom: "40px"}}
          src={logo1}
          className="images-logo"
        />
        <img
          alt="pic1"
          style={{ width: "60%", alignItems: "center", flexDirection: "column" , }}
          src={pic1}
          className="pic1"
        />
      </Col>


        {/* Right Side (Form) */}
        <Col xs={24} sm={12} md={12} lg={12} xl={12} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Card style={{ width: "70%",border: "none", }}>
          <p style={{ fontSize: "3rem" ,textAlign: "center", display: "block",  marginTop: "10px", fontFamily: "'Inter', sans-serif"  }}>Account Login</p>
          <h5 style={{ textAlign: "center", display: "block",  marginTop: "10px", fontFamily: "'Inter', sans-serif"  }}>ถ้าคุณเป็นสมาชิกอยู่แล้วคุณสามารถเข้าสู่ระบบด้วยบัญชีผู้ใช้และรหัสผ่านของคุณได้</h5>

            <Form
              name="basic"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item >
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  style={{  width: '100%',marginBottom: 20 }}
                >
                  Log in
                </Button>
                <a onClick={() => navigate("/signupselect")}  style={{ textAlign: "center",  textDecoration: "underline", display: "block",  marginTop: "10px", fontFamily: "'Inter', sans-serif"  }}>ยังไม่มีบัญชีใช่ไหม? ลงทะเบียนที่นี่ !</a>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default SignInPages;