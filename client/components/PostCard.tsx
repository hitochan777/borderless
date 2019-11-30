import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Link from "next/link";

interface Props {
  id: number;
  title: string;
  username: string;
  language: string;
}

export const PostCard: React.StatelessComponent<Props> = ({
  id,
  title,
  username,
  language
}) => {
  return (
    <Link href="/post/[id]" as={`/post/${id}`}>
      <Card>
        <CardContent>
          <Typography variant="h3">{title}</Typography>
          <Avatar
            alt={username}
            src={`https://api.adorable.io/avatars/30/${username}@borderless.png`}
          />
          <Typography color="textSecondary">{username}</Typography>
          <Typography color="primary" gutterBottom>
            {language}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};
