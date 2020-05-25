import React, { Fragment } from "react";
import FormControl, { FormControlProps } from "react-bootstrap/FormControl";
import { FieldProps } from "formik";
import styled from "@emotion/styled";

export interface InputProps extends FormControlProps, Partial<FieldProps> {}

export function Input(props: InputProps) {
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
      <FormControl {...formControlProps} />
      {error ? <Error>{error}</Error> : null}
    </Fragment>
  );
}

/**
 * Styled Components...
 */

const Error = styled.span`
  color: red;
`;
