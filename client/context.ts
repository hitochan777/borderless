import React from "react";

export const UidContext = React.createContext<{
  uid: string | null;
  setUid: (uid: string | null) => void;
}>(null as any);
