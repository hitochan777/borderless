import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import Link from "next/link";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    margin: "auto"
  }
}));

export interface Props {
  id: number;
  user: {
    username: string;
  };
  lines: string[];
  language: {
    name: string;
  };
  isDraft: boolean;
}

export const PostContent: React.StatelessComponent<Props> = ({
  id,
  user,
  lines,
  language,
  isDraft
}) => {
  const classes = useStyles();
  return (
    <Grid container spacing={1}>
      <Grid item>
        <Paper className={classes.paper}>
          <Typography gutterBottom variant="subtitle1">
            {lines[0]}
          </Typography>
          <ul>
            <li>Language: {language.name}</li>
            <li>Posted by {user.username}</li>
            <li>
              Content
              <div>
                {lines.map((line, index) => (
                  <p key={index}>
                    <Link
                      href={{ pathname: "/post/[id]", query: { line: index } }}
                      as={`/post/${id}?line=${index}`}
                    >
                      <a>{line}</a>
                    </Link>
                  </p>
                ))}
              </div>
            </li>
          </ul>
          {isDraft ? (
            <Link href="/post/[id]/edit" as={`/post/${id}/edit`}>
              <Button variant="contained" color="primary">
                Edit
              </Button>
            </Link>
          ) : (
            <Button variant="contained" color="primary" disabled={true}>
              Published
            </Button>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};
