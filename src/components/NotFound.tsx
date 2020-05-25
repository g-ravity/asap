import styled from "@emotion/styled";
import React, { FunctionComponent } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import colors from "../theme/colors";

/**
 * Component
 */
const NotFound: FunctionComponent<{}> = () => {
  return (
    <>
      <Helmet>
        <title>404 | Asap</title>
        <meta name="title" content="404 | Asap" />
      </Helmet>

      <div className="vh-100 vw-100" style={{ backgroundColor: colors.secondary.light }}>
        <Container className="h-100 d-flex align-items-center">
          <Row className="align-items-center">
            <Col sm={12} md={6}>
              <h1 className="text-center text-md-left">
                <span className="display-1 d-block mb-5">Oops!</span> Looks like you&apos;re lost. Wanna get{" "}
                <Link to="/" style={{ color: colors.primary }}>
                  home
                </Link>
                ?
              </h1>
            </Col>
            <Col sm={12} md={6} className="text-center">
              <StyledImage src={require("../images/404.png")} width="600" alt="UFO abducting a laptop" fluid />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

/**
 * Styled Components
 */
const StyledImage = styled(Image)`
  @media only screen and (max-width: 576px) {
    width: 300px;
  }
  @media only screen and (min-width: 576px) {
    width: 400px;
  }
  @media only screen and (min-width: 1024px) {
    width: 600px;
  }
`;

NotFound.whyDidYouRender = true;

export default NotFound;
