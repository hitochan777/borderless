import React, { useState, useContext } from "react";
import { Editor as SlateEditor, RenderBlockProps } from "slate-react";
import TweetIcon from "@material-ui/icons/ChatBubble";
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";

import {
  useEditorStoreContext,
  CHANGE_CONTENT_STATE
} from "@/components/organism/Editor/useEditorReducer";

const EditorUIContext = React.createContext<{
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
  const { hoveredBlock, setHoveredBlock } = useContext(EditorUIContext);
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
      {
        <StyledOperationMenu contentEditable={false}>
          {shouldShowBubble && (
            <IconButton
              size="small"
              onClick={() => {}}
            >
              <TweetIcon />
            </IconButton>
          )}
        </StyledOperationMenu>
      }
      <div style={{ flex: 1 }}>{props.children}</div>
    </StyledLine>
  );
};

export const Editor: React.StatelessComponent = () => {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const { dispatch, state } = useEditorStoreContext();

  const onChange = ({ value }: { value: any }) => {
    dispatch({ type: CHANGE_CONTENT_STATE, payload: value });
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
    <EditorUIContext.Provider value={{ hoveredBlock, setHoveredBlock }}>
      <SlateEditor
        value={state.contentState}
        onChange={onChange}
        placeholder="Start writing something here!"
        renderBlock={renderBlock}
      />
    </EditorUIContext.Provider>
  );
};
