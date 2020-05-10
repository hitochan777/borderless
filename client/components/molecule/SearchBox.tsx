import React, { useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";

import {
  fade,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";

import LanguageSelector from "./LanguageSelector";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 2),
      transition: theme.transitions.create("width"),
      width: "100%",
    },
  })
);

export const SearchBox: React.FC<{}> = () => {
  const classes = useStyles();
  return (
    <div className={classes.search}>
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search" }}
      />
    </div>
  );
};

const useFullSearchBoxStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  })
);

interface Props {
  executeSearch: (query: { language: string }) => Promise<void>;
  withTextSearch?: boolean;
  placeholder?: string;
}

export const FullSearchBox: React.FC<Props> = ({
  executeSearch,
  withTextSearch = false,
  placeholder,
}) => {
  const [language, setLanguage] = useState<string | null>(null);
  const classes = useFullSearchBoxStyles();

  const onSubmit = (evt: React.FormEvent<HTMLDivElement>) => {
    evt.preventDefault();
    const query = {
      language: language || "",
    };
    executeSearch(query);
  };

  return (
    <Paper
      component="form"
      className={classes.root}
      onSubmit={onSubmit}
      elevation={0}
    >
      <LanguageSelector
        onChange={(value) => {
          setLanguage(value);
        }}
        label=""
        value={language}
        placeholder={placeholder}
      />
      {withTextSearch && (
        <>
          <SearchBox />
          <Divider className={classes.divider} orientation="vertical" />{" "}
        </>
      )}
      <IconButton
        type="submit"
        className={classes.iconButton}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};
