import styled from "@emotion/styled";
import React from "react";
import { ListType } from "./List";

/**
 * Types
 */
export interface FABProps {
  addList: (newList: ListType) => void;
}

/**
 * Component
 */
const FAB: React.FC<FABProps> = props => {
  const { addList } = props;

  //   TODO: Use the Button widget after it's updated
  return (
    <Container>
      <div className="sub-button tl">
        <button type="button" title="List" onClick={(): void => addList({ name: "New List", tasks: [] })}>
          <i className="fas fa-list" />
        </button>
      </div>
      <div className="sub-button tr">
        <button type="button" title="Label">
          <i className="fas fa-tag" />
        </button>
      </div>
      <div className="sub-button bl">
        <button type="button" title="Priority">
          <i className="fas fa-tint" />
        </button>
      </div>
      <div className="sub-button br">
        <button type="button" title="Status">
          <i className="fas fa-clipboard-check" />
        </button>
      </div>
    </Container>
  );
};

/**
 * Styled Components
 */
const Container = styled.div`
  position: fixed;
  right: 40px;
  bottom: 40px;
  width: 56px;
  height: 56px;
  overflow: visible;
  transition: transform 0.4s cubic-bezier(0.58, -0.37, 0.45, 1.46), color 0s ease 0.4s, font-size 0.2s;
  text-align: center;
  line-height: 54px;
  font-size: 36px;
  color: rgba(255, 255, 255, 1);

  i {
    font-size: 20px;
  }

  button {
    color: rgba(255, 255, 255, 0);
  }

  :before {
    position: relative;
    z-index: 100;
    content: "+";
  }

  :hover {
    color: rgba(255, 255, 255, 0);
    transform: rotate(45deg);

    button {
      color: rgba(255, 255, 255, 1);
      transition: color 0.3s ease 0.8s, transform 0.3s ease 0.8s;
    }

    .sub-button {
      width: 48px;
      height: 48px;
      transform: rotate(-45deg);

      color: rgba(255, 255, 255, 1);
      transition: top 0.4s cubic-bezier(0.58, -0.37, 0.45, 1.46) 0.4s,
        left 0.4s cubic-bezier(0.58, -0.37, 0.45, 1.46) 0.4s, bottom 0.4s cubic-bezier(0.58, -0.37, 0.45, 1.46) 0.4s,
        right 0.4s cubic-bezier(0.58, -0.37, 0.45, 1.46) 0.4s, width 0.4s cubic-bezier(0.58, -0.37, 0.45, 1.46) 0.4s,
        height 0.4s cubic-bezier(0.58, -0.37, 0.45, 1.46) 0.4s, color 0.3s ease 0.8s, transform 0.3s ease 0.8s,
        border-radius 0.4s ease 0.6s;
    }

    .tl {
      top: -25px;
      left: -25px;
      border-radius: 28px;
    }

    .tr {
      top: -25px;
      right: -25px;
      border-radius: 28px;
    }

    .bl {
      bottom: -25px;
      left: -25px;
      border-radius: 28px;
    }

    .br {
      bottom: -25px;
      right: -25px;
      border-radius: 28px;
    }
  }

  .sub-button {
    position: absolute;
    display: inline-block;
    background-color: #ff4081;
    color: rgba(255, 255, 255, 0);
    width: 28px;
    height: 28px;
    line-height: 56px;
    font-size: 12px;
    transition: top 0.2s cubic-bezier(0.58, -0.37, 0.45, 1.46) 0.2s,
      left 0.2s cubic-bezier(0.58, -0.37, 0.45, 1.46) 0.2s, bottom 0.2s cubic-bezier(0.58, -0.37, 0.45, 1.46) 0.2s,
      right 0.2s cubic-bezier(0.58, -0.37, 0.45, 1.46) 0.2s, width 0.2s cubic-bezier(0.58, -0.37, 0.45, 1.46) 0.2s,
      height 0.2s cubic-bezier(0.58, -0.37, 0.45, 1.46) 0.2s, transform 0.1s ease 0s, border-radius 0.2s ease 0.2s;
  }

  .tl {
    top: 0;
    left: 0;
    border-radius: 28px 0 0 0;
  }

  .tr {
    top: 0;
    right: 0;
    border-radius: 0 28px 0 0;
  }

  .bl {
    bottom: 0;
    left: 0;
    border-radius: 0 0 0 28px;
  }

  .br {
    bottom: 0;
    right: 0;
    border-radius: 0 0 28px 0;
  }
`;

export default FAB;
