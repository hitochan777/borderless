import React, { useMemo, useState } from "react";
import { createEditor, Node, Editor as SlateEditor, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import styled from "styled-components";

const StyledEditor = styled.div`
  border: 1px solid grey;
  padding: 10px;
  border-radius: 5px;
  min-height: 200px;
`;

const defaultValue: Node[] = [
  {
    type: "line",
    children: [
      {
        text: "",
      },
    ],
  },
];

export const useEditorState = (
  initialValue?: Node[]
): {
  value: Node[];
  setValue: React.Dispatch<React.SetStateAction<Node[]>>;
} => {
  const [value, setValue] = useState(initialValue || defaultValue);
  return { value, setValue };
};

interface EditorProps {
  value: Node[];
  setValue: React.Dispatch<React.SetStateAction<Node[]>>;
}

export const Editor: React.FC<EditorProps> = ({ value, setValue }) => {
  const onChange = (newValue: Node[]) => {
    setValue(newValue);
  };
  const editor = useMemo(() => withReact(withHistory(createEditor())), []);
  const onEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    SlateEditor.insertBreak(editor);
    const [match] = SlateEditor.nodes(editor, {
      match: (node) => node.type === "line",
    });
    if (match) {
      const path = match[1];
      Transforms.setNodes(editor, { id: undefined }, { at: path });
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "Enter":
        return onEnter(event);
    }
  };

  return (
    <StyledEditor>
      <Slate
        key={"slate-key"}
        editor={editor}
        value={value}
        onChange={onChange}
      >
        <Editable onKeyDown={onKeyDown} />
      </Slate>
    </StyledEditor>
  );
};
