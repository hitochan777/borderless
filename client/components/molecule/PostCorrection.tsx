import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Divider,
} from "@material-ui/core";
import styled from "styled-components";

import dayjs from "@/lib/time";
import { FetchPostByIdQuery } from "@/generated/types";
import { PrettyReply } from "@/components/molecule/PrettyReply";

export type Correction = FetchPostByIdQuery["post"]["corrections"][number];

interface Props {
  correction: Correction;
  lines: { id: string; text: string }[];
  className?: string;
}

const OverallComment = styled.div`
  margin-top: ${(props) => props.theme.spacing(1)}px;
`;

export const PostCorrection: React.FC<Props> = ({
  correction,
  lines,
  className,
}) => {
  return (
    <Card className={className}>
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
          <>
            <PrettyReply
              key={lineCorrection.id}
              line={
                lines.filter((line) => line.id === lineCorrection.inReplyTo)[0]
                  .text || ""
              }
              correction={lineCorrection.correction || undefined}
              reply={lineCorrection.text}
            />
            <Divider />
          </>
        ))}
        <OverallComment>
          <Typography variant="subtitle1">Overall comment</Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {correction.summaryComment?.text}
          </Typography>
        </OverallComment>
      </CardContent>
    </Card>
  );
};
