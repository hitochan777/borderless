import React from "react";
import { NextPage } from "next";
import { Grid, Typography, Box } from "@material-ui/core";

import { useTranslation } from "@/i18n";
import Layout from "@/layout/default";

import { UserSetting } from "@/components/organism/UserSetting";

interface Props {
  username: string;
}

const UserSettingPage: NextPage<Props> = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <Grid container justify="center">
        <Grid item sm={12}>
          <Grid container justify="center">
            <Grid item sm={12}>
              <Typography variant="h3" align="center">
                {t("user-setting")}
              </Typography>
              <Box marginBottom={3} />
            </Grid>
            <Grid item sm={12}>
              <UserSetting />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default UserSettingPage;
