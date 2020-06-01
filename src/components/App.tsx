import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Loader } from "./widgets";
import { useAuth } from "../context/AuthContext";

/**
 * Types
 */

const Landing = React.lazy(() => import("./Landing"));
const Dashboard = React.lazy(() => import("./Dashboard"));
const NotFound = React.lazy(() => import("./NotFound"));

/**
 * Component
 */
const App: React.FC = () => {
  const {
    state: { userData }
  } = useAuth();

  return (
    <Router>
      <React.Suspense fallback={<Loader />}>
        <Switch>
          {userData ? <Route exact path="/" component={Dashboard} /> : <Route exact path="/" component={Landing} />}
          <Route path="*" component={NotFound} />
        </Switch>
      </React.Suspense>
    </Router>
  );
};

/* Routes */
// const pages: Pick<RouteProps, "path" | "component">[] = [];

App.whyDidYouRender = true;

export default App;
