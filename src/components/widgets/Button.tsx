import React from "react";

/**
 * Types
 */
export interface ButtonProps {
  title: string;
  onClick: () => void;
  className?: string;
}

/**
 * Component
 */
export const Button = (props: ButtonProps): JSX.Element => {
  const { title, onClick, className } = props;

  return (
    <button type="button" onClick={onClick} className={className}>
      {title}
    </button>
  );
};
