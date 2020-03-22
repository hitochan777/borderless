import React, { useState, useEffect } from "react";
import {
  Grid,
  Tab,
  TextField,
  Tabs,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import FormatStrikethroughIcon from "@material-ui/icons/FormatStrikethrough";
import { useTranslation } from "@/i18n";

import { PrettyReply } from "@/components/molecule/PrettyReply";

interface Props {
  onChange: (text: string) => void;
  value: string;
  line: string;
}

type TabKey = "write" | "preview";

const parseRawReply = (
  raw: string,
  onFail?: () => void
): { correction?: string; text: string } => {
  const corrections = [...raw.matchAll(/```(.*?)```/gs)];
  if (corrections.length > 1) {
    if (onFail) {
      onFail();
    }
    return { correction: "", text: "" };
  }
  const commentWithoutCorrection = raw.replace(/```(.*?)```/gs, "").trim();

  return {
    correction: corrections[0] && corrections[0][1],
    text: commentWithoutCorrection,
  };
};

export const PreviewEditor: React.FC<Props> = ({ onChange, line, value }) => {
  const { t } = useTranslation("common");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  const [currentTab, setCurrentTab] = useState<TabKey>("write");
  const [parsedReply, setParsedReply] = useState<{
    correction?: string;
    text: string;
  }>({ text: "" });
  useEffect(() => {
    if (currentTab !== "preview") {
      return;
    }
    setParsedReply(
      parseRawReply(value, () => {
        setCurrentTab("write");
        alert("something is wrong with your writing format");
      })
    );
  }, [currentTab]);
  const handleTabChange = (_event: object, value: TabKey) => {
    setCurrentTab(value);
  };

  const insertCorrectionSection = () => {
    const corrections = [...value.matchAll(/```(.*?)```/gs)];
    if (corrections.length >= 1) {
      alert("you can insert at most one correction per comment");
      return;
    }
    const newCommentParts = [value];
    if (value.length > 0) {
      newCommentParts.push("\n");
    }
    newCommentParts.push("```\n" + line + "\n```\n");
    onChange(newCommentParts.join(""));
  };
  return (
    <div>
      <Grid container justify="space-between">
        <div>
          <Tabs
            textColor="secondary"
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="off"
            aria-label="scrollable prevent tabs example"
          >
            <Tab aria-label="write" label="write" value="write" />
            <Tab aria-label="preview" label="preview" value="preview" />
          </Tabs>
        </div>
        <IconButton onClick={insertCorrectionSection}>
          <Tooltip title="Add correction">
            <FormatStrikethroughIcon />
          </Tooltip>
        </IconButton>
      </Grid>
      {currentTab === "write" && (
        <TextField
          fullWidth
          multiline
          rows="4"
          margin="normal"
          variant="outlined"
          placeholder={t("write-comment-here")}
          onChange={handleChange}
          value={value}
        />
      )}
      {currentTab === "preview" && (
        <PrettyReply
          line={line}
          correction={parsedReply.correction}
          reply={parsedReply.text}
        />
      )}
    </div>
  );
};
