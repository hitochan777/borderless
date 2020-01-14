import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#98ee99",
      main: "#66bb6a",
      dark: "#338a3e",
      contrastText: "#fff"
    }
  },
  typography: {
    body1: {
      fontSize: 18
    }
  }
});
