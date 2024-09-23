import "../tutor/AppTutor.css";
import React, { useState } from "react";
import { BsBook } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import { Rate } from "antd";
import Header from "../../Pai/ADD/Header";
import HeaderandSidebar from "../../Pai/ADD/Sidebar";
import "../Dashboard/apptest.css"

const Tutor: React.FC = () => {
    const [openSidebarToggle, setOpenSidebarToggle] = useState<boolean>(false);

    const OpenSidebar = (): void => {
      setOpenSidebarToggle(!openSidebarToggle);
    };
  return (
    <div className="grid-container">
    <Header OpenSidebar={OpenSidebar} />
    <HeaderandSidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <div className="combined-container">
        <div className="course-amount-container box">
          <h3>Course Amount</h3>
          <div className="course-amount">
            <BsBook className="course-icon" />
            <span>3</span>
            {/* ตั้งค่า Rate เป็น 4.5 ดาว */}
            <Rate allowHalf defaultValue={4.5} disabled />
            4.5
          </div>
        </div>

        <div className="registered-container box">
          <h2>REGISTERED</h2>
          <div className="registered-stats">
            <div className="stat-item">
              <p>24 hours ago</p>
              <div className="stat-number">
                <span className="stat-arrow">▲</span> 18
              </div>
            </div>
            <div className="stat-item">
              <p>1 weeks ago</p>
              <div className="stat-number">
                <span className="stat-arrow">▲</span> 28
              </div>
            </div>
            <div className="stat-item">
              <p>1 months ago</p>
              <div className="stat-number">
                <span className="stat-arrow">▲</span> 89
              </div>
            </div>
          </div>
        </div>

        <div className="ranking-box box">
          <h2>
            RANKING <span className="rank-number">#1</span>
          </h2>
          <table className="ranking-details">
            <thead>
              <tr>
                <th>Month</th>
                <th>Student</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sep</td>
                <td>98</td>
              </tr>
              <tr>
                <td>Nov</td>
                <td>59</td>
              </tr>
              <tr>
                <td>Oct</td>
                <td>42</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td>199</td>
              </tr>
            </tfoot>
          </table>
          <div className="student-icon">
            <img src="/path/to/icon.png" alt="Student Icon" />
            <p>ตกปลาน้ำลึก</p>
          </div>
        </div>

        <div className="parent-container">
          <div className="dashboard">
            <div className="search-bar">
              <div className="header-right">
                <BsSearch className="icon" />
              </div>
              <input type="text" placeholder="Search ..." />
            </div>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Course</th>
                  <th>Genre</th>
                  <th>Trend</th>
                  <th>Student</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>ตกปลาน้ำลึก</td>
                  <td>Survival</td>
                  <td>
                    <span className="trend-up">▲</span>
                  </td>
                  <td>199</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>เดินแบบ</td>
                  <td>Model</td>
                  <td>
                    <span className="trend-up">▲</span>
                  </td>
                  <td>102</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>การดื่มไวน์</td>
                  <td>Sommelier</td>
                  <td>
                    <span className="trend-down">▼</span>
                  </td>
                  <td>89</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutor;
