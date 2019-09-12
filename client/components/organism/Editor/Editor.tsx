import React, { useRef } from "react";
import styled from "styled-components";
import DeleteIcon from "@material-ui/icons/Delete";
import TweetIcon from "@material-ui/icons/ChatBubble";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import ContentEditable from "react-contenteditable";

import {
  EditorState,
  SET_FOCUS,
  DELETE_LINE,
  CHANGE_LINE,
  CREATE_NEW_LINE,
  DELETE_CHARACTER,
  TOGGLE_COMMENT,
  CHANGE_COMMENT
} from "./useEditorReducer";

const StyledOperationMenu = styled.div`
  flex-basis: 70px;
`;

const StyledContentEditable = styled(ContentEditable)`
  &:empty:before {
    content: attr(placeholder);
    display: block;
    color: #aaa;
  }
  flex: 1;
  &:focus {
    outline: 0px solid transparent;
  }
`;

const StyledLine = styled.div`
  display: flex;
  line-height: 2rem;
  height: 2rem;
  border: 0;
`;

const pasteAsPlainText = (event: React.ClipboardEvent<HTMLDivElement>) => {
  event.preventDefault();
  const text = event.clipboardData.getData("text/plain");
  document.execCommand("insertHTML", false, text);
};

interface EditorStore {
  state: EditorState;
  dispatch: any;
}

interface Props {
  store: EditorStore;
}

export const Editor: React.StatelessComponent<Props> = ({ store }) => {
  const lineRefs = useRef<HTMLDivElement[]>([]);
  const { lines, newLineIndex, focusedIndex } = store.state;
  const { dispatch } = store;

  React.useEffect(() => {
    lineRefs.current = lineRefs.current.slice(0, lines.length);
  }, [lines]);

  React.useEffect(() => {
    const lineRef = lineRefs.current[newLineIndex];
    if (lineRef) {
      lineRef.focus();
    }
  }, [newLineIndex]);

  return (
    <Container maxWidth="sm">
      {lines.map((line, index) => (
        <div key={index}>
          <Grid container spacing={3}>
            <Grid item sm={12}>
              <StyledLine
                onMouseOver={() => {
                  dispatch({ type: SET_FOCUS, payload: { index } });
                }}
              >
                <StyledOperationMenu>
                  {focusedIndex === index && (
                    <>
                      <IconButton
                        size="small"
                        onClick={() => {
                          dispatch({ type: DELETE_LINE, payload: { index } });
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          dispatch({
                            type: TOGGLE_COMMENT,
                            payload: { index }
                          });
                        }}
                      >
                        <TweetIcon />
                      </IconButton>
                    </>
                  )}
                </StyledOperationMenu>
                <StyledContentEditable
                  innerRef={(el: HTMLDivElement) => {
                    (lineRefs.current as any)[index] = el;
                  }}
                  html={line.text}
                  onChange={event => {
                    dispatch({
                      type: CHANGE_LINE,
                      payload: { newLine: event.target.value, index }
                    });
                  }}
                  onKeyPress={event => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      dispatch({ type: CREATE_NEW_LINE, payload: { index } });
                    }
                  }}
                  onKeyDown={event => {
                    if (event.key === "Backspace") {
                      dispatch({ type: DELETE_CHARACTER, payload: { index } });
                    }
                  }}
                  onPaste={pasteAsPlainText}
                  placeholder="Type something here"
                />
              </StyledLine>
            </Grid>
            {line.comment.isOpen && (
              <Grid item sm={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  multiline
                  rowsMax="4"
                  value={line.comment.text}
                  onChange={event => {
                    dispatch({
                      type: CHANGE_COMMENT,
                      payload: { text: event.target.value, index }
                    });
                  }}
                ></TextField>
              </Grid>
            )}
          </Grid>
        </div>
      ))}
    </Container>
  );
};
