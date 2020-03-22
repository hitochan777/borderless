import React, { useReducer } from "react";
import { NextPage, NextPageContext } from "next";
import {
  Container,
  Button,
  Box,
  Typography,
  TextField,
} from "@material-ui/core";
import styled from "styled-components";

import Layout from "@/layout/default";
import { assert, assertIsDefined } from "@/lib/assert";
import {
  useFetchPostByIdQuery,
  useCorrectionGroupCreateMutation,
} from "@/generated/types";
import { PreviewEditor } from "@/components/molecule/PreviewEditor";

interface Props {
  postId: string;
  username: string;
}

const StyledLine = styled.div`
  padding-left: 5px;
  height: 2rem;
  border-left: 10px ${(props) => props.theme.palette.primary.main} solid;
  background-color: ${(props) => props.theme.palette.primary.light};
`;

const Line: React.FC<{
  children: React.ReactNode;
  lineId: string;
  onMouseOver: (lineId: string) => void;
}> = ({ children, lineId, onMouseOver }) => {
  const handleMouseOver = () => {
    onMouseOver(lineId);
  };
  return <StyledLine onMouseOver={handleMouseOver}>{children}</StyledLine>;
};

const ToggleEditorButton: React.FC<{
  onClick: (lineId: string) => void;
  currentLineId: string;
}> = ({ onClick, currentLineId }) => {
  const handleClick = () => {
    onClick(currentLineId);
  };
  return <span onClick={handleClick}>✐</span>;
};

interface State {
  hoveredId: string | null;
  focusedId: string | null;
  comments: { [lineId: string]: { lineId: string; text: string } };
  overallComment: string | null;
}

type Action =
  | { type: "updateFocusedId"; focusedId: string | null }
  | { type: "updateHoveredId"; hoveredId: string | null }
  | { type: "upsertComment"; id: string; comment: string }
  | { type: "updateOverallComment"; comment: string | null };

const initialState: State = {
  hoveredId: null,
  focusedId: null,
  comments: {},
  overallComment: null,
};

const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "updateHoveredId":
      return {
        ...state,
        hoveredId: action.hoveredId,
      };
    case "updateFocusedId":
      return {
        ...state,
        focusedId: action.focusedId,
      };
    case "upsertComment":
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.id]: { lineId: action.id, text: action.comment },
        },
      };
    case "updateOverallComment":
      return {
        ...state,
        overallComment: action.comment,
      };

    default:
      throw new Error("Unexpected action type");
  }
};

const CorrectionPage: NextPage<Props> = ({ postId }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [
    createCorrectionGroup,
    { loading: isSubmittingCorrection },
  ] = useCorrectionGroupCreateMutation();
  const { data, loading } = useFetchPostByIdQuery({
    variables: { id: postId },
  });
  if (loading) {
    return <span>loading...</span>;
  }

  const onMouseOver = (lineId: string) => {
    dispatch({ type: "updateHoveredId", hoveredId: lineId });
  };
  const toggleEditor = (lineId: string) => {
    if (lineId === state.focusedId) {
      dispatch({ type: "updateFocusedId", focusedId: null });
      return;
    }
    dispatch({ type: "updateFocusedId", focusedId: lineId });
  };
  const onChangeEditor = (comment: string) => {
    if (!state.focusedId) {
      throw new Error("no line is focused");
    }
    dispatch({ type: "upsertComment", id: state.focusedId, comment });
  };

  const onOverallCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "updateOverallComment", comment: e.target.value });
  };

  const submitCorrection = async () => {
    const parseRawComment = (
      raw: string
    ): { text: string; correction: string | null; error: boolean } => {
      const corrections = [...raw.matchAll(/```(.*?)```/gs)];
      if (corrections.length > 1) {
        alert("You cannot post multiple corrections at once");
        return { text: "", correction: null, error: true };
      }
      const commentWithoutCorrection = raw.replace(/```(.*?)```/gs, "").trim();
      return {
        text: commentWithoutCorrection,
        correction: corrections.length === 1 ? corrections[0][1].trim() : null,
        error: false,
      };
    };
    await createCorrectionGroup({
      variables: {
        summaryComment: {
          postId,
          inReplyTo: postId,
          // FIXME: if overallComment is null then do not post summaryComment in the first place
          text: state.overallComment ?? "",
        },
        corrections: Object.entries(state.comments).map(([lineId, comment]) => {
          const { text, correction } = parseRawComment(comment.text);
          return {
            postId,
            inReplyTo: lineId,
            text,
            correction,
          };
        }),
      },
    });
  };

  assertIsDefined(data);
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box marginBottom={2}>
          {data.post.lines.map((line) => (
            <div key={line.id}>
              <Line onMouseOver={onMouseOver} lineId={line.id}>
                <Typography variant="body1">
                  {line.id === state.hoveredId && (
                    <ToggleEditorButton
                      onClick={toggleEditor}
                      currentLineId={line.id}
                    />
                  )}
                  {line.partialLines.map((pl) => pl.text).join("")}
                </Typography>
              </Line>
              {line.id === state.focusedId && (
                <PreviewEditor
                  onChange={onChangeEditor}
                  line={line.partialLines.map((pl) => pl.text).join("")}
                  value={state.comments[state.focusedId]?.text || ""}
                />
              )}
              <Box marginBottom={2} />
            </div>
          ))}
          <TextField
            fullWidth
            onChange={onOverallCommentChange}
            value={state.overallComment}
            placeholder="Overall comment here!"
          />
          <Button
            variant="contained"
            onClick={submitCorrection}
            disabled={loading || isSubmittingCorrection}
            color="primary"
          >
            {loading ? "Submitting..." : "Publish"}
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

CorrectionPage.getInitialProps = async (
  ctx: NextPageContext
): Promise<{ postId: string; username: string }> => {
  const { postId, username } = ctx.query;
  assert(typeof postId === "string");
  assert(typeof username === "string");
  return { postId, username };
};

export default CorrectionPage;
