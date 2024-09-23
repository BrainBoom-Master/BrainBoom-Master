import { useState, useEffect } from 'react';
import { Layout, Avatar, ConfigProvider, MenuProps, Menu, message } from 'antd';
import { BookOutlined, UserOutlined, ShoppingCartOutlined, ShopOutlined, LogoutOutlined, SearchOutlined } from '@ant-design/icons';
import Logo from '../../assets/Logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: <Link to="/">ซื้อคอร์ส</Link>, 
    key: 'course',
    icon: <ShoppingCartOutlined />,
  },
  {
    label: <Link to="/tutor">ขายคอร์ส</Link>, 
    key: 'tuterCourse',
    icon: <ShopOutlined />,
  },
  {
    label: <Link to="/myCourses">คอร์สของฉัน</Link>, 
    key: 'myCourse',
    icon: <BookOutlined />,
  },
  {
    label: <Link to="/search">ค้นหา</Link>, 
    key: 'search',
    icon: <SearchOutlined />,
  },
];

const { Header } = Layout;

function HeaderComponent() {
  const username = localStorage.getItem('username') || 'Unknown User';
  const [current, setCurrent] = useState("course");
  const navigate = useNavigate();
  const location = useLocation();

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);

    if (e.key === 'logout') {
      localStorage.clear(); 

      message.success("Logout successful");

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };
  
  useEffect(() => {
    setCurrent(location.pathname.substring(1) || '');
  }, [location]);

  return (
    <Header
      style={{
        background: '#333D51',
        padding: '0 20px',
        height: '65px',
        display: 'flex',
        width: '100%',
        position: 'fixed',
        zIndex: 1000,
        alignItems: 'center',
        justifyContent: 'space-between',  
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100px',
          height: '100%',
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{ width: '65px', height: '100%' }}
        />
      </div>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              iconSize: 18,
              itemColor: '#f0f0f0',
              itemHoverColor: '#D3AC2B',
              colorPrimary: 'none',
            },
          },
        }}
      >
        <div
          style={{
            justifyContent: 'center',
            width:'100%',
            alignItems: 'center',
            gap: '15px',
            padding: 0,
            margin: 0,
          }}
        >

          <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} 
            style={{
              backgroundColor: '#333D51',
            }}
          />

        </div>
      </ConfigProvider>
      
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          height: '100%',
          width:'200px',
          maxWidth:'200px',
          gap: '10px',
        }}
      >
        <div
          style={{
            color: '#f0f0f0',
            fontSize: '12px',
          }}
        >
          {username}
        </div>
        <Avatar size={45} icon={<UserOutlined />} />
      </div>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              iconSize: 20,
              itemColor: '#555555',
              itemHoverColor: '#D3AC2B',
              colorPrimary: 'none',
            },
          },
        }}
      >
        <Menu
          onClick={onClick}
          mode="horizontal"
          items={[
            {
              label: 'ออกจากระบบ',
              key: 'logout',
              icon: <LogoutOutlined />,
            }
          ]}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#333D51',
            display: 'inline-block',
            width: '30px',
          }}
        />
      </ConfigProvider>
    </Header>
  );
}

export default HeaderComponent;
