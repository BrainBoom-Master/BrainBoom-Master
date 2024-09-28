import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../ADD/Header";
import HeaderandSidebar from "../ADD/Sidebar";
import LineChart from "../../../components/Chart/LineChart";
import StatBox from "../../../components/Chart/StatBox";
import { GetTotalCourse, GetTotalStudent, GetTotalTutor, GetTotalPaid, GetRecentTransactions } from "../../../services/https";
import React, { useEffect, useState } from "react";
import "./apptest.css";

interface Transaction {
  username: string;
  date: string;
  amount: number;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openSidebarToggle, setOpenSidebarToggle] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [totalTutors, setTotalTutors] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  const OpenSidebar = (): void => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const fetchData = async (
    apiFunc: Function,
    setState: Function,
    stateName: string
  ) => {
    try {
      const result = await apiFunc();
      if (result) {
        setState(result[stateName]);
      }
    } catch (error) {
      console.error(`Error fetching ${stateName}:`, error);
      alert(`Failed to fetch ${stateName} data.`);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await fetchData(GetTotalCourse, setTotalCourses, "total_courses");
      await fetchData(GetTotalTutor, setTotalTutors, "count");
      await fetchData(GetTotalStudent, setTotalStudents, "count");
      await fetchData(GetTotalPaid, setTotalPaid, "total_paid");

      // Fetch recent transactions
      try {
        const recentTransactionsData = await GetRecentTransactions();
        setRecentTransactions(recentTransactionsData.recent_transactions);
      } catch (error) {
        console.error("Error fetching recent transactions:", error);
      }

      setLoading(false);
    };
    fetchAllData();
  }, []);

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <HeaderandSidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <Box
        sx={{
          width: "83vw",
          height: "100vh",
          padding: "10px",
          backgroundColor: colors.primary[600],
          overflow: "auto",
        }}
      >
        {/* GRID & CHARTS */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="minmax(130px, auto)"
          gap="20px"
          sx={{ marginTop: "20px" }}
        >
          {/* ROW 1 */}
          <Box
            gridColumn="span 3"
            sx={{
              backgroundColor: colors.primary[400],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <StatBox
                title={totalTutors ? totalTutors.toString() : "N/A"}
                subtitle="Tutor"
                progress={0.0}
                increase=""
                icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            )}
          </Box>
          <Box
            gridColumn="span 3"
            sx={{
              backgroundColor: colors.primary[400],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <StatBox
                title={totalCourses ? totalCourses.toString() : "N/A"}
                subtitle="Courses"
                progress={0.0}
                increase=""
                icon={<PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            )}
          </Box>
          <Box
            gridColumn="span 3"
            sx={{
              backgroundColor: colors.primary[400],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <StatBox
                title={totalStudents ? totalStudents.toString() : "N/A"}
                subtitle="Student"
                progress={0.0}
                increase=""
                icon={<PersonAddIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            )}
          </Box>
          <Box
            gridColumn="span 3"
            sx={{
              backgroundColor: colors.primary[400],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <StatBox
                title={totalPaid ? `฿ ${totalPaid.toFixed(2)}` : "N/A"}
                subtitle="Profit"
                progress={0}
                increase=""
                icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            )}
          </Box>

          {/* ROW 2 */}
          <Box
            gridColumn="span 8"
            gridRow="span 0"
            sx={{
              backgroundColor: colors.primary[400],
            }}
          >
            <Box
              mt="25px"
              p="0 30px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                  Revenue Generated
                </Typography>
                <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                  ฿{totalPaid ? totalPaid.toFixed(2) : "N/A"}
                </Typography>
              </Box>
              <Box>
                <IconButton>
                  <DownloadOutlinedIcon sx={{ fontSize: "26px", color: colors.greenAccent[500] }} />
                </IconButton>
              </Box>
            </Box>
            <Box height="500px" m="-20px 0 0 0"> {/* เปลี่ยนความสูงที่นี่ */}
              <LineChart isDashboard={true} />
            </Box>
          </Box>
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            sx={{
              backgroundColor: colors.primary[400],
              overflow: "auto",
              height: "594px", // กำหนดความสูงที่ชัดเจน
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                Recent Transactions
              </Typography>
            </Box>
            {recentTransactions.length === 0 ? (
              <Typography color={colors.grey[100]} p="15px">
                No transactions found.
              </Typography>
            ) : (
              recentTransactions.slice(0, 8).map((transaction: Transaction, i: number) => (
                <Box
                  key={`${transaction.username}-${i}`}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.primary[500]}`}
                  p="15px"
                >
                  <Box>
                    <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                      {transaction.username}
                    </Typography>
                  </Box>
                  <Box color={colors.grey[100]}>{transaction.date}</Box>
                  <Box
                    sx={{
                      backgroundColor: colors.greenAccent[500],
                      p: "5px 10px",
                      borderRadius: "4px",
                    }}
                  >
                    ฿{transaction.amount.toFixed(2)}
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {/* ROW 3 */}
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
