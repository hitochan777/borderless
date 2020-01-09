import React from "react";
import Head from "next/head";
import styled from "styled-components";
import { Snackbar } from "@material-ui/core";

import { GlobalStyle } from "./global-style";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { FillInModal } from "../components/FillInModal";
import { useViewer } from "@/hooks/useViewer";
import { useUid, useErrorMessage } from "@/store";
import { useSetErrorMessageMutation } from "@/generated/types";
import { useLoading } from "@/store";

const LoadingWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const Layout: React.FC<{ title?: string }> = ({ children, title = "parc" }) => {
  const uid = useUid();
  const errorMessage = useErrorMessage();
  const globalLoading = useLoading();
  const { viewer, loading: queryLoading } = useViewer();
  const [setErrorMessage] = useSetErrorMessageMutation();
  const loading = globalLoading || queryLoading;
  if (loading) {
    return (
      <LoadingWrapper>
        <Loading />
      </LoadingWrapper>
    );
  }
  let shouldShowFillInfoModal = false;
  let formData;
  if (uid) {
    if (!viewer) {
      throw new Error("Unexpected error");
    }

    const { email, username, learningLanguages, fluentLanguages } = viewer;
    const isInfoEmpty =
      email.length === 0 ||
      username.length === 0 ||
      learningLanguages.length === 0 ||
      fluentLanguages.length === 0;

    if (uid && isInfoEmpty) {
      shouldShowFillInfoModal = true;
      formData = {
        email,
        username,
        learningLanguages: learningLanguages.map(l => `${l}`),
        fluentLanguages: fluentLanguages.map(l => `${l}`)
      };
    }
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <GlobalStyle />
      <Navbar />
      <FillInModal open={shouldShowFillInfoModal} formData={formData} />
      <Snackbar
        open={!!errorMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={errorMessage}
        autoHideDuration={2000}
        onClose={() => {
          setErrorMessage({ variables: { errorMessage: null } });
        }}
      />
      <main>{children}</main>
    </>
  );
};

export default Layout;
