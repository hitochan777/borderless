import React from "react";

import Select from "../Select";
import { useFetchLanguagesQuery } from "@/generated/types";

interface Props {
  label: string;
  onChange: (value: string) => void;
  value: string;
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
      <Select value={value} onChange={onChange} options={[]} label={label} />
    );
  }
  if (error) {
    throw new Error("Error during fetching languages");
  }
  if (!data) {
    throw new Error("Fetched data is empty");
  }
  const LANGUAGES = data.langs.map(({ id, name }) => ({
    value: id,
    displayString: name
  }));

  return (
    <Select
      value={value}
      onChange={onChange}
      options={LANGUAGES}
      label={label}
    />
  );
};

export default LanguagSelector;
