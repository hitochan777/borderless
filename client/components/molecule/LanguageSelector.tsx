import React from "react";

import Select from "../Select";
import { useFetchLanguagesQuery } from "@/generated/types";

interface LanguageOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  onChange: (value: LanguageOption | null) => void;
  value: LanguageOption | null;
  relatedOnly?: boolean;
}

const LanguagSelector: React.FC<Props> = ({
  label,
  value,
  onChange,
  relatedOnly = false
}) => {
  const { data, error, loading } = useFetchLanguagesQuery({
    variables: { relatedOnly }
  });
  if (loading) {
    return (
      <Select<string>
        value={value}
        onChange={onChange}
        options={[]}
        label={label}
      />
    );
  }
  if (error) {
    throw new Error("Error during fetching languages");
  }
  if (!data) {
    throw new Error("Fetched data is empty");
  }
  const languageOptions: LanguageOption[] = data.langs.map(({ id, name }) => ({
    value: id,
    label: name
  }));

  return (
    <Select
      value={value}
      onChange={onChange}
      options={languageOptions}
      label={label}
    />
  );
};

export default LanguagSelector;
