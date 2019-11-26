import React from "react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import CommentIcon from "@material-ui/icons/Comment";
import Badge from "@material-ui/core/Badge";
import Link from "next/link";

import { CommentForm } from "@/components/molecule/CommentForm";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(4),
    margin: "auto"
  },
  metaData: {
    marginBottom: theme.spacing(2)
  },
  avatar: {
    width: 30,
    height: 30
  },
  button: {
    height: theme.spacing(3),
    padding: 0
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
  const showComments = () => {
    alert("show comments");
  };
  return (
    <Grid container>
      <Grid item xs={9}>
        <Paper className={classes.paper}>
          <Typography gutterBottom variant="h2" align="center">
            {lines[0]}
          </Typography>
          <Grid
            container
            direction="row"
            spacing={1}
            className={classes.metaData}
            justify="center"
          >
            <Grid item>
              <Avatar
                alt={user.username}
                src={`https://api.adorable.io/avatars/30/${user.username}@borderless.png`}
                className={classes.avatar}
              />
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">{user.username}</Typography>
            </Grid>
            <Grid item>
              <Chip label={language.name} size="small" />
            </Grid>
            <Grid item>
              {isDraft ? (
                <Link href="/post/[id]/edit" as={`/post/${id}/edit`}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                  >
                    Edit
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={true}
                  className={classes.button}
                >
                  Published
                </Button>
              )}
            </Grid>
          </Grid>

          <div>
            {lines.map((line, index) => (
              <Grid
                key={index}
                container
                spacing={2}
                justify="space-between"
                onClick={showComments}
              >
                <Grid item>
                  <Typography key={index} variant="body1" component="p">
                    {line}
                  </Typography>
                </Grid>
                <Grid item>
                  <Badge badgeContent={4} color="primary">
                    <CommentIcon />
                  </Badge>
                </Grid>
              </Grid>
            ))}
          </div>
        </Paper>
      </Grid>
      <Grid item xs={3}>
        <CommentForm />
      </Grid>
    </Grid>
  );
};
