import * as React from "react";

export const PageHead: React.FC<{ title: string | null }> = ({ title }) => (
  <>
    <title>{title === null ? "" : `${title} - `}lukasbach.com</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
    <link
      href="https://fonts.googleapis.com/css2?family=Barlow:wght@200;300&family=Comfortaa:wght@300;400&family=Exo+2:wght@200;300;400;500&family=Kanit:wght@200&display=swap"
      rel="stylesheet"
    />
  </>
);
