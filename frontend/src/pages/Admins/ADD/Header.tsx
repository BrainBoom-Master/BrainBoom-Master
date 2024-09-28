import React from 'react';
import {
  BsPersonCircle,
  BsJustify,
} from 'react-icons/bs';


interface HeaderProps {
  OpenSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ OpenSidebar }) => {
  return (
    <header className='header'>
      <div className='menu-icon'>
        <BsJustify className='icon' onClick={OpenSidebar} />
      </div>
    
      <div className='header-right'>
        <BsPersonCircle className='icon' />
      </div>
    </header>
  );
};

export default Header;
