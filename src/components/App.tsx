import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Loader } from "./widgets";

/**
 * Types
 */
export interface Page {
  link: string;
  view: React.FC;
}

const Landing = React.lazy(() => import("./Landing"));
const Dashboard = React.lazy(() => import("./Dashboard"));
const NotFound = React.lazy(() => import("./NotFound"));

/**
 * Component
 */
const App = (): JSX.Element => {
  const pages: Page[] = [
    {
      link: "/",
      view: Landing
    },
    {
      link: "/dashboard",
      view: Dashboard
    }
  ];

  return (
    <Router>
      <React.Suspense fallback={Loader}>
        <Switch>
          {pages.map(page => (
            <Route exact path={page.link} component={page.view} key={page.link} />
          ))}
          <Route path="*" component={NotFound} />
        </Switch>
      </React.Suspense>
    </Router>
  );
};

App.whyDidYouRender = true;

export default App;
