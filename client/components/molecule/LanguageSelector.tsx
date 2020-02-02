import React from "react";

import Select from "../Select";
import { useFetchLanguagesQuery } from "@/generated/types";

interface LanguageOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  onChange: (value: string | null) => void;
  value: string | null;
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

  const handleChange = (value: LanguageOption | null) => {
    if (value) {
      onChange(value.value);
    }
  };
  if (loading) {
    return (
      <Select<string>
        value={null}
        onChange={handleChange}
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
  const filtered = languageOptions.filter(option => option.value === value);
  return (
    <Select
      value={filtered[0]}
      onChange={handleChange}
      options={languageOptions}
      label={label}
    />
  );
};

export default LanguagSelector;
