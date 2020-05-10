import { useFetchLanguagesQuery } from "@/generated/types";

export const useLanguages = (relatedOnly = true) => {
  const { data, error, loading } = useFetchLanguagesQuery({
    variables: { relatedOnly },
  });
  if (!data) {
    return {
      data: null,
      error,
      loading,
    };
  }

  const languages = data.langs.map(({ id, name }) => ({
    value: id,
    name,
  }));

  return {
    languages,
    loading,
    error,
  };
};
