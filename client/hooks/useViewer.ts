import { useQuery } from "@apollo/react-hooks";

import { FETCH_VIEWER_QUERY } from "@/constant/graphql";
import { FetchViewerQuery } from "@/generated/types";

export const useViewer = () => {
  const { data, error, loading } = useQuery<FetchViewerQuery>(
    FETCH_VIEWER_QUERY
  );
  if (loading) {
    return { data: null, loading: true };
  }
  if (error) {
    throw error;
  }
  if (!data || !data.viewer) {
    throw new Error("data is empty");
  }

  return { viewer: data.viewer, loading };
};
