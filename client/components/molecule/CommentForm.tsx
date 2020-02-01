import React, { useState } from "react";
import {
  Button,
  Grid,
  Tab,
  TextField,
  Tabs,
  IconButton,
  Tooltip
} from "@material-ui/core";
import FormatStrikethroughIcon from "@material-ui/icons/FormatStrikethrough";
import { useTranslation } from "@/i18n";

interface Props {
  onSubmit: () => void;
  onChange: (text: string) => void;
  disabled: boolean;
  value: string;
  line: string;
}

type TabKey = "write" | "preview";

export const CommentForm: React.FC<Props> = ({
  onSubmit,
  disabled,
  onChange,
  line,
  value
}) => {
  const [currentTab, setCurrentTab] = useState<TabKey>("write");
  const { t } = useTranslation("common");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

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
    <form>
      <Grid container direction="column">
        <Grid item>
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
            <span> Preview is yet to be implemented!</span>
          )}
        </Grid>
        <Grid container>
          <Grid container justify="flex-end">
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                onClick={onSubmit}
                disabled={disabled}
              >
                {t("post")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
