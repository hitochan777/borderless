import React from "react";
import { Button, Grid } from "@material-ui/core";

import { useTranslation } from "@/i18n";
import { PreviewEditor } from "./PreviewEditor";

interface Props {
  onSubmit: () => void;
  onChange: (text: string) => void;
  disabled: boolean;
  value: string;
  line: string;
}

export const CommentForm: React.FC<Props> = ({
  onSubmit,
  disabled,
  onChange,
  line,
  value
}) => {
  const { t } = useTranslation("common");

  return (
    <form>
      <Grid container direction="column">
        <Grid item>
          <PreviewEditor onChange={onChange} line={line} value={value} />
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
