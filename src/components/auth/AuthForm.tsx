import React from "react";
import { Formik, Form, FormikHelpers, Field } from "formik";
import { Input } from "../widgets";
import styled from "@emotion/styled";

interface AuthFormProps {
  isSignUp?: boolean;
  onSignIn: (values: typeof initialValues, formikHelpers: FormikHelpers<typeof initialValues>) => void;
  onSignUp: (values: typeof initialValues, formikHelpers: FormikHelpers<typeof initialValues>) => void;
}

export default function AuthForm(props: AuthFormProps) {
  const { isSignUp, onSignIn, onSignUp } = props;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={isSignUp ? onSignUp : onSignIn}
      render={formikprops => {
        return (
          <FormContainer isSignUp={isSignUp}>
            <StyledForm>
              <h1>Create Account</h1>
              <div className="social-container">
                <a href="/api/auth/google" className="social">
                  <i className="fab fa-google-plus-g"></i>
                </a>
                <a href="/api/auth/facebook" className="social">
                  <i className="fab fa-facebook-f"></i>
                </a>
              </div>
              <span>or use your email for registration</span>
              <Field name="name" placeholder="Name" render={Input} />
              <Field name="email" placeholder="Email" render={Input} />
              <Field name="password" type="password" placeholder="Password" render={Input} />
              <button className="signUp">Sign Up</button>
            </StyledForm>
          </FormContainer>
        );
      }}
    />
  );
}

const initialValues = {
  name: "",
  email: "",
  password: "",
  cPassword: ""
};

/**
 * Styled components...
 */

const FormContainer = styled(Form)<{ isSignUp?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 50%;
  opacity: ${props => (props.isSignUp ? 0 : 1)};
  z-index: 1;
  transition: all 0.6s ease-in-out;
`;

const StyledForm = styled.form`
  background-color: #f6f7fc;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;
