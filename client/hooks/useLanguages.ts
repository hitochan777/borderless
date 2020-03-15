import { useFetchLanguagesQuery } from "@/generated/types";

export const useLanguages = () => {
  const { data, error, loading } = useFetchLanguagesQuery();
  if (!data) {
    return {
      data: null,
      error,
      loading
    };
  }

  const languages = data.langs.map(({ id, name }) => ({
    value: id,
    name
  }));

  return {
    languages,
    loading,
    error
  };
};
