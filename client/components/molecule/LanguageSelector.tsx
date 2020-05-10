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
  placeholder?: string;
}

const LanguagSelector: React.FC<Props> = ({
  label,
  value,
  onChange,
  relatedOnly = false,
  placeholder,
}) => {
  const { data, error, loading } = useFetchLanguagesQuery({
    variables: { relatedOnly },
  });

  const handleChange = (value: string | null) => {
    if (value) {
      onChange(value);
    }
  };
  if (loading) {
    return (
      <Select value={null} onChange={handleChange} options={[]} label={label} />
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
    label: name,
  }));
  return (
    <Select
      value={value}
      onChange={handleChange}
      options={languageOptions}
      label={label}
      placeholder={placeholder}
    />
  );
};

export default LanguagSelector;
