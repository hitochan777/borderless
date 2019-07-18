import React from "react";
import styled from "styled-components";
import { useQuery } from "react-apollo-hooks";
import { query, types } from "typed-graphqlify";
import gql from "graphql-tag";

import { useStateValue } from "../store";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";

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

const Layout: React.StatelessComponent<Props> = ({
  children
}: {
  children?: React.ReactNode;
}) => {
  const { state } = useStateValue();
  const { data, error, loading: queryLoading } = useQuery<
    typeof GetViewerQuery
  >(GET_VIEWER);
  const loading = state.loading || queryLoading;
  if (error) {
    throw error;
  }
  if (loading) {
    return (
      <LoadingWrapper>
        <Loading />
      </LoadingWrapper>
    );
  }
  if (!data) {
    throw new Error("Unexpected error");
  }
  const isInfoEmpty =
    data.viewer.email.length === 0 || data.viewer.username.length === 0;

  if (isInfoEmpty) {
    // TODO: use modal or something to show a form
    return <span>You need to fill in info</span>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
