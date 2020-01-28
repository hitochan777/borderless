import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  footer: {
    bottom: 0,
    width: "100%",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    textAlign: "center"
  }
}));

const Footer: React.FC = () => {
  const classes = useStyles();
  return <footer className={classes.footer}>Park©2020</footer>;
};
export default Footer;
