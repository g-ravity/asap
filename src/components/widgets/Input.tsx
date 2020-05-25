import React, { Fragment } from "react";
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
    formControlProps.onChange = field?.onChange;
    error = form.touched[field.name] && form.errors && form.errors[field.name];
  }

  return (
    <Fragment>
      <InputComponent {...formControlProps} />
      <Error>{error}</Error>
    </Fragment>
  );
};

Input.whyDidYouRender = true;

/**
 * Styled Components...
 */

const InputComponent = styled(FormControl)`
  margin: 10px;
  :focus {
    outline: none;
  }
`;

const Error = styled.span`
  color: red;
`;
