import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

export function CommentForm() {
  return (
    <form>
      <Grid container direction="column">
        <Grid item>
          <TextField
            fullWidth
            multiline
            rows="4"
            defaultValue="Default Value"
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid container>
          <Grid container justify="flex-end">
            <Grid item>
              <Button type="submit" variant="contained">
                Post
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
