import { useFetchViewerQuery } from "@/generated/types";
import { useUid } from "@/store";

export const useViewer = () => {
  const uid = useUid();
  const { data, error, loading } = useFetchViewerQuery({
    skip: uid === null,
  });
  if (uid === null) {
    return { viewer: null, loading: false };
  }
  // Due to bug in apollo client 3.x `!data` part is added
  // https://github.com/apollographql/apollo-client/issues/6174
  if (loading && !data) {
    return { viewer: null, loading: true };
  }
  if (error) {
    throw error;
  }
  if (!data || !data.viewer) {
    return { viewer: null, loading: false };
  }

  return { viewer: data.viewer, loading };
};
