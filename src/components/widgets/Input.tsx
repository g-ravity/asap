import React, { Fragment, FunctionComponent } from "react";
import FormControl, { FormControlProps } from "react-bootstrap/FormControl";
import { FieldProps } from "formik";
import styled from "@emotion/styled";

export interface InputProps extends FormControlProps, Partial<FieldProps> {}

export const Input: FunctionComponent<InputProps> = props => {
  const { field, form, meta, ...restProps } = props;
  let error: any;

  const formControlProps: FormControlProps = {
    type: "text",
    ...restProps
  };
  console.log(field);
  if (form && field) {
    formControlProps.value = field?.value;
    formControlProps.onChange = field?.onChange;
    error = form.touched[field.name] && form.errors && form.errors[field.name];
  }

  return (
    <Fragment>
      <InputComponent {...formControlProps} />
      {error ? <Error>{error}</Error> : null}
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
