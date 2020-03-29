import React from "react";

import { PostCorrection, Correction } from "./PostCorrection";
import { Typography } from "@material-ui/core";

interface Props {
  corrections: Correction[];
  lines: { id: string; text: string }[];
}

export const PostCorrections: React.FC<Props> = ({ corrections, lines }) => {
  return (
    <section>
      <Typography variant="h4">Corrections</Typography>
      {corrections.map((correction) => (
        <PostCorrection
          key={correction.id}
          correction={correction}
          lines={lines}
        />
      ))}
    </section>
  );
};
