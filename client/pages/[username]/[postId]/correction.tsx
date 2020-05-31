import React, { useReducer } from "react";
import { NextPage, NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Container,
  Button,
  Box,
  Typography,
  TextField,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

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
      <Container>
        <Box marginBottom={2}>
          {data.post.lines.map((line) => (
            <ExpansionPanel
              key={line.id}
              expanded={line.id === state.focusedId}
              onChange={() => {
                toggleEditor(line.id);
              }}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>
                  {line.partialLines.map((pl) => pl.text).join("")}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <PreviewEditor
                  onChange={onChangeEditor}
                  line={line.partialLines.map((pl) => pl.text).join("")}
                  value={
                    (state.focusedId &&
                      state.comments[state.focusedId]?.text) ||
                    ""
                  }
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
          <Box marginTop={3}>
            <TextField
              fullWidth
              onChange={onOverallCommentChange}
              value={state.overallComment}
              placeholder="Overall comment here!"
            />
          </Box>
          <Box marginTop={2}>
            <Link href="/[username]/[postId]" as={`/${username}/${postId}`}>
              <Button
                disabled={loading || isSubmittingCorrection}
                color="primary"
              >
                Cancel
              </Button>
            </Link>
            <Button
              variant="contained"
              onClick={submitCorrection}
              disabled={loading || isSubmittingCorrection}
              color="primary"
            >
              {loading ? "Posting..." : "Post"}
            </Button>
          </Box>
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
