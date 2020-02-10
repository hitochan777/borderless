import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Chip,
  Typography,
  Avatar
} from "@material-ui/core";
import Link from "next/link";
import dayjs from "@/lib/time";

interface Props {
  id: string;
  title: string;
  username: string;
  language: string;
  updatedAt: Date;
  description: string;
}

const MAX_DESCRIPTION_LEN = 100;

export const PostCard: React.FC<Props> = ({
  id,
  title,
  username,
  language,
  updatedAt,
  description
}) => {
  return (
    <Link href="/[username]/[postId]" as={`/${username}/${id}`}>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              alt={username}
              src={`https://api.adorable.io/avatars/30/${username}@borderless.png`}
            />
          }
          title={title}
          subheader={`${username} ${dayjs(updatedAt).fromNow()}`}
          action={
            <Chip
              label={language}
              size="small"
              onClick={e => {
                e.preventDefault();
                // TODO: To route to search result page
              }}
            />
          }
        ></CardHeader>
        <CardContent>
          <Typography color="textPrimary">
            {description.substr(0, MAX_DESCRIPTION_LEN) +
              (description.length > MAX_DESCRIPTION_LEN ? "..." : "")}
          </Typography>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Link>
  );
};
