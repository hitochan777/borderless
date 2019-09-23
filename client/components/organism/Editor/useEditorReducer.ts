import { useReducer } from "react";
import { Record, List } from "immutable";

export interface CommentState {
  text: string;
  isOpen: boolean;
}

const defaultComment: CommentState = {
  text: "",
  isOpen: false
};

export const CommentFactory = Record(defaultComment);

export interface LineState {
  text: string;
  comment: Record<CommentState>;
}

const defaultLine = { text: "", comment: CommentFactory() };

export const LineFactory = Record(defaultLine);

interface EditorStateRecordType {
  lines: List<Record<LineState>>;
  newLineIndex: number;
  focusedIndex: number;
}

const defaultRecord: EditorStateRecordType = {
  lines: List.of(LineFactory()),
  newLineIndex: 0,
  focusedIndex: 0
};

const EditorStateFactory = Record(defaultRecord);

export class EditorState {
  private _immutable: Record<EditorStateRecordType>;

  constructor(immutable: Record<EditorStateRecordType>) {
    this._immutable = immutable;
  }

  static create(config: Partial<EditorStateRecordType> = {}) {
    return new EditorState(EditorStateFactory(config));
  }

  private getImmutable() {
    return this._immutable;
  }

  getLine(index: number): Record<LineState> {
    const maybeLine = this.getImmutable()
      .get("lines")
      .get(index);
    if (!maybeLine) {
      throw new Error("IndexError");
    }
    return maybeLine;
  }

  toJS() {
    return this.getImmutable().toJS();
  }

  static changeLineText(
    editorState: EditorState,
    index: number,
    newLine: string
  ): EditorState {
    const newLines = newLine.split("\n");
    if (index > editorState.getLineCount() - 1) {
      return editorState;
    }
    const lines = editorState.getLines();
    return EditorState.set(editorState, {
      lines: lines.splice(
        index,
        1,
        ...newLines.map(line => LineFactory({ text: line }))
      )
    });
  }
  static changeLine(
    editorState: EditorState,
    index: number,
    line: Record<LineState>
  ): EditorState {
    const lines = editorState.getLines();
    return EditorState.set(editorState, {
      lines: lines.splice(index, 1, line)
    });
  }

  static insertNewLine(editorState: EditorState, index: number): EditorState {
    const newLines = editorState.getLines().insert(index + 1, LineFactory());
    const newFocusedIndex = editorState.getFocusedIndex() + 1;
    const newNewLineIndex = editorState.getNewLineIndex() + 1;
    return EditorState.set(editorState, {
      lines: newLines,
      focusedIndex: newFocusedIndex,
      newLineIndex: newNewLineIndex
    });
  }

  static changeCommentText(
    editorState: EditorState,
    index: number,
    text: string
  ): EditorState {
    const newComment = editorState
      .getLine(index)
      .get("comment")
      .set("text", text);
    return EditorState.changeComment(editorState, index, newComment);
  }

  static changeComment(
    editorState: EditorState,
    index: number,
    comment: Record<CommentState>
  ): EditorState {
    const newLine = editorState.getLine(index).set("comment", comment);
    return EditorState.changeLine(editorState, index, newLine);
  }

  static toggleCommentIsOpen(
    editorState: EditorState,
    index: number
  ): EditorState {
    if (index < 0 || index >= editorState.getLineCount()) {
      return editorState;
    }
    const comment = editorState.getLine(index).get("comment");
    return EditorState.changeComment(
      editorState,
      index,
      comment.set("isOpen", !comment.get("isOpen"))
    );
  }

  static deleteLine(editorState: EditorState, index: number): EditorState {
    const newLines = editorState.getLines().remove(index);
    return EditorState.set(editorState, { lines: newLines });
  }

