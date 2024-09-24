import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import Header from "../../../components/Pai/Header";
import { useState } from "react";
import HeaderandSidebar from "../../Pai/ADD/Header";
import Sidebar from "../../Pai/ADD/Sidebar";
import "../Dashboard/apptest.css";
import { CreateUser } from "../../../services/https";
import { UsersInterface } from "../../../interfaces/IUser";
import { DatePicker } from 'antd'; // Import DatePicker from antd
import moment from 'moment'; // Import moment for date formatting

// Define the FormValues interface
interface FormValues {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  birthday: moment.Moment | null; // Use moment for date handling
  userRole: string;
  gender: string;
}

// Define role and gender mappings
const roleMapping: { [key: string]: number } = {
  Student: 3,
  Tutor: 2,
  Admin: 1,
};

const genderMapping: { [key: string]: number } = {
  Male: 1,
  Female: 2,
};

const Form = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");

  const OpenSidebar = (): void => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleFormSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    // Save birthday to localStorage
    if (values.birthday) {
      localStorage.setItem("birthday", values.birthday.toISOString());
    }

    try {
      const response = await CreateUser({
        Username: values.username,
        Password: values.password,
        Email: values.email,
        FirstName: values.firstName,
        LastName: values.lastName,
        BirthDay: values.birthday ? values.birthday.format("YYYY-MM-DD") : "", // Convert birthday to required format
        UserRoleID: roleMapping[values.userRole], // Convert to number
        GenderID: genderMapping[values.gender], // Convert to number
      });

      if (response?.data?.success) {
        setResponseMessage("User created successfully!");
        actions.resetForm(); // Reset form after successful submission
      } else {
        setResponseMessage(response?.data?.message || "Failed to create user.");
      }
    } catch (error) {
      setResponseMessage("An error occurred while creating the user.");
    } finally {
      actions.setSubmitting(false);
    }
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
          {responseMessage && <Box mb="20px">{responseMessage}</Box>}
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
                    helperText={touched.username && errors.username}
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
                    helperText={touched.password && errors.password}
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
                    helperText={touched.firstName && errors.firstName}
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
                    helperText={touched.lastName && errors.lastName}
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
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <Box sx={{ gridColumn: "span 4" }}>
                    <DatePicker
                      placeholder="Birthday"
                      style={{ width: '100%' }}
                      value={values.birthday} // Set the value from Formik
                      onChange={(date) => handleChange({ target: { name: "birthday", value: date } })} // Update Formik value on date change
                    />
                    {touched.birthday && errors.birthday && (
                      <div style={{ color: 'red' }}>{errors.birthday}</div>
                    )}
                  </Box>
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
                    helperText={touched.userRole && errors.userRole}
                    sx={{ gridColumn: "span 4" }}
                  >
                    <MenuItem value="Student">Student</MenuItem>
                    <MenuItem value="Tutor">Tutor</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    variant="filled"
                    select
                    label="Gender"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.gender}
                    name="gender"
                    error={!!touched.gender && !!errors.gender}
                    helperText={touched.gender && errors.gender}
                    sx={{ gridColumn: "span 4" }}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
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

// Validation schema
const checkoutSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  birthday: yup.date().nullable().required("Birthday is required"),
  userRole: yup.string().required("User Role is required"),
  gender: yup.string().required("Gender is required"),
});

// Initial values
const initialValues: FormValues = {
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  email: "",
  birthday: null, // Start with null for moment
  userRole: "Student",
  gender: "",
};

export default Form;
