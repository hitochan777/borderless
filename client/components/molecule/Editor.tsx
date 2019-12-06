import React, { useMemo, useState } from "react";
import { createEditor, Node, Range, Editor as SlateEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

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

const defaultSelection = null;

export const useEditorState = (
  initialValue?: Node[],
  initialSelection?: Range | null
): {
  value: Node[];
  setValue: React.Dispatch<React.SetStateAction<Node[]>>;
  selection: Range | null;
  setSelection: React.Dispatch<React.SetStateAction<Range | null>>;
} => {
  const [value, setValue] = useState(initialValue || defaultValue);
  const [selection, setSelection] = useState(
    initialSelection || defaultSelection
  );
  return { value, setValue, selection, setSelection };
};

interface EditorProps {
  value: Node[];
  setValue: React.Dispatch<React.SetStateAction<Node[]>>;
  selection: Range | null;
  setSelection: React.Dispatch<React.SetStateAction<Range | null>>;
}

export const Editor: React.FC<EditorProps> = ({
  value,
  setValue,
  selection,
  setSelection
}) => {
  const onChange = (newValue: Node[], newSelection: Range | null) => {
    setValue(newValue);
    setSelection(newSelection);
  };
  const editor = useMemo(() => withReact(createEditor()), []);
  const onEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    editor.exec({ type: "insert_break" });
    const [match] = SlateEditor.nodes(editor, { match: { type: "line" } });
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
    <Slate
      key={"slate-key"}
      editor={editor}
      value={value}
      selection={selection}
      onChange={onChange}
    >
      <Editable
        onKeyDown={onKeyDown}
        placeholder={"Start your writing journey here!"}
      />
    </Slate>
  );
};
