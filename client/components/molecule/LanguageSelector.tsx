import React from "react";
import { useQuery } from "@apollo/react-hooks";

import Select from "../Select";
import Loading from "../Loading";
import { FETCH_LANGUAGES_QUERY } from "@/constant/graphql";
import { FetchLanguagesQuery } from "@/generated/types";

interface Props {
  label: string;
  onChange: (value: string) => void;
  value: string;
}

const LanguagSelector: React.FunctionComponent<Props> = ({
  label,
  value,
  onChange
}) => {
  const { data, error, loading } = useQuery<FetchLanguagesQuery>(
    FETCH_LANGUAGES_QUERY
  );
  if (loading) {
    return <Loading />;
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
