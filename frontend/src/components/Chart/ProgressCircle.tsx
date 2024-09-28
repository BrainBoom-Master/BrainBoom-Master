import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";

// กำหนดชนิดของ props
interface ProgressCircleProps {
  progress?: number | string; // รองรับทั้ง number และ string
  size?: number | string; // รองรับทั้ง number และ string
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ progress = 0.75, size = 40 }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = Number(progress) * 360; // แปลง progress เป็น number เพื่อคำนวณมุม

  return (
    <Box
      sx={{
        background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${colors.blueAccent[500]} ${angle}deg 360deg),
            ${colors.greenAccent[500]}`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default ProgressCircle;
