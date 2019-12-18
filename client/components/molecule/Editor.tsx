import React, { useMemo, useState } from "react";
import { createEditor, Node, Editor as SlateEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";

const defaultValue: Node[] = [
  {
    type: "line",
    children: [
      {
        text: ""
      }
    ]
  }
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
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const onEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    editor.exec({ type: "insert_break" });
    const [match] = SlateEditor.nodes(editor, {
      match: node => node.type === "line"
    });
    if (match) {
      const path = match[1];
      SlateEditor.setNodes(editor, { id: undefined }, { at: path });
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "Enter":
        return onEnter(event);
    }
  };

  return (
    <Slate key={"slate-key"} editor={editor} value={value} onChange={onChange}>
      <Editable
        onKeyDown={onKeyDown}
        placeholder={"Start your writing journey here!"}
      />
    </Slate>
  );
};
