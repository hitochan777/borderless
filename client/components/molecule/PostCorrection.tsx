import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  // CardActions,
  Avatar,
  // IconButton,
  Typography
} from "@material-ui/core";
import dayjs from "@/lib/time";

import { FetchPostByIdQuery } from "@/generated/types";
import { PrettyReply } from "@/components/molecule/PrettyReply";

export type Correction = FetchPostByIdQuery["post"]["corrections"][number];

interface Props {
  correction: Correction;
}

export const PostCorrection: React.FC<Props> = ({ correction }) => (
  <Card>
    <CardHeader
      avatar={<Avatar>R</Avatar>}
      title={correction.postedBy.username}
      subheader={dayjs(correction.updatedAt).fromNow()}
    />
    <CardContent>
      <Typography variant="body2" color="textSecondary" component="p">
        {correction.lineCorrections.map(lineCorrection => (
          <PrettyReply
            line={
              "hohoho" // TODO: use correct line text
            }
            correction={lineCorrection.correction || undefined}
            reply={lineCorrection.text}
          />
        ))}
      </Typography>
    </CardContent>
    {/*<CardActions disableSpacing>
      <IconButton aria-label="add to favorites"></IconButton>
      <IconButton aria-label="share"></IconButton>
    </CardActions>*/}
  </Card>
);
