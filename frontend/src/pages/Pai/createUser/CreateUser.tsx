import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import Header from "../../../components/Pai/Header";
import { useState } from "react";
import HeaderandSidebar from "../../Pai/ADD/Header";
import Sidebar from "../../Pai/ADD/Sidebar";
import "../Dashboard/apptest.css"
// กำหนดประเภทสำหรับค่าฟอร์ม
interface FormValues {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  userRole: string; // เปลี่ยนเป็น string
}

const Form = () => {
  const handleFormSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    console.log(values);
    actions.setSubmitting(false);
  };

  const [openSidebarToggle, setOpenSidebarToggle] = useState<boolean>(false);

  const OpenSidebar = (): void => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
    <HeaderandSidebar OpenSidebar={OpenSidebar} />
    <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <Box
        display="flex"
        justifyContent="center"
        minHeight="80vh"
        sx={{ backgroundColor: "#f0f0f0", width: "80vw", mt: "5%" }}
      >
        <Box width="70%" m="20px">
          <Header title="CREATE USER" subtitle="Create a New User Profile" />
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{ "& > div": { gridColumn: "span 2" } }}
                >
                  {/* Other form fields */}
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.username}
                    name="username"
                    error={!!touched.username && !!errors.username}
                    helperText={
                      touched.username && errors.username
                        ? String(errors.username)
                        : ""
                    }
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="password"
                    label="Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={!!touched.password && !!errors.password}
                    helperText={
                      touched.password && errors.password
                        ? String(errors.password)
                        : ""
                    }
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={!!touched.firstName && !!errors.firstName}
                    helperText={
                      touched.firstName && errors.firstName
                        ? String(errors.firstName)
                        : ""
                    }
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={!!touched.lastName && !!errors.lastName}
                    helperText={
                      touched.lastName && errors.lastName
                        ? String(errors.lastName)
                        : ""
                    }
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="email"
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={
                      touched.email && errors.email ? String(errors.email) : ""
                    }
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="date"
                    label="Birthday"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.birthday.toISOString().split("T")[0]}
                    name="birthday"
                    error={!!touched.birthday && !!errors.birthday}
                    helperText={
                      touched.birthday && errors.birthday
                        ? String(errors.birthday)
                        : ""
                    }
                    InputLabelProps={{ shrink: true }}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    select
                    label="User Role"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.userRole}
                    name="userRole"
                    error={!!touched.userRole && !!errors.userRole}
                    helperText={
                      touched.userRole && errors.userRole
                        ? String(errors.userRole)
                        : ""
                    }
                    sx={{ gridColumn: "span 4" }}
                  >
                    <MenuItem value="Student">Student</MenuItem>
                    <MenuItem value="Tutor">Tutor</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                  </TextField>
                </Box>
                <Box display="flex" justifyContent="end" mt="20px">
                  <Button type="submit" color="secondary" variant="contained">
                    Create New User
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </div>
  );
};

// Regular expression สำหรับเบอร์โทรศัพท์
const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  birthday: yup.date().required("Birthday is required"),
  userRole: yup.string().required("User Role is required"), // เปลี่ยนเป็น string
});

const initialValues: FormValues = {
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  email: "",
  birthday: new Date(),
  userRole: "Student", // ใช้ค่าพื้นฐานที่เลือกได้
};

export default Form;
