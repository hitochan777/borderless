import React from "react";
import styled from "styled-components";
import { useQuery } from "react-apollo-hooks";
import { query, types } from "typed-graphqlify";
import gql from "graphql-tag";

import { GlobalStyle } from "./global-style";
import { useStateValue } from "../store";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { FillInModal } from "../components/FillInModal";

const LoadingWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const GetViewerQuery = {
  viewer: {
    username: types.string,
    email: types.string,
    fluentLangs: [types.string],
    learningLangs: [types.string]
  }
};

const GET_VIEWER = gql(query(GetViewerQuery));

interface Props {}

const Layout: React.StatelessComponent<Props> = ({ children }) => {
  const { state } = useStateValue();
  const { data, error, loading: queryLoading } = useQuery<
    typeof GetViewerQuery
  >(GET_VIEWER, { skip: !state.user });
  const loading = state.loading || (state.user && queryLoading);
  if (loading) {
    return (
      <LoadingWrapper>
        <Loading />
      </LoadingWrapper>
    );
  }
  let shouldShowFillInfoModal: boolean = false;
  if (state.user) {
    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error("Unexpected error");
    }
    const isInfoEmpty =
      data.viewer.email.length === 0 || data.viewer.username.length === 0;

    if (state.user && isInfoEmpty) {
      // TODO: use modal or something to show a form
      shouldShowFillInfoModal = true;
    }
  }

  return (
    <>
      <GlobalStyle />
      <Navbar />
      <FillInModal open={shouldShowFillInfoModal} handleSubmit={() => {}} />
      <main>{children}</main>
    </>
  );
};

export default Layout;
