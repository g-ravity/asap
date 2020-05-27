import styled from "@emotion/styled";
import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import { Helmet } from "react-helmet";
import colors from "../theme/colors";
import { Button } from "./widgets";

/**
 * Component
 */
const Landing = (): JSX.Element => {
  return (
    <>
      <Helmet>
        <title>Asap - Task Manager</title>
        <meta name="title" content="Asap - Task Manager" />
      </Helmet>

      <Container className="d-flex flex-column align-items-center justify-content-between vh-100">
        <Row className="align-items-center w-100 px-md-5 px-3 py-2 py-md-0">
          <Col xs={4} className="p-0">
            <Logo src="/images/logo.png" alt="Asap Logo" fluid />
          </Col>
          <Col xs={8} className="p-0">
            <div className="d-flex justify-content-end">
              <Button title="Sign In" onClick={() => console.log("Signed In")} className="mr-2" />
              <Button
                title="Sign Up"
                onClick={() => console.log("Signed Up")}
                bgColor={colors.secondary.light}
                color={colors.background}
              />
            </div>
          </Col>
        </Row>

        <Row className="flex-column align-items-center w-100">
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
        </Row>

        <Image src="/images/landing.png" width="600" alt="A man drinking coffee & working" fluid />
      </Container>
    </>
  );
};

/**
 * Styled Components
 */
const Logo = styled(Image)`
  width: 50px;

  @media only screen and (min-width: 576px) {
    width: 70px;
  }

  @media only screen and (min-width: 768px) {
    width: 100px;
  }
`;

Landing.whyDidYouRender = true;

export default Landing;
