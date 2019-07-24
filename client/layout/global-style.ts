import { createGlobalStyle } from "styled-components";

interface Props {}

export const GlobalStyle = createGlobalStyle<Props>`
  body {
      margin: 0;
      padding: 0;
      @import url('https://fonts.googleapis.com/css?family=Notable');
      font-family: 'Notable', sans-serif;
  }
`;
