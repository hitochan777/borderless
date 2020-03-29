import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
} from "@material-ui/core";
import dayjs from "@/lib/time";

import { FetchPostByIdQuery } from "@/generated/types";
import { PrettyReply } from "@/components/molecule/PrettyReply";

export type Correction = FetchPostByIdQuery["post"]["corrections"][number];

interface Props {
  correction: Correction;
  lines: { id: string; text: string }[];
}

export const PostCorrection: React.FC<Props> = ({ correction, lines }) => {
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            alt={correction.postedBy.username}
            src={`https://api.adorable.io/avatars/30/${correction.postedBy.username}@borderless.png`}
          />
        }
        title={correction.postedBy.username}
        subheader={dayjs(correction.updatedAt).fromNow()}
      />
      <CardContent>
        {correction.lineCorrections.map((lineCorrection) => (
          <PrettyReply
            key={lineCorrection.id}
            line={
              lines.filter((line) => line.id === lineCorrection.inReplyTo)[0]
                .text || ""
            }
            correction={lineCorrection.correction || undefined}
            reply={lineCorrection.text}
          />
        ))}
        <Typography variant="body2" color="textSecondary" component="p">
          {correction.summaryComment?.text}
        </Typography>
      </CardContent>
    </Card>
  );
};
