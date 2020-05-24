import CSS from "csstype";
import React from "react";

/**
 * Types
 */
export interface ButtonProps {
  title: string;
  onClick: () => void;
  className?: string;
  bgColor?: string;
  color?: string;
  width?: number | string;
  height?: number | string;
  style?: CSS.Properties;
}

/**
 * Component
 */
export const Button = (props: ButtonProps): JSX.Element => {
  const { title, onClick, className, style, bgColor, color, width, height } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      style={{
        ...style,
        backgroundColor: bgColor,
        color,
        width,
        height,
        padding: "10px",
        borderRadius: "5px",
        boxShadow: bgColor && "0px 0px 10px rgba(0,0,0,0.2)"
      }}
    >
      {title}
    </button>
  );
};
