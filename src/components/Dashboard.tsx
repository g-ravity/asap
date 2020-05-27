import styled from "@emotion/styled";
import differenceInMilliseconds from "date-fns/differenceInMilliseconds";
import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import { Helmet } from "react-helmet";
import colors from "../theme/colors";
import { getDate, getDay, getInitials, getMonth, getRandomColor, getYear } from "../utils";
import { Button } from "./widgets";

// NOTE: Uncomment this to check the design when the list has some projects
const projects: string[] = [
  "Asap",
  "Book Shop",
  "Quivia",
  "African Price",
  "MarkIt",
  "JSON GraphQL Server",
  "Invoicer",
  "Nagini"
];

// NOTE: Uncomment this to check the design when project list is empty
// const projects: string[] = [];

/**
 * Component
 */
const Dashboard = (): JSX.Element => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const dateTimeout = setTimeout(() => {
      setDate(new Date());
    }, differenceInMilliseconds(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0), date));
    return (): void => {
      clearTimeout(dateTimeout);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard | Asap</title>
        <meta name="title" content="Dashboard | Asap" />
      </Helmet>

      <Container fluid className="vh-100">
        <Row className="h-100">
          <Sidebar xs={12} lg={2} className="d-lg-flex flex-lg-column pb-2 pb-md-3 pb-lg-0">
            <Row className="align-items-center">
              <Logo src="/assets/images/logo.png" alt="Asap Logo" fluid />
              <h4 className="m-0 d-none d-lg-block" style={{ color: colors.secondary.light }}>
                Asap
              </h4>
              <Button title="+" onClick={() => console.log("New Project")} className="d-block d-lg-none" />
            </Row>

            <Button
              title="Create New Project"
              bgColor={colors.primary}
              color={colors.background}
              onClick={() => console.log("New Project")}
              className="my-3 d-none d-lg-block"
              style={{ maxWidth: "200px" }}
            />

            <Header className="mt-lg-3 mb-lg-0 mb-2">Projects ({projects.length})</Header>

            <ProjectContainer className="flex-nowrap flex-lg-column px-lg-3">
              {projects.length ? (
                projects.map(project => {
                  return (
                    <Row
                      key={project}
                      className="mx-1 mx-md-2 mx-lg-0 my-lg-3 align-items-center justify-content-center justify-content-lg-start"
                    >
                      <Col xs={12} lg="auto" className="p-0 d-flex justify-content-center mb-1">
                        <ProjectLogo bgColor={getRandomColor()} className="mr-lg-3">
                          {getInitials(project)}
                        </ProjectLogo>
                      </Col>
                      <Col xs={12} lg className="p-0">
                        <ProjectName className="m-0 text-center text-lg-left">{project}</ProjectName>
                      </Col>
                    </Row>
                  );
                })
              ) : (
                <p className="mx-3 my-0 my-lg-3 mx-lg-0">No projects yet!</p>
              )}
            </ProjectContainer>
          </Sidebar>

          <MainArea xs={12} lg={10} className="p-3 position-relative h-100">
            <h2>Dashboard</h2>
            <p>
              <span className="font-weight-bold" style={{ color: colors.primary }}>
                {getDay(date)}
              </span>
              , {`${getDate(date)} ${getMonth(date)} ${getYear(date)}`}
            </p>
            {projects.length ? (
              <>
                <h4 className="my-3">{projects[0].toUpperCase()}</h4>
                <Col>
                  {/* TODO: Replace these divs with List & Task components */}
                  <Row>
                    <div style={{ width: "100px", height: "300px", backgroundColor: "white", marginRight: "10px" }}>
                      List 1
                    </div>
                    <div style={{ width: "100px", height: "200px", backgroundColor: "white" }}>List 2</div>
                  </Row>
                </Col>
              </>
            ) : (
              <Center>
                <Image
                  src="/assets/images/koala-sleep.png"
                  width="300"
                  alt="A cute sleeping koala"
                  fluid
                  className="mb-3"
                />
                <h1 style={{ color: colors.grey.tertiary }} className="display-4">
                  Ssh! It&apos;s so quiet here.{" "}
                </h1>
                <p className="m-auto" style={{ color: colors.grey.tertiary }}>
                  Why don&apos;t you go ahead and create some project &amp; tasks to wake this cutie up!
                </p>
              </Center>
            )}
          </MainArea>
        </Row>
      </Container>
    </>
  );
};

/**
 * Styled Components
 */
const Sidebar = styled(Col)`
  background-color: ${colors.background};

  @media only screen and (min-width: 992px) {
    height: 100%;
  }
`;

const MainArea = styled(Col)`
  background-color: ${colors.grey.secondary};
`;

const Header = styled.p`
  font-size: 1.25rem;

  @media only screen and (min-width: 576px) {
    font-size: 1.5rem;
  }
`;

const ProjectContainer = styled(Row)`
  overflow-x: auto;

  @media only screen and (min-width: 992px) {
    overflow-x: hidden;
    overflow-y: auto;
    flex-grow: 1;
    flex-shrink: 1;
  }
`;

const ProjectLogo = styled.div`
  background-color: ${(props: { bgColor: string }): string => props.bgColor};
  text-align: center;
  font-weight: 700;
  color: ${colors.background};
  font-size: 1.2rem;
  width: 60px;
  height: 60px;
  line-height: 64px;
  border-radius: 10px;

  @media only screen and (min-width: 576px) {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    line-height: 44px;
  }
`;

const ProjectName = styled.p`
  font-size: 0.8rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 80px;

  @media only screen and (min-width: 576px) {
    width: 100%;
    font-size: 1.2rem;
  }
`;

const Logo = styled(Image)`
  width: 50px;

  @media only screen and (min-width: 576px) {
    width: 70px;
  }
`;

const Center = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;

  img {
    width: 180px;
  }

  h1 {
    font-size: 2rem;
  }

  p {
    width: 80%;
  }

  @media only screen and (min-width: 576px) {
    img {
      width: 300px;
    }

    h1 {
      font-size: 3.5rem;
    }

    p {
      width: 60%;
    }
  }
`;

Dashboard.whyDidYouRender = true;

export default Dashboard;
