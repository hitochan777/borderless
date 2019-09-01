import React, { useState, useRef } from "react";
import ContentEditable from "react-contenteditable";
import styled from "styled-components";
import DeleteIcon from "@material-ui/icons/Delete";
import TweetIcon from "@material-ui/icons/ChatBubble";
import IconButton from "@material-ui/core/IconButton";

const StyledOperationMenu = styled.div`
  flex-basis: 70px;
`;

const StyledContentEditable = styled(ContentEditable)`
  &:empty:before {
    content: attr(placeholder);
    display: block;
    color: #aaa;
  }
  flex: 1;
  &:focus {
    outline: 0px solid transparent;
  }
`;

const StyledPostForm = styled.div`
  display: flex;
  line-height: 2rem;
  height: 2rem;
  border: 0;
`;

const changeLine = (currentLines: string[], index: number, newLine: string) => {
  const newLines = newLine.split("\n");
  if (index > currentLines.length - 1) {
    return [...currentLines];
  }
  return [
    ...currentLines.slice(0, index),
    ...newLines,
    ...currentLines.splice(index + 1)
  ];
};

const deleteLine = (currentLines: string[], index: number): string[] => {
  return [...currentLines.slice(0, index), ...currentLines.splice(index + 1)];
};

const pasteAsPlainText = (event: React.ClipboardEvent<HTMLDivElement>) => {
  event.preventDefault();
  const text = event.clipboardData.getData("text/plain");
  document.execCommand("insertHTML", false, text);
};

interface Props {
  lines: string[];
  setLines: React.Dispatch<React.SetStateAction<string[]>>;
}

export const PostForm: React.StatelessComponent<Props> = ({
  lines,
  setLines
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const lineRefs = useRef<HTMLDivElement[]>([]);
  const [newLineIndex, setNewLineIndex] = useState<number>(0);

  React.useEffect(() => {
    lineRefs.current = lineRefs.current.slice(0, lines.length);
  }, [lines]);

  React.useEffect(() => {
    const lineRef = lineRefs.current[newLineIndex];
    if (lineRef) {
      lineRef.focus();
    }
  }, [newLineIndex]);

  const handleMouseHover = (index: number) => {
    setFocusedIndex(index);
  };

  return (
    <>
      <div>{JSON.stringify(lines, null, 2)}</div>
      <div>{JSON.stringify(newLineIndex, null, 2)}</div>
      {lines.map((line, index) => (
        <StyledPostForm key={index}>
          <StyledOperationMenu>
            {focusedIndex === index && (
              <>
                <IconButton
                  size="small"
                  onClick={() => {
                    if (lines.length === 1) {
                      setLines(changeLine(lines, index, ""));
                    } else if (lines.length > 1) {
                      setLines(lines => deleteLine(lines, index));
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton size="small">
                  <TweetIcon />
                </IconButton>
              </>
            )}
          </StyledOperationMenu>
          <StyledContentEditable
            innerRef={(el: HTMLDivElement) =>
              ((lineRefs.current as any)[index] = el)
            }
            html={line}
            onChange={event => {
              setLines(changeLine(lines, index, event.target.value));
            }}
            onKeyDown={event => {
              switch (event.key) {
                case "Enter":
                  event.preventDefault();
                  setLines(lines => [
                    ...lines.slice(0, index + 1),
                    "",
                    ...lines.slice(index + 1)
                  ]);
                  setFocusedIndex(index => index + 1);
                  setNewLineIndex(index => index + 1);
                  break;
                case "Backspace":
                  if (lines.length === 0) {
                    return setLines([]);
                  }
                  if (lines[index].length > 0) {
                    return setLines([...lines]);
                  }
                  if (lines.length === 1 && lines[0].length === 0) {
                    return setLines([""]);
                  }
                  setLines(lines => deleteLine(lines, index));
                  setFocusedIndex(index => Math.max(index - 1, 0));
                  setNewLineIndex(index => Math.max(index - 1, 0));
                  break;
                default:
                  break;
              }
            }}
            onPaste={pasteAsPlainText}
            onMouseOver={() => {
              handleMouseHover(index);
            }}
            placeholder="Type something here"
          />
        </StyledPostForm>
      ))}
    </>
  );
};
