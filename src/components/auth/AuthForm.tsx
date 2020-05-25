import React from "react";
import { Formik, Form, FormikHelpers, Field } from "formik";
import { Input, Button } from "../widgets";
import styled from "@emotion/styled";

interface AuthFormProps {
  isSignUp?: boolean;
  onSubmit: (values: InitialAuthValues, formikHelpers: FormikHelpers<InitialAuthValues>) => void;
}

const AuthForm: React.FC<AuthFormProps> = props => {
  const { isSignUp, onSubmit } = props;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      render={formikprops => {
        return (
          <FormContainer isSignUp={isSignUp} className={isSignUp ? "sign-up-container" : "sign-in-container"}>
            <h1>{isSignUp ? "Create Account" : "Sign In"}</h1>
            <div className="my-2 mx-0">
              <OAuthButton href="/api/auth/google">
                <i className="fab fa-google-plus-g"></i>
              </OAuthButton>
              <OAuthButton href="/api/auth/facebook">
                <i className="fab fa-facebook-f"></i>
              </OAuthButton>
            </div>
            <span className="my-2">{isSignUp ? "or use your email for registration" : "or use your account"}</span>
            <Field name="name" placeholder="Name" component={Input} />
            <Field name="email" placeholder="Email" component={Input} />
            <Field name="password" type="password" placeholder="Password" component={Input} />
            <Button className="my-3" title={isSignUp ? "Sign Up" : "Sign In"} />
          </FormContainer>
        );
      }}
    />
  );
};

const initialValues = {
  name: "",
  email: "",
  password: "",
  cPassword: ""
};

export type InitialAuthValues = typeof initialValues;

/**
 * Styled components...
 */

const FormContainer = styled(Form)<{ isSignUp?: boolean }>`
  top: 0;
  left: 0;
  opacity: ${props => (props.isSignUp ? 0 : 1)};
  z-index: ${props => (props.isSignUp ? 0 : 2)};
  transition: all 0.6s ease-in-out;
  width: 50%;
  height: 100%;
  position: absolute;
  background-color: #f6f7fc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 50px;
`;

const OAuthButton = styled.a`
  border: 1px solid #dddddd;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
`;

AuthForm.whyDidYouRender = true;

export default AuthForm;
