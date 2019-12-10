import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

interface Props {
  onSubmit: () => void;
  onChange: (text: string) => void;
  disabled: boolean;
  value: string;
}

export const CommentForm: React.FC<Props> = ({
  onSubmit,
  disabled,
  onChange,
  value
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  return (
    <form>
      <Grid container direction="column">
        <Grid item>
          <TextField
            fullWidth
            multiline
            rows="4"
            margin="normal"
            variant="outlined"
            placeholder="Write your comment here!"
            onChange={handleChange}
            value={value}
          />
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
                Post
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
