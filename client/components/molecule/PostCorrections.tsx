import React from "react";

import { PostCorrection, Correction } from "./PostCorrection";
import { Typography } from "@material-ui/core";

interface Props {
  corrections: Correction[];
}

export const PostCorrections: React.FC<Props> = ({ corrections }) => {
  return (
    <section>
      <Typography variant="h4">Corrections</Typography>
      {corrections.map(correction => (
        <PostCorrection correction={correction} />
      ))}
    </section>
  );
};
