import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#8FBCBB",
      main: "#88C0D0",
      dark: "#5E81AC",
      contrastText: "#fff",
    },
    text: {
      secondary: "#fffff",
    },
  },
  typography: {
    h1: {
      fontSize: "20",
    },
    h2: {
      fontSize: "18",
    },
    h3: {
      fontSize: "16",
    },
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});
