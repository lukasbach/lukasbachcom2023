import React, { FC } from "react";

export const CategoryText: FC<{ children: string | null | undefined }> = ({ children }) => {
  if (!children) {
    return null;
  }
  switch (children) {
    case "edu":
      return <>Educational</>;
    default:
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <>{children}</>;
  }
};
