import React, { useContext, useReducer, Dispatch } from "react";
import { Value } from "slate";

type LineKey = string | null;

export interface State {
  commentBoxFor: LineKey;
  lines: {
    [key: string]: {
      comment: string;
    };
  };
  contentState: Value;
}

const defaultState: State = {
  commentBoxFor: null,
  lines: {},
  contentState: Value.fromJSON({
    document: {
      nodes: [
        {
          object: "block",
          type: "line",
          nodes: []
        }
      ]
    }
  })
};

function setCommentText(state: State, key: string, text: string): State {
  return {
    ...state,
    lines: {
      ...state.lines,
      [key]: {
        comment: text
      }
    }
  };
}

function setCommentBoxFor(state: State, key: LineKey): State {
  const newTarget = key === state.commentBoxFor ? null : key;
  return {
    ...state,
    commentBoxFor: newTarget
  };
}

function setContentState(state: State, newContentState: any): State {
  return {
    ...state,
    contentState: newContentState
  };
}

export const CHANGE_COMMENT_BOX_TARGET = "CHANGE_COMMENT_BOX_TARGET";
export const CHANGE_COMMENT = "CHANGE_COMMENT";
export const CHANGE_CONTENT_STATE = "CHANGE_CONTENT_STATE";

interface ChangeCommentAction {
  type: typeof CHANGE_COMMENT;
  payload: { text: string; key: string };
}

interface ChangeCommentBoxForTarget {
  type: typeof CHANGE_COMMENT_BOX_TARGET;
  payload: { key: LineKey };
}

interface ChangeContentState {
  type: typeof CHANGE_CONTENT_STATE;
  payload: any;
}

export type ActionTypes =
  | ChangeCommentAction
  | ChangeCommentBoxForTarget
  | ChangeContentState;

const reducer = (state: State, action: ActionTypes): State => {
  switch (action.type) {
    case CHANGE_COMMENT:
      return setCommentText(state, action.payload.key, action.payload.text);
    case CHANGE_COMMENT_BOX_TARGET:
      return setCommentBoxFor(state, action.payload.key);
    case CHANGE_CONTENT_STATE:
      return setContentState(state, action.payload);
    default:
      return state;
  }

  return state;
};

export type EditorStore = 
{state: State, dispatch: Dispatch<ActionTypes>}

export const useEditorStore = (initialState?: State): EditorStore => {
  const [state, dispatch] = useReducer(reducer, initialState || defaultState);
  return { state, dispatch };
};

export const EditorStoreContext = React.createContext<EditorStore>(null as any)

export const useEditorStoreContext = () => {
  return useContext(EditorStoreContext)
}
