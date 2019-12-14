import { useQuery } from "@apollo/react-hooks";

import { FETCH_VIEWER_QUERY } from "@/constant/graphql";
import { FetchViewerQuery } from "@/generated/types";
import { useStateValue } from "@/store";

export const useViewer = () => {
  const { state } = useStateValue();
  const { data, error, loading } = useQuery<FetchViewerQuery>(
    FETCH_VIEWER_QUERY,
    {
      skip: state.user === null
    }
  );
  if (state.user === null) {
    return { viewer: null, loading: false };
  }
  if (loading) {
    return { data: null, loading: true };
  }
  if (error) {
    throw error;
  }
  if (!data || !data.viewer) {
    return { viewer: null, loading: false };
    // throw new Error("data is empty");
  }

  return { viewer: data.viewer, loading };
};
