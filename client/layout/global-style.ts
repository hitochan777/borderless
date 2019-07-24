import { createGlobalStyle } from "styled-components";

interface Props {}

export const GlobalStyle = createGlobalStyle<Props>`
  body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
  }
`;
