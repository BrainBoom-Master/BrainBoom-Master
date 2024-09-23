import "./AppTutor.css";
import "../Dashboard/apptest.css"
import React, { useState } from "react";
import { BsBook } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import Header from "../../Pai/ADD/Header";
import HeaderandSidebar from "../../Pai/ADD/Sidebar";

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
          <h3>Student</h3>
          <div className="course-amount">
            <BsBook className="course-icon" />
            <span>259</span>
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
                <th>earn(฿)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sep</td>
                <td>52,500</td>
              </tr>
              <tr>
                <td>Nov</td>
                <td>48,200</td>
              </tr>
              <tr>
                <td>Oct</td>
                <td>39,500</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td>140,200</td>
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
                  <th>Username</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Genre</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>eyeeye</td>
                  <td>eeeye@gmail.com</td>
                  <td>ตกปลาน้ำลึก</td>
                  <td>Survival</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>pondpond</td>
                  <td>pondpung@gmail.com</td>
                  <td>เดินแบบ</td>
                  <td>Model</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>macdonald</td>
                  <td>macdonald@gmail.com</td>
                  <td>การดื่มไวน์</td>
                  <td>Sommelier</td>
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
