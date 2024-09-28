import React from 'react';
import {
  BsGrid1X2Fill,
  BsCalendarFill,
  BsFillPersonPlusFill,
} from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom'; // นำเข้า useNavigate
import LogoImage from '../../../assets/logo.png';
import { Menu, MenuProps, message } from 'antd'; // นำเข้า message จาก antd
import { LogoutOutlined } from '@ant-design/icons';

interface SidebarProps {
  openSidebarToggle: boolean;
  OpenSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ openSidebarToggle, OpenSidebar }) => {
  const navigate = useNavigate(); // ใช้ useNavigate

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);

    if (e.key === 'logout') {
      // การกระทำการ logout ที่นี่
      localStorage.clear(); // ลบข้อมูลทั้งหมดจาก localStorage

      message.success("Logout successful");

      setTimeout(() => {
        navigate('/login'); // เปลี่ยนเส้นทางไปยังหน้า login
      }, 2000);
    }
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""} 
      style={{
        height:"100%"
      }}  
    >
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <img src={LogoImage} alt="Brand Logo" className='brand-logo' />
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>
      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <Link to="/dashboard">
            <BsGrid1X2Fill className='icon' /> Dashboard
          </Link>
        </li>
       
        <li className='sidebar-list-item'>
          <Link to="/calendarAdmin">
            <BsCalendarFill className='icon' /> Calendar
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/createuserbyAdmin">
            <BsFillPersonPlusFill className='icon' /> Create User
          </Link>
        </li>
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
            color: '#f0f0f0',
            display: 'inline-block',
          }}
        />
      </ul>
    </aside>
  );
};

export default Sidebar;
