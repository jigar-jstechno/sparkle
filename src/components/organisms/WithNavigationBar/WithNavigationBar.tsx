import React from "react";

import NavBar from "components/molecules/NavBar";
import { Footer } from "components/molecules/Footer";

import "./WithNavigationBar.scss";

interface PropsType {
  children: React.ReactNode;
  redirectionUrl?: string;
  fullscreen?: boolean;
}

export const WithNavigationBar: React.FunctionComponent<PropsType> = ({
  redirectionUrl,
  fullscreen,
  children,
}) => (
  <>
    <NavBar redirectionUrl={redirectionUrl} />
    <div className={`navbar-margin ${fullscreen ? "fullscreen" : ""}`}>
      {children}
    </div>
    <Footer />
  </>
);

/**
 * @deprecated use named export instead
 */
export default WithNavigationBar;
