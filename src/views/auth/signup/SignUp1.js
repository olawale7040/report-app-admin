import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { registerUser } from '../../../api';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import { Formik } from 'formik';
import * as yup from 'yup';
import { storeToken } from '../../../utils/safeToken';
import { useDispatch } from '../../../store';

const SignUp1 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const schema = yup.object().shape({
    fullName: yup.string().required('Full name is required'),
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),
    adminRole: yup.string().required('Role is required')
  });

  const handleSubmit = async (values) => {
    try {
      setErrorMessage(null);
      const response = await registerUser({
        full_name: values.fullName,
        email: values.email,
        password: values.password,
        admin_role: values.adminRole
      });
      if (response.data.status === 200) {
        storeToken(JSON.stringify(response.data.data));
        dispatch(updateUser(response.data.data));
        navigate('/app/dashboard/default');
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while registering');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon" />
                  </div>
                  <h3 className="mb-4">Sign up</h3>
                  {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                  <Formik
                    validationSchema={schema}
                    onSubmit={handleSubmit}
                    initialValues={{
                      fullName: '',
                      email: '',
                      password: '',
                      adminRole: ''
                    }}
                  >
                    {({ handleSubmit, handleChange, values, touched, errors }) => (
                      <Form noValidate>
                        <Form.Group className="input-group mb-3">
                          <Form.Control
                            type="text"
                            className="form-control"
                            name="fullName"
                            placeholder="Full Name"
                            value={values.fullName}
                            onChange={handleChange}
                            isInvalid={touched.fullName && !!errors.fullName}
                          />
                          <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="input-group mb-3">
                          <Form.Control
                            type="email"
                            className="form-control"
                            placeholder="Email address"
                            value={values.email}
                            onChange={handleChange}
                            isInvalid={touched.email && !!errors.email}
                            name="email"
                          />
                          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="input-group mb-4">
                          <Form.Control
                            name="password"
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={values.password}
                            onChange={handleChange}
                            isInvalid={touched.password && !!errors.password}
                          />
                          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGridState">
                          <Form.Control
                            name="adminRole"
                            as="select"
                            value={values.adminRole}
                            onChange={handleChange}
                            isInvalid={touched.adminRole && !!errors.adminRole}
                          >
                            <option value="">Select role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">{errors.adminRole}</Form.Control.Feedback>
                        </Form.Group>
                        <div className="form-check  text-start mb-4 mt-2"></div>

                        <Button onClick={handleSubmit} disabled={isLoading}>
                          {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Sign up'}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                  {/*  */}
                  <p className="mb-2">
                    Already have an account?{' '}
                    <NavLink to="/auth/signin-1" className="f-w-400">
                      Login
                    </NavLink>
                  </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignUp1;
