import { useReducer } from "react";

export interface LineState {
  text: string;
  comments: string[];
}

export interface EditorState {
  lines: LineState[];
  newLineIndex: number;
  focusedIndex: number;
}

const initialState: EditorState = {
  lines: [{ text: "", comments: [] }],
  newLineIndex: 0,
  focusedIndex: 0
};

export const SET_FOCUS = "SET_FOCUS";
export const DELETE_LINE = "DELETE_LINE";
export const CHANGE_LINE = "CHANGE_LINE";
export const CREATE_NEW_LINE = "CREATE_NEW_LINE";
export const DELETE_CHARACTER = "DELETE_CHARACTER";

interface SetFocusAction {
  type: typeof SET_FOCUS;
  payload: { index: number };
}

interface DeleteLineAction {
  type: typeof DELETE_LINE;
  payload: { index: number };
}

interface ChangeLineAction {
  type: typeof CHANGE_LINE;
  payload: { newLine: string; index: number };
}

interface CreateNewLineAction {
  type: typeof CREATE_NEW_LINE;
  payload: { index: number };
}

interface DeleteCharacterAction {
  type: typeof DELETE_CHARACTER;
  payload: { index: number };
}

export type ActionTypes =
  | SetFocusAction
  | DeleteLineAction
  | ChangeLineAction
  | CreateNewLineAction
  | DeleteCharacterAction;

const changeLine = (
  currentLines: LineState[],
  index: number,
  newLine: string
) => {
  const newLines = newLine.split("\n");
  if (index > currentLines.length - 1) {
    return [...currentLines];
  }
  return [
    ...currentLines.slice(0, index),
    ...newLines.map(line => ({ text: line, comments: [] })),
    ...currentLines.splice(index + 1)
  ];
};

const deleteLine = (currentLines: LineState[], index: number): LineState[] => {
  return [...currentLines.slice(0, index), ...currentLines.splice(index + 1)];
};

const reducer = (state: EditorState, action: ActionTypes): EditorState => {
  switch (action.type) {
    case DELETE_LINE:
      if (state.lines.length === 1) {
        return {
          ...state,
          lines: changeLine(state.lines, action.payload.index, "")
        };
      } else if (state.lines.length > 1) {
        return {
          ...state,
          lines: deleteLine(state.lines, action.payload.index)
        };
      }
      break;
    case SET_FOCUS:
      return {
        ...state,
        focusedIndex: action.payload.index
      };
    case CHANGE_LINE:
      return {
        ...state,
        lines: changeLine(
          state.lines,
          action.payload.index,
          action.payload.newLine
        )
      };
    case CREATE_NEW_LINE:
      return {
        ...state,
        lines: [
          ...state.lines.slice(0, action.payload.index + 1),
          { text: "", comments: [] },
          ...state.lines.slice(action.payload.index + 1)
        ],
        focusedIndex: state.focusedIndex + 1,
        newLineIndex: state.newLineIndex + 1
      };

    case DELETE_CHARACTER:
      if (state.lines.length === 0) {
        return {
          ...state,
          lines: []
        };
      }
      if (state.lines[action.payload.index].text.length > 0) {
        return state;
      }
      if (state.lines.length === 1 && state.lines[0].text.length === 0) {
        return {
          ...state,
          lines: [{ text: "", comments: [] }]
        };
      }
      return {
        ...state,
        lines: deleteLine(state.lines, action.payload.index),
        focusedIndex: Math.max(action.payload.index - 1, 0),
        newLineIndex: Math.max(action.payload.index - 1, 0)
      };
    default:
      return state;
  }

  return { ...state };
};

export const useEditorStore = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
};
