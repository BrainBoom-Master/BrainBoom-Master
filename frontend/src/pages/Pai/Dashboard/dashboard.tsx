import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { mockTransactions } from "../../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../Pai/ADD/Header";
import HeaderandSidebar from "../../Pai/ADD/Sidebar";
import LineChart from "../../../components/Pai/LineChart";
import BarChart from "../../../components/Pai/BarChart";
import StatBox from "../../../components/Pai/StatBox";
import ProgressCircle from "../../../components/Pai/ProgressCircle";
import { GetTotalCourse } from "../../../services/https";
import React, { useEffect, useState } from "react";
import "./apptest.css"

// Define types for mock data
interface Transaction {
  txId: string;
  user: string;
  date: string;
  cost: string;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openSidebarToggle, setOpenSidebarToggle] = useState<boolean>(false);

  const OpenSidebar = (): void => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const [totalCourses, setTotalCourses] = useState<number>(0);

  // Fetch total courses from the backend
  useEffect(() => {
    const fetchTotalCourses = async () => {
      const result = await GetTotalCourse();
      if (result) {
        setTotalCourses(result.total_courses); // Store total courses in state
      }
    };

    fetchTotalCourses();
  }, []);

  return (
    <div className="grid-container">
            <Header OpenSidebar={OpenSidebar} />
            <HeaderandSidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <Box
        sx={{
          width: "85vw", // Full screen width
          height: "100vh", // Full screen height
          padding: "10px",
          backgroundColor: colors.primary[600],
          overflow: "auto", // Allow scroll if needed
        }}
      >
        {/* HEADER */}

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
            <StatBox
              title="12,361"
              subtitle="Tutor"
              progress={0.75}
              increase="+14%"
              icon={
                <EmailIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
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
            <StatBox
              title={totalCourses.toString()} // Display total courses
              subtitle="Courses Obtained"
              progress={0.0}
              increase="+0%"
              icon={
                <PointOfSaleIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
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
            <StatBox
              title="32,441"
              subtitle="Student"
              progress={0.3}
              increase="+5%"
              icon={
                <PersonAddIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
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
            <StatBox
              title="1,325,134"
              subtitle="Profit"
              progress={0.8}
              increase="+43%"
              icon={
                <TrafficIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
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
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color={colors.grey[100]}
                >
                  Revenue Generated
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color={colors.greenAccent[500]}
                >
                  $59,342.32
                </Typography>
              </Box>
              <Box>
                <IconButton>
                  <DownloadOutlinedIcon
                    sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                  />
                </IconButton>
              </Box>
            </Box>
            <Box height="250px" m="-20px 0 0 0">
              <LineChart isDashboard={true} />
            </Box>
          </Box>
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            sx={{
              backgroundColor: colors.primary[400],
              overflow: "auto",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Typography
                color={colors.grey[100]}
                variant="h5"
                fontWeight="600"
              >
                Recent Transactions
              </Typography>
            </Box>
            {mockTransactions.map((transaction: Transaction, i: number) => (
              <Box
                key={`${transaction.txId}-${i}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
              >
                <Box>
                  <Typography
                    color={colors.greenAccent[500]}
                    variant="h5"
                    fontWeight="600"
                  >
                    {transaction.txId}
                  </Typography>
                  <Typography color={colors.grey[100]}>
                    {transaction.user}
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
                  ${transaction.cost}
                </Box>
              </Box>
            ))}
          </Box>

          {/* ROW 3 */}
          <Box
            gridColumn="span 4"
            gridRow="span 0"
            sx={{
              backgroundColor: colors.primary[400],
              p: "30px",
            }}
          >
            <Typography variant="h5" fontWeight="600">
              Campaign
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt="25px"
            >
              <ProgressCircle size={125} />
              <Typography
                variant="h5"
                color={colors.greenAccent[500]}
                sx={{ mt: "15px" }}
              >
                $48,352 revenue generated
              </Typography>
              <Typography>
                Includes extra misc expenditures and costs
              </Typography>
            </Box>
          </Box>
          <Box
            gridColumn="span 4"
            gridRow="span 0"
            sx={{
              backgroundColor: colors.primary[400],
            }}
          >
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{ padding: "30px 30px 0 30px" }}
            >
              Sales Quantity
            </Typography>
            <Box height="250px" mt="-20px">
              <BarChart isDashboard={true} />
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
