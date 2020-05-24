import styled from "@emotion/styled";
import React from "react";
import Container from "react-bootstrap/Container";
import colors from "../theme/colors";
import { Button } from "./widgets";

/**
 * Component
 */
const Landing = () => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-between vh-100 overflow-hidden">
      <div className="d-flex justify-content-between align-items-center px-md-5 px-3 w-100 py-2 py-md-0">
        <Logo src={require("../images/logo.png")} alt="Asap Logo" className="img-fluid" />
        <div>
          <Button title="Sign In" onClick={() => console.log("Signed In")} className="mr-2" />
          <Button
            title="Sign Up"
            onClick={() => console.log("Signed Up")}
            bgColor={colors.secondary.light}
            color={colors.background}
          />
        </div>
      </div>

      <div className="d-flex flex-column align-items-center">
        <h1 className="text-center mb-3">Complete your tasks, ASAP!</h1>
        <p className="text-center w-75">
          Use Kanban boards, checklists and assign tasks to your friends, colleagues & employees. Prioritize and
          complete your projects in a fun & rewarding way with Asap.
        </p>
        <Button
          title="Get Started"
          onClick={() => console.log("Getting Started")}
          bgColor={colors.primary}
          color={colors.background}
          className="mt-3"
        />
      </div>

      <img
        src={require("../images/landing.png")}
        width="800"
        alt="A man drinking coffee & working"
        className="img-fluid"
      />
    </Container>
  );
};

/**
 * Styled Components
 */
const Logo = styled.img`
  @media only screen and (max-width: 576px) {
    width: 50px;
  }
  @media only screen and (min-width: 576px) {
    width: 70px;
  }
  @media only screen and (min-width: 768px) {
    width: 100px;
  }
`;

Landing.whyDidYouRender = true;

export default Landing;
