import styled from "@emotion/styled";
import React, { useRef } from "react";
import Modal, { ModalProps } from "react-bootstrap/Modal";
import colors from "../../theme/colors";
import { Button } from "../widgets";
import AuthForm from "./AuthForm";
import { useAuth } from "../../context/AuthContext";

/**
 * Types
 */
export type AuthModalState = "signUp" | "signIn" | null;
interface AuthModalProps extends ModalProps {
  authModalState: AuthModalState;
}

/**
 * Components
 */
const AuthModal: React.FC<AuthModalProps> = props => {
  const { authModalState, ...restProps } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    actions: { signIn, signUp }
  } = useAuth();

  const signInClick = (): void => containerRef.current?.classList.remove("right-panel-active");

  const signUpClick = (): void => containerRef.current?.classList.add("right-panel-active");

  return (
    <StyledModal {...restProps}>
      <Container ref={containerRef} className={authModalState === "signUp" ? "right-panel-active" : ""}>
        <AuthForm onSubmit={signIn} />
        <AuthForm onSubmit={signUp} isSignUp />
        <OverlayContainer className="overlay-container">
          <Overlay className="overlay">
            <OverlayComponent onBtnClick={signInClick} />
            <OverlayComponent onBtnClick={signUpClick} isSignUp />
          </Overlay>
        </OverlayContainer>
      </Container>
    </StyledModal>
  );
};

const OverlayComponent: React.FC<{ isSignUp?: boolean; onBtnClick: () => void }> = props => {
  const { isSignUp, onBtnClick } = props;
  return (
    <OverlayPanel className={`overlay-panel ${isSignUp ? "overlay-right" : "overlay-left"}`}>
      <h1>{isSignUp ? "Hello, Friend!" : "Welcome Back!"}</h1>
      <p>
        {isSignUp
          ? "Enter your personal details and start journey with us"
          : "To keep connected with us please login with your personal info"}
      </p>
      <Button title={isSignUp ? "Sign Up" : "Sign In"} onClick={onBtnClick} variant="outline-light" />
    </OverlayPanel>
  );
};

/**
 * Styled Components
 */
const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
`;

const Overlay = styled.div`
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  background-color: ${colors.primary};
  color: ${colors.background};
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
`;

const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
`;

const Container = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  max-width: 100%;
  min-height: 540px;
  z-index: 2;
`;

const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 7rem;
  }

  @media (min-width: 576px) {
    .modal-dialog {
      max-width: 40%;
      margin: 1.75rem auto;
    }
  }
  .overlay-left {
    transform: translateX(-20%);
  }
  .overlay-right {
    right: 0;
    transform: translateX(0);
  }
  .right-panel-active {
    .overlay {
      transform: translateX(50%);
    }
    .overlay-container {
      transform: translateX(-100%);
    }
    .overlay-left {
      transform: translateX(0);
    }
    .overlay-right {
      transform: translateX(20%);
    }
    .sign-in-container {
      transform: translateX(100%);
    }
    .sign-up-container {
      transform: translateX(100%);
      opacity: 1;
      z-index: 5;
    }
  }
`;

AuthModal.whyDidYouRender = true;

export default AuthModal;
