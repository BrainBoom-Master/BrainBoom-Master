import { Row, Col, Button, Input, Select, DatePicker } from 'antd';
import { Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import Header from "../../../components/Pai/Header";
import { useState } from "react";
import HeaderandSidebar from "../../Pai/ADD/Header";
import Sidebar from "../../Pai/ADD/Sidebar";
import "../Dashboard/apptest.css";
import { CreateUser } from "../../../services/https";
import moment from 'moment';

// Define the FormValues interface
interface FormValues {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  birthday: moment.Moment | null;
  userRole: string;
  gender: string;
}

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
        BirthDay: values.birthday ? values.birthday.format("YYYY-MM-DD") : "",
        UserRoleID: roleMapping[values.userRole],
        GenderID: genderMapping[values.gender],
        Profile: "",  // Set Profile as null
      });

      if (response?.data?.success) {
        setResponseMessage("User created successfully!");
        actions.resetForm();
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
    <div className="grid-container-pai">
      <HeaderandSidebar OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />

      <Row justify="end" style={{ minHeight: "80vh", backgroundColor: "#f0f0f0", marginTop: "10%" }}>
        <Col span={16}>
          <Header title="CREATE USER" subtitle="Create a New User Profile" />
          
          {responseMessage && (
            <Row>
              <Col span={24} style={{ marginBottom: "20px" }}>
                {responseMessage}
              </Col>
            </Row>
          )}

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
              <form onSubmit={handleSubmit} style={{ transform: 'scale(1.2)', maxWidth: '100%' }}>
                
                <Row gutter={[16, 24]} justify="end">
                  
                  <Col span={12}>
                    <Input
                      placeholder="Username"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.username}
                      name="username"
                      status={touched.username && errors.username ? "error" : ""} />
                    {touched.username && errors.username && (
                      <div style={{ color: 'red' }}>{errors.username}</div>
                    )}
                  </Col>

                  <Col span={12}>
                    <Input.Password
                      placeholder="Password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      name="password"
                      status={touched.password && errors.password ? "error" : ""} />
                    {touched.password && errors.password && (
                      <div style={{ color: 'red' }}>{errors.password}</div>
                    )}
                  </Col>
                  
                  <Col span={12}>
                    <Input
                      placeholder="First Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      name="firstName"
                      status={touched.firstName && errors.firstName ? "error" : ""} />
                    {touched.firstName && errors.firstName && (
                      <div style={{ color: 'red' }}>{errors.firstName}</div>
                    )}
                  </Col>

                  <Col span={12}>
                    <Input
                      placeholder="Last Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lastName}
                      name="lastName"
                      status={touched.lastName && errors.lastName ? "error" : ""} />
                    {touched.lastName && errors.lastName && (
                      <div style={{ color: 'red' }}>{errors.lastName}</div>
                    )}
                  </Col>
                  
                  <Col span={24}>
                    <Input
                      placeholder="Email"
                      type="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      name="email"
                      status={touched.email && errors.email ? "error" : ""} />
                    {touched.email && errors.email && (
                      <div style={{ color: 'red' }}>{errors.email}</div>
                    )}
                  </Col>
                  
                  <Col span={24}>
                    <DatePicker
                      placeholder="Birthday"
                      style={{ width: '100%' }}
                      value={values.birthday}
                      onChange={(date) => handleChange({ target: { name: "birthday", value: date } })} />
                    {touched.birthday && errors.birthday && (
                      <div style={{ color: 'red' }}>{errors.birthday}</div>
                    )}
                  </Col>
                  
                  <Col span={12}>
                    <Select
                      placeholder="User Role"
                      onBlur={handleBlur}
                      onChange={(value) => {
                        handleChange({ target: { name: "userRole", value } });
                        handleBlur({ target: { name: "userRole" } });
                      }}
                      value={values.userRole}
                      style={{ width: '100%' }}
                      status={touched.userRole && errors.userRole ? "error" : ""} >
                      <Select.Option value="Student">Student</Select.Option>
                      <Select.Option value="Tutor">Tutor</Select.Option>
                      <Select.Option value="Admin">Admin</Select.Option>
                    </Select>
                    {touched.userRole && errors.userRole && (
                      <div style={{ color: 'red' }}>{errors.userRole}</div>
                    )}
                  </Col>

                  <Col span={12}>
                    <Select
                      placeholder="Gender"
                      onBlur={handleBlur}
                      onChange={(value) => {
                        handleChange({ target: { name: "gender", value } });
                        handleBlur({ target: { name: "gender" } });
                      }}
                      value={values.gender}
                      style={{ width: '100%' }}
                      status={touched.gender && errors.gender ? "error" : ""} >
                      <Select.Option value="Male">Male</Select.Option>
                      <Select.Option value="Female">Female</Select.Option>
                    </Select>
                    {touched.gender && errors.gender && (
                      <div style={{ color: 'red' }}>{errors.gender}</div>
                    )}
                  </Col>

                  <Col span={24} style={{ textAlign: 'center', marginTop: '30px' }}>
                    <Button type="primary" htmlType="submit" style={{ padding: '10px 20px' }}>
                      Create New User
                    </Button>
                  </Col>
                </Row>
              </form>
            )}
          </Formik>
        </Col>
      </Row>
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
  birthday: null,
  userRole: "",
  gender: "",
};

export default Form;
