import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

interface Props {
  title: string;
  username: string;
  language: string;
  handleClick: () => void;
}

export const PostCard: React.StatelessComponent<Props> = ({
  title,
  username,
  language,
  handleClick
}) => {
  return (
    <Card onClick={handleClick}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Typography color="textSecondary">{username}</Typography>
        <Typography color="primary" gutterBottom>
          {language}
        </Typography>
      </CardContent>
    </Card>
  );
};
