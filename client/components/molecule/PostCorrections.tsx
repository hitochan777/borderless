import React from "react";

import { PostCorrection } from "./PostCorrection";
import { FetchPostByIdQuery } from "@/generated/types";

interface Props {
  corrections: FetchPostByIdQuery["post"]["corrections"];
}

export const PostCorrections: React.FC<Props> = ({ corrections }) => {
  // corrections.map(callbackfn)
  corrections.return(
    <>
      {corrections.map(correction => (
        <PostCorrection correction={correction} />
      ))}
    </>
  );
};