  static deleteCharacter(editorState: EditorState, index: number): EditorState {
    if (editorState.getLineCount() === 0) {
      return EditorState.set(editorState, { lines: List() });
    }
    if (editorState.getLine(index).get("text").length > 0) {
      return editorState;
    }
    if (
      editorState.getLineCount() === 1 &&
      editorState.getLine(0).get("text").length === 0
    ) {
      return EditorState.set(editorState, { lines: List.of(LineFactory()) });
    }
    return EditorState.set(editorState, {
      lines: EditorState.deleteLine(editorState, index).getLines(),
      focusedIndex: Math.max(index - 1, 0),
      newLineIndex: Math.max(index - 1, 0)
    });
  }

  static setFocusedIndex(editorState: EditorState, index: number): EditorState {
    return EditorState.set(editorState, { focusedIndex: index });
  }

  static set(
    editorState: EditorState,
    update: Partial<EditorStateRecordType>
  ): EditorState {
    return new EditorState(editorState.getImmutable().merge(update));
  }

  getLines() {
    return this.getImmutable().get("lines");
  }

  getFocusedIndex(): number {
    return this.getImmutable().get("focusedIndex");
  }

  getNewLineIndex(): number {
    return this.getImmutable().get("newLineIndex");
  }

  getLineCount() {
    return this.getLines().size;
  }

  getPostable() {
    return this.getLines()
      .map(line => ({
        text: line.get("text"),
        comment: line.get("comment").get("text")
      }))
      .toArray();
  }

  get lines() {
    return this.getLines();
  }

  get focusedIndex() {
    return this.getFocusedIndex();
  }
  get newLineIndex() {
    return this.getNewLineIndex();
  }
}

export const SET_FOCUS = "SET_FOCUS";
export const DELETE_LINE = "DELETE_LINE";
export const CHANGE_LINE = "CHANGE_LINE";
export const CREATE_NEW_LINE = "CREATE_NEW_LINE";
export const DELETE_CHARACTER = "DELETE_CHARACTER";
export const TOGGLE_COMMENT = "TOGGLE_COMMENT";
export const CHANGE_COMMENT = "CHANGE_COMMENT";
export const INITIALIZE_STATE = "INITIALIZE_STATE";

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

interface ToggleCommentAction {
  type: typeof TOGGLE_COMMENT;
  payload: { index: number };
}

interface ChangeCommentAction {
  type: typeof CHANGE_COMMENT;
  payload: { text: string; index: number };
}

interface InitializeStateAction {
  type: typeof INITIALIZE_STATE;
  payload: Partial<EditorStateRecordType>;
}

export type ActionTypes =
  | SetFocusAction
  | DeleteLineAction
  | ChangeLineAction
  | CreateNewLineAction
  | DeleteCharacterAction
  | ToggleCommentAction
  | ChangeCommentAction
  | InitializeStateAction;

const reducer = (state: EditorState, action: ActionTypes): EditorState => {
  switch (action.type) {
    case DELETE_LINE:
      if (state.getLineCount() === 1) {
        return EditorState.changeLineText(state, action.payload.index, "");
      } else if (state.getLineCount() > 1) {
        return EditorState.deleteLine(state, action.payload.index);
      }
      break;
    case SET_FOCUS:
      return EditorState.setFocusedIndex(state, action.payload.index);
    case CHANGE_LINE:
      return EditorState.changeLineText(
        state,
        action.payload.index,
        action.payload.newLine
      );
    case CREATE_NEW_LINE:
      return EditorState.insertNewLine(state, action.payload.index);
    case DELETE_CHARACTER:
      return EditorState.deleteCharacter(state, action.payload.index);
    case TOGGLE_COMMENT:
      return EditorState.toggleCommentIsOpen(state, action.payload.index);
    case CHANGE_COMMENT:
      return EditorState.changeCommentText(
        state,
        action.payload.index,
        action.payload.text
      );
    case INITIALIZE_STATE:
      return EditorState.create(action.payload);

    default:
      return state;
  }

  return state;
};

export const useEditorStore = () => {
  const [state, dispatch] = useReducer(reducer, EditorState.create());
  const setState = (initialState: Partial<EditorStateRecordType>) => {
    dispatch({ type: INITIALIZE_STATE, payload: initialState });
  };
  return { state, dispatch, setState };
};
