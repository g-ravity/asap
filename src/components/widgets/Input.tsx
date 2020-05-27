import React from "react";
import FormControl, { FormControlProps } from "react-bootstrap/FormControl";
import { FieldProps } from "formik";
import styled from "@emotion/styled";

export interface InputProps extends FormControlProps, Partial<FieldProps> {}

export const Input: React.FC<InputProps> = props => {
  const { field, form, meta, ...restProps } = props;
  let error: any;

  const formControlProps: FormControlProps = {
    type: "text",
    ...restProps
  };

  if (form && field) {
    formControlProps.value = field?.value;
    formControlProps.onChange = e => form.handleChange(field.name)(e.target.value);
    // formControlProps.onChange = e => field.onChange(e.target.value);
    error = form.touched[field.name] && form.errors && form.errors[field.name];
  }

  return (
    <Container error={error}>
      <FormControl autoComplete="off" {...formControlProps} />
      <Error>{error}</Error>
    </Container>
  );
};

/**
 * Styled Components...
 */

const Container = styled.div<{ error: string }>`
  margin-top: 10px;
  width: 100%;
  input {
    border: ${props => props.error && "1px solid red"};
    :focus {
      box-shadow: none;
      border: ${props => (props.error ? "1px solid red" : "1px solid #ced4da")};
    }
  }
`;

const Error = styled.div`
  color: red;
  width: 100%;
  height: 19px;
  text-align: left;
  margin: 5px 0 0 10px;
  font-size: 0.8rem;
`;
