import * as Yup from "yup";

const schema = (validationObj: object): Yup.ObjectSchema<Yup.Shape<object | undefined, typeof validationObj>> =>
  Yup.object().shape(validationObj).strict(true).noUnknown();

export default schema;
