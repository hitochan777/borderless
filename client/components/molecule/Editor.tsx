import React, { useState } from "react";
import { Editor as SlateEditor } from "slate-react";
import { Value } from "slate";

import useCustomKeygen from "@/lib/useCustomKeygen";

const defaultEditorState = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "line",
        nodes: [
          {
            object: "text",
            text: ""
          }
        ]
      }
    ]
  }
});

export const useEditorState = (
  initialState?: Value
): [Value, React.Dispatch<React.SetStateAction<Value>>] => {
  const [editorState, setEditorState] = useState(
    initialState || defaultEditorState
  );
  return [editorState, setEditorState];
};

interface EditorProps {
  slateKey: string;
  editorState: Value;
  setEditorState: React.Dispatch<React.SetStateAction<Value>>;
}

export const Editor: React.StatelessComponent<EditorProps> = ({
  slateKey,
  editorState,
  setEditorState
}) => {
  useCustomKeygen(slateKey);
  const onChange = ({ value }: { value: Value }) => {
    setEditorState(value);
  };

  return (
    <SlateEditor
      value={editorState}
      onChange={onChange}
      placeholder="Start your writing journey here!"
    />
  );
};
