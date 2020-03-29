import React from "react";
import styled from "styled-components";

import { PostCorrection, Correction } from "./PostCorrection";

interface Props {
  corrections: Correction[];
  lines: { id: string; text: string }[];
}

const StyledPostCorrections = styled.section`
  margin-top: ${(props) => props.theme.spacing(3)}px;
`;

const StyledPostCorrection = styled(PostCorrection)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

export const PostCorrections: React.FC<Props> = ({ corrections, lines }) => {
  return (
    <StyledPostCorrections>
      {corrections.map((correction) => (
        <StyledPostCorrection
          key={correction.id}
          correction={correction}
          lines={lines}
        />
      ))}
    </StyledPostCorrections>
  );
};
