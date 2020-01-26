import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Link from "next/link";

import dayjs from "@/lib/time";

interface Props {
  id: string;
  title: string;
  username: string;
  language: string;
  updatedAt: Date;
}

export const PostCard: React.FC<Props> = ({
  id,
  title,
  username,
  language,
  updatedAt
}) => {
  return (
    <Link href="/[username]/[postId]" as={`/${username}/${id}`}>
      <Card>
        <CardContent>
          <Typography variant="h5">{title}</Typography>
          <Avatar
            alt={username}
            src={`https://api.adorable.io/avatars/30/${username}@borderless.png`}
          />
          <Typography color="textSecondary">
            {username} ({dayjs(updatedAt).fromNow()})
          </Typography>
          <Typography color="primary" gutterBottom>
            {language}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};
