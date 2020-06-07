import React from "react";
import * as jsdiff from "diff";
import styled from "styled-components";
import { Box, Typography } from "@material-ui/core";

interface Props {
  line?: string;
  correction?: string;
  reply: string;
}

const getOldParts = (parts: jsdiff.Change[]) => {
  return parts.filter((part) => !part.added || part.removed);
};

const getNewParts = (parts: jsdiff.Change[]) => {
  return parts.filter((part) => part.added || !part.removed);
};

const getChangePartColor = (
  added: boolean | undefined,
  removed: boolean | undefined
): string => {
  if (added === removed) {
    return "transparent";
  }
  if (added) {
    return "#acf2bd";
  }
  return "#fdb8c0";
};

interface ChangedPartProps {
  added: boolean | undefined;
  removed: boolean | undefined;
}

const ChangedPart = styled.span<ChangedPartProps>`
  background-color: ${(props) =>
    getChangePartColor(props.added, props.removed)};
`;

const DiffPanel: React.FC<{ oldStr: string; newStr: string }> = ({
  oldStr,
  newStr,
}) => {
  const diff = jsdiff.diffChars(oldStr, newStr);
  return (
    <div
      style={{
        border: "1px solid #e1e4e8",
        borderRadius: "5px",
      }}
    >
      <div style={{ padding: "5px" }}>Correction</div>
      <div
        style={{
          backgroundColor: "#ffeef0",
          padding: "5px",
        }}
      >
        {getOldParts(diff).map((part, index) => (
          <ChangedPart key={index} added={part.added} removed={part.removed}>
            {part.value}
          </ChangedPart>
        ))}
      </div>
      <div
        style={{
          backgroundColor: "#e6ffed",
          padding: "5px",
        }}
      >
        {getNewParts(diff).map((part, index) => (
          <ChangedPart key={index} added={part.added} removed={part.removed}>
            {part.value}
          </ChangedPart>
        ))}
      </div>
    </div>
  );
};

export const PrettyReply: React.FC<Props> = ({ line, correction, reply }) => {
  return (
    <div>
      {correction && line && (
        <Box marginY={1}>
          <DiffPanel oldStr={line} newStr={correction} />
        </Box>
      )}
      {!correction && line && (
        <Box marginY={1}>
          <div
            style={{
              border: "1px solid #e1e4e8",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            {line}
          </div>
        </Box>
      )}
      <Box marginLeft={1}>
        <Typography variant="body1">{reply}</Typography>
      </Box>
    </div>
  );
};
