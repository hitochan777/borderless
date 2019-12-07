import React from "react";
import { useQuery } from "@apollo/react-hooks";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";

import dayjs from "@/lib/time";
import { FETCH_TWEETS_FOR_LINE_QUERY } from "@/constant/graphql";
import {
  FetchTweetsForLineQuery,
  FetchTweetsForLineQueryVariables
} from "@/generated/types";

interface Props {
  lineId: string;
}

export const LineCommentList: React.FC<Props> = ({ lineId }) => {
  const { data, error, loading } = useQuery<
    FetchTweetsForLineQuery,
    FetchTweetsForLineQueryVariables
  >(FETCH_TWEETS_FOR_LINE_QUERY, { variables: { id: lineId } });

  if (loading) {
    return <></>;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("unexpected error");
  }
  return (
    <List>
      {data.replies.map(reply => (
        <React.Fragment key={reply.id}>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                alt={"username here"}
                src={`https://api.adorable.io/avatars/30/usernamehere@borderless.png`}
              />
            </ListItemAvatar>

            <ListItemText>
              <div>{dayjs(reply.updatedAt).fromNow()}</div>
              <div>{reply.text}</div>
            </ListItemText>
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};
