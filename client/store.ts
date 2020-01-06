import { useContext } from "react";
import { useGetLoadingQuery, useGetErrorMessageQuery } from "@/generated/types";

import { UidContext } from "@/context";

export const useUid = (): string | null | undefined => {
  const { uid } = useContext(UidContext);
  return uid;
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
