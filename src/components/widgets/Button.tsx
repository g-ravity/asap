import CSS from "csstype";
import React from "react";
import Spinner from "react-bootstrap/Spinner";
import AppButton, { ButtonProps as AppButtonProps } from "react-bootstrap/Button";

/**
 * Types
 */
export interface ButtonProps extends AppButtonProps {
  bgColor?: string;
  className?: string;
  color?: string;
  height?: number | string;
  onClick?: () => void;
  title: string;
  width?: number | string;
  style?: CSS.Properties;
  isLoading?: boolean;
}

/**
 * Component
 */
export const Button: React.FC<ButtonProps> = props => {
  const { title, onClick, className, bgColor, color, width, height, style, isLoading, ...restProps } = props;

  return (
    <AppButton
      type="button"
      onClick={onClick}
      className={`${className} p-md-2`}
      style={{
        backgroundColor: bgColor,
        border: bgColor,
        color,
        width,
        height,
        boxShadow: bgColor && "0px 0px 10px rgba(0,0,0,0.2)",
        ...style
      }}
      {...restProps}
    >
      {title}
      {isLoading ? <Spinner className="ml-1" animation="border" size="sm" /> : null}
    </AppButton>
  );
};

Button.whyDidYouRender = true;
