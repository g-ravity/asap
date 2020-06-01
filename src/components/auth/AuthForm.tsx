import React from "react";
import styled from "@emotion/styled";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import colors from "../../theme/colors";
import { Button, Input } from "../widgets";

/**
 * Types
 */
interface AuthFormProps {
  isSignUp?: boolean;
  onSubmit: (values: InitialAuthValues) => Promise<void>;
}

export type InitialAuthValues = typeof initialValues;

/**
 * Component
 */
const AuthForm: React.FC<AuthFormProps> = props => {
  const { isSignUp, onSubmit } = props;

  const submitData = async (
    values: InitialAuthValues,
    formikHelpers: FormikHelpers<InitialAuthValues>
  ): Promise<void> => {
    try {
      await onSubmit(values);
    } catch (err) {
      formikHelpers.setErrors(err);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={isSignUp ? SignUpSchema : SignInSchema}
      onSubmit={submitData}
      validateOnChange={false}
    >
      <FormContainer isSignUp={isSignUp} className={isSignUp ? "sign-up-container" : "sign-in-container"}>
        <h1>{isSignUp ? "Create Account" : "Sign In"}</h1>
        <div className="my-2 mx-0">
          <OAuthButton href="/api/auth/google">
            <i className="fab fa-google-plus-g" />
          </OAuthButton>
          <OAuthButton href="/api/auth/facebook">
            <i className="fab fa-facebook-f" />
          </OAuthButton>
        </div>
        <span className="my-2">{isSignUp ? "or use your email for registration" : "or use your account"}</span>
        {isSignUp ? <Field name="name" placeholder="Name" component={Input} /> : null}
        <Field name="email" placeholder="Email" component={Input} />
        <Field name="password" type="password" placeholder="Password" component={Input} />
        <Button className="my-3" title={isSignUp ? "Sign Up" : "Sign In"} type="submit" bgColor={colors.primary} />
      </FormContainer>
    </Formik>
  );
};

/**
 * Helper Variables
 */
const initialValues = {
  name: "",
  email: "",
  password: ""
};

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid Email!").required("Required"),
  password: Yup.string().min(8, "Too Short!").max(255, "Too Long!").required("Required")
});

const SignUpSchema = Yup.object().shape({
  name: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Required"),
  email: Yup.string().email("Invalid Email!").required("Required"),
  password: Yup.string().min(8, "Too Short!").max(255, "Too Long!").required("Required")
});

/**
 * Styled components
 */
const FormContainer = styled(Form)<{ isSignUp?: boolean }>`
  top: 0;
  left: 0;
  opacity: ${(props): number => (props.isSignUp ? 0 : 1)};
  z-index: ${(props): number => (props.isSignUp ? 0 : 2)};
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
