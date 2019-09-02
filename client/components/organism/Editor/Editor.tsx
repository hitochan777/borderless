import React, { useRef } from "react";
import ContentEditable from "react-contenteditable";
import styled from "styled-components";
import DeleteIcon from "@material-ui/icons/Delete";
import TweetIcon from "@material-ui/icons/ChatBubble";
import IconButton from "@material-ui/core/IconButton";

import {
  EditorState,
  SET_FOCUS,
  DELETE_LINE,
  CHANGE_LINE,
  CREATE_NEW_LINE,
  DELETE_CHARACTER
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

const StyledPostForm = styled.div`
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
    <>
      <div>{JSON.stringify(lines, null, 2)}</div>
      <div>{JSON.stringify(newLineIndex, null, 2)}</div>
      {lines.map((line, index) => (
        <StyledPostForm key={index}>
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
                <IconButton size="small">
                  <TweetIcon />
                </IconButton>
              </>
            )}
          </StyledOperationMenu>
          <StyledContentEditable
            innerRef={(el: HTMLDivElement) =>
              ((lineRefs.current as any)[index] = el)
            }
            html={line}
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
            onMouseOver={() => {
              dispatch({ type: SET_FOCUS, payload: { index } });
            }}
            placeholder="Type something here"
          />
        </StyledPostForm>
      ))}
    </>
  );
};
