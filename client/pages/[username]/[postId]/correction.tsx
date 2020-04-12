import React, { useReducer } from "react";
import { NextPage, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  Container,
  Button,
  Box,
  Typography,
  TextField,
} from "@material-ui/core";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@material-ui/icons";
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
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const Line: React.FC<{
  children: React.ReactNode;
  lineId: string;
  onClick: (lineId: string) => void;
}> = ({ children, lineId, onClick }) => {
  const handleClick = () => {
    onClick(lineId);
  };
  return <StyledLine onClick={handleClick}>{children}</StyledLine>;
};

interface State {
  focusedId: string | null;
  comments: { [lineId: string]: { lineId: string; text: string } };
  overallComment: string | null;
}

type Action =
  | { type: "updateFocusedId"; focusedId: string | null }
  | { type: "upsertComment"; id: string; comment: string }
  | { type: "updateOverallComment"; comment: string | null };

const initialState: State = {
  focusedId: null,
  comments: {},
  overallComment: null,
};

const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
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

const CorrectionPage: NextPage<Props> = ({ postId, username }) => {
  const router = useRouter();
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
    router.push("/[username]/[postId]", `/${username}/${postId}`);
  };

  assertIsDefined(data);
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box marginBottom={2}>
          {data.post.lines.map((line) => (
            <div key={line.id}>
              <Line lineId={line.id} onClick={toggleEditor}>
                <Typography variant="body1">
                  {line.partialLines.map((pl) => pl.text).join("")}
                </Typography>
                {line.id === state.focusedId ? (
                  <ExpandMoreIcon />
                ) : (
                  <ExpandLessIcon />
                )}
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
          <Box marginTop={2}>
            <Button
              variant="contained"
              onClick={submitCorrection}
              disabled={loading || isSubmittingCorrection}
              color="primary"
            >
              {loading ? "Submitting..." : "Publish"}
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<{
  postId: string;
  username: string;
}> = async (ctx) => {
  const { postId, username } = ctx.query;
  assert(typeof postId === "string");
  assert(typeof username === "string");
  return { props: { postId, username } };
};

export default CorrectionPage;
