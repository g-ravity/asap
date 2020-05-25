import React from "react";
import { Helmet } from "react-helmet";

/**
 * Component
 */
const Dashboard = (): JSX.Element => {
  return (
    <>
      <Helmet>
        <title>Dashboard | Asap</title>
        <meta name="title" content="Dashboard | Asap" />
      </Helmet>

      <div>Dashboard</div>
    </>
  );
};

Dashboard.whyDidYouRender = true;

export default Dashboard;
