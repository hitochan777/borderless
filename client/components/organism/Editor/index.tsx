import React, { useState, useContext, Dispatch } from "react";
import { Editor as SlateEditor, RenderBlockProps } from "slate-react";
import TweetIcon from "@material-ui/icons/ChatBubble";
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";

import {
  useEditorStore,
  State,
  ActionTypes,
  CHANGE_COMMENT_BOX_TARGET,
  CHANGE_CONTENT_STATE
} from "@/components/organism/Editor/useEditorReducer";


const EditorContext = React.createContext<{
  hoveredBlock: string | null;
  setHoveredBlock: (newHoveredBlock: string | null) => void;
  store: {
    state: State;
    dispatch: Dispatch<ActionTypes>;
  };
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
  const { hoveredBlock, setHoveredBlock, store } = useContext(
    EditorContext
  );
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
              onClick={() => {
                store.dispatch({
                  type: CHANGE_COMMENT_BOX_TARGET,
                  payload: { key: props.node.key }
                });
              }}
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
  const store = useEditorStoreContext();

  const onChange = ({ value }: { value: any }) => {
    store.dispatch({type: CHANGE_CONTENT_STATE, payload: value})
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
    <EditorContext.Provider
      value={{ hoveredBlock, setHoveredBlock, store }}
    >
      <SlateEditor
        value={store.state.contentState}
        onChange={onChange}
        placeholder="Start writing something here!"
        renderBlock={renderBlock}
      />
    </EditorContext.Provider>
  );
};
