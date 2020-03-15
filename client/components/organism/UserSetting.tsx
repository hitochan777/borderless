import React from "react";
import { useFormik } from "formik";
import { Button, TextField } from "@material-ui/core";

import { useUserUpdateSettingMutation } from "@/generated/types";
import { useViewer } from "@/hooks/useViewer";
import { useLanguages } from "@/hooks/useLanguages";
import { MultiSelect } from "@/components/molecule/MultiSelect";
import { assertIsDefined } from "@/lib/assert";

interface FormValues {
  learningLanguages: string[];
  fluentLanguages: string[];
  timezone: string;
}

export const UserSetting: React.FC = () => {
  const [
    updateUserSetting,
    { loading: isUpdating }
  ] = useUserUpdateSettingMutation();
  const { viewer, loading: viewerQueryLoading } = useViewer();
  const { languages, loading: languageQueryLoading } = useLanguages();
  // const { timezones, loading: timezoneLoading } = useTimezones();
  const formik = useFormik<FormValues>({
    initialValues: {
      learningLanguages: viewer?.learningLanguages.map(lang => lang.id) ?? [],
      fluentLanguages: viewer?.fluentLanguages.map(lang => lang.id) ?? [],
      timezone: viewer?.timezone ?? ""
    },
    onSubmit: async values => {
      await updateUserSetting({
        variables: {
          user: {
            fluentLanguages: values.fluentLanguages,
            learningLanguages: values.learningLanguages,
            timezone: values.timezone
          }
        }
      });
    }
  });

  if (viewerQueryLoading || languageQueryLoading) {
    return <div>loading...</div>;
  }

  assertIsDefined(languages);

  return (
    <form onSubmit={formik.handleSubmit}>
      <MultiSelect
        id="fluent-languages"
        value={formik.values.fluentLanguages}
        name="fluentLanguages"
        onChange={formik.handleChange}
        options={languages}
        label="Fluent Languages"
      />
      <MultiSelect
        id="learning-languages"
        name="learningLanguages"
        value={formik.values.learningLanguages}
        onChange={formik.handleChange}
        options={languages}
        label="Learning Languages"
      />
      <TextField
        autoFocus
        margin="dense"
        id="timezone"
        name="timezone"
        label="Timezone"
        type="text"
        value={formik.values.timezone}
        onChange={formik.handleChange}
        fullWidth
      />
      <Button type="submit" color="primary" disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update"}
      </Button>
    </form>
  );
};
