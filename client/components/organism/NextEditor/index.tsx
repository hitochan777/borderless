import React, { useState, useContext } from "react";
import { Editor, RenderBlockProps } from "slate-react";
import { Value } from "slate";
import TweetIcon from "@material-ui/icons/ChatBubble";
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "line",
        nodes: []
      }
    ]
  }
});

const EditorContext = React.createContext<{
  hoveredBlock: string | null;
  setHoveredBlock: (newHoveredBlock: string | null) => void;
}>(null as any);

const StyledLine = styled.div`
  display: flex;
  line-height: 2rem;
  height: 2rem;
  border: 0;
`;

const StyledOperationMenu = styled.div`
  flex-basis: 30px;
`;

const LineBlock: React.FC<RenderBlockProps> = props => {
  const { hoveredBlock, setHoveredBlock } = useContext(EditorContext);
  const shouldShowBubble = hoveredBlock && hoveredBlock === props.node.key;
  const onMouseEnter = () => {
    setHoveredBlock(props.node.key);
  };
  const onMouseLeave = () => {
    setHoveredBlock(null);
  };
  return (
    <StyledLine
      {...props.attributes}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <StyledOperationMenu>
        {shouldShowBubble && (
          <IconButton
            size="small"
            onClick={() => {
              //   dispatch({
              //     type: TOGGLE_COMMENT,
              //     payload: { index }
              //   });
            }}
          >
            <TweetIcon />
          </IconButton>
        )}
      </StyledOperationMenu>
      <div style={{ flex: 1 }}>{props.children}</div>
    </StyledLine>
  );
};

export const NextEditor: React.StatelessComponent = () => {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [editorState, setEditorState] = useState(initialValue);

  const onChange = ({ value }: { value: typeof initialValue }) => {
    setEditorState(value);
  };

  const renderBlock = (
    props: RenderBlockProps,
    _: any,
    next: () => React.ReactNode
  ) => {
    switch (props.node.type) {
      case "line":
        return <LineBlock {...props} />;
      default:
        return next();
    }
  };

  return (
    <EditorContext.Provider value={{ hoveredBlock, setHoveredBlock }}>
      <pre>{JSON.stringify(editorState, null, 2)}</pre>
      <Editor
        value={editorState}
        onChange={onChange}
        placeholder="Start writing something here!"
        renderBlock={renderBlock}
      />
    </EditorContext.Provider>
  );
};
