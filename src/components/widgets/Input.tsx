import styled from "@emotion/styled";
import { FieldProps, FormikErrors } from "formik";
import React from "react";
import FormControl, { FormControlProps } from "react-bootstrap/FormControl";

/**
 * Types
 */
export interface InputProps extends FormControlProps, Partial<FieldProps> {}
type Error = string | false | string[] | FormikErrors<any> | FormikErrors<any>[] | undefined;

/**
 * Component
 */
export const Input: React.FC<InputProps> = props => {
  const { field, form, ...restProps } = props;
  let error: Error;

  const formControlProps: FormControlProps = {
    type: "text",
    ...restProps
  };

  if (form && field) {
    formControlProps.value = field?.value;
    formControlProps.onChange = (e): void => form.handleChange(field.name)(e.target.value);
    error = form.errors[field.name];
  }

  return (
    <Container error={error}>
      <FormControl
        autoComplete="off"
        className={error ? "border-danger" : ""}
        {...formControlProps}
        onBlur={(): void => form?.validateField(field?.name!)}
        onFocus={(): void => form?.setFieldError(field?.name!, "")}
      />
      <Error className="text-danger">{error}</Error>
    </Container>
  );
};

/**
 * Styled Components
 */
const Container = styled.div<{ error: Error }>`
  margin-top: 10px;
  width: 100%;
  input {
    :focus {
      box-shadow: none;
    }
  }
`;

const Error = styled.div`
  width: 100%;
  height: 19px;
  text-align: left;
  margin: 5px 0 0 10px;
  font-size: 0.8rem;
`;

Input.whyDidYouRender = true;
