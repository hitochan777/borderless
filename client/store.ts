import {
  useGetUidQuery,
  useGetLoadingQuery,
  useGetErrorMessageQuery
} from "@/generated/types";

export const useUid = (): string | null | undefined => {
  const { data } = useGetUidQuery();
  if (!data) {
    return null;
  }
  if (!data.uid) {
    // convert undefined and null to null
    return null;
  }
  return data.uid;
};

export const useLoading = (): boolean => {
  const { data } = useGetLoadingQuery();
  if (!data) {
    return false;
  }
  return !!data.loading;
};

export const useErrorMessage = (): string | null | undefined => {
  const { data } = useGetErrorMessageQuery();
  if (!data) {
    return null;
  }
  if (!data.errorMessage) {
    // convert undefined and null to null
    return null;
  }
  return data.errorMessage;
};
