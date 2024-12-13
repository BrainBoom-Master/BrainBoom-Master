import { useState } from "react";
import { Layout, Avatar, ConfigProvider, MenuProps, Menu, message } from "antd";
import {
  BookOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Logo from "../../assets/logo1.png";
import { Link, useNavigate } from "react-router-dom";
import "antd/dist/reset.css";

type MenuItem = Required<MenuProps>["items"][number];

const { Header } = Layout;

function HeaderTutor() {
  const username = localStorage.getItem("username") || "Unknown User";
  const userID = localStorage.getItem("id"); // ดึง userID จาก localStorage

  const [current, setCurrent] = useState("course");
  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);

    if (e.key === "logout") {
      // การกระทำการ logout ที่นี่
      localStorage.clear(); // ลบข้อมูลทั้งหมดจาก localStorage

      message.success("Logout successful");

      setTimeout(() => {
        navigate("/login"); // เปลี่ยนเส้นทางไปยังหน้า login
      }, 2000);
    }
  };

  // ตรวจสอบว่า userID มีค่าอยู่และสร้าง items สำหรับ Menu
  const items: MenuItem[] = [
    {
      label: <Link to="/">ซื้อคอร์ส</Link>,
      key: "course",
      icon: <ShoppingCartOutlined />,
    },
    {
      label: <Link to="/myCourses">คอร์สของฉัน</Link>,
      key: "myCourse",
      icon: <BookOutlined />,
    },
    {
      label: userID ? (
        <Link to={`/tutor_profiles`}>My Tutor Profile</Link>
      ) : (
        "My Tutor Profile"
      ),
      key: "tutorProfile",
      icon: <BookOutlined />,
    },
  ];

  return (
    <Header
      style={{
        background: "#333D51",
        padding: "0 20px",
        height: "65px",
        display: "flex",
        width: "100%",
        position: "fixed",
        zIndex: 1000,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100px",
          height: "100%",
        }}
      >
        <img src={Logo} alt="Logo" style={{ width: "65px", height: "65%" }} />
      </div>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              iconSize: 18,
              itemColor: "#f0f0f0",
              itemHoverColor: "#D3AC2B",
              colorPrimary: "#D3AC2B",
            },
          },
        }}
      >
        <div
          style={{
            justifyContent: "center",
            width: "100%",
            alignItems: "center",
            gap: "15px",
            padding: 0,
            margin: 0,
          }}
        >
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
            style={{
              backgroundColor: "#333D51",
            }}
          />
        </div>
      </ConfigProvider>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          height: "100%",
          width: "auto",
          maxWidth: "200px",
          gap: "10px",
        }}
      >
        <Link to={`/users`}>
          <div
            style={{
              color: "#f0f0f0",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {username}
          </div>
        </Link>

        <Avatar size={45} icon={<UserOutlined />} />

        <Menu
          onClick={onClick}
          mode="horizontal"
          items={[
            {
              label: "ออกจากระบบ",
              key: "logout",
              icon: <LogoutOutlined />,
            },
          ]}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#f0f0f0",
            display: "inline-block",
            marginLeft: "10px",
          }}
        />
      </div>
    </Header>
  );
}

export default HeaderTutor;
