import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Link from "next/link";

interface Props {
  id: number;
  user: {
    username: string;
  };
  lines: {
    text: string;
    replies: {
      username?: string;
      text: string;
    }[];
  }[];
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
  return (
    <Grid container spacing={1}>
      <Grid item>
        <Paper>
          <h3>{lines[0].text}</h3>
          <ul>
            <li>Language: {language.name}</li>
            <li>Posted by {user.username}</li>
            <li>
              Content
              <div>
                {lines.map((line, index) => (
                  <p key={index}>
                    {line.text} (Comment: {line.replies.length})
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
