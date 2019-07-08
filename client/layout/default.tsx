import React from "react";
import styled from "styled-components"

import { useStateValue } from "../store";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";

const LoadingWrapper = styled.div`
    display: flex;
    width: 100vw;
    height: 100vh;
    align-items: center;
    justify-content: center;
`

const Layout = ({ children }: { children?: React.ReactNode}) => {
  const { state } = useStateValue();
  return state.loading ? (
    <LoadingWrapper>
        <Loading />
    </LoadingWrapper>
  ) : (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
