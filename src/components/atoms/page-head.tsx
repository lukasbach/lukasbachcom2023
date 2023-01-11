import * as React from "react";
import { useEffect, useRef } from "react";
import { graphql, useStaticQuery } from "gatsby";

const useCounterKey = () =>
  useStaticQuery<Queries.CounterDataQuery>(graphql`
    query CounterData {
      site {
        siteMetadata {
          counterKey
        }
      }
    }
  `).site.siteMetadata.counterKey;
export const PageHead: React.FC<{ title: string | null }> = ({ title }) => {
  const counterKey = useCounterKey();
  const hasCounted = useRef(false);
  useEffect(() => {
    if (hasCounted.current) {
      return;
    }
    if (process.env.GATSBY_ENV === "development") {
      return;
    }
    try {
      const visits: string[] = JSON.parse(localStorage.getItem("v") ?? "[]") ?? [];
      const location = window.location.pathname.slice(1, -1).replaceAll("/", "_");
      const now = new Date();
      const date = `d${now.getFullYear()}-${now.getMonth()}`;
      const newVisits = ["visit", location, `visit__${date}`, `${location}__${date}`];
      const sendVisits = newVisits.filter(v => !visits.includes(v));
      localStorage.setItem("v", JSON.stringify([...visits, ...sendVisits]));
      sendVisits.forEach(v => fetch(`https://api.countapi.xyz/hit/${counterKey}/${v}`));
      fetch(`https://api.countapi.xyz/hit/${counterKey}/hit`);
    } catch (e) {
      console.error(e);
    }
    hasCounted.current = true;
  }, [counterKey]);
  return (
    <>
      <title>{title === null ? "" : `${title} - `}lukasbach.com</title>
      <link rel="preconnect" href="https://fonts.lukasbach.com" crossOrigin="true" />
      <link href="https://fonts.lukasbach.com/homepage2023.css" rel="stylesheet" />
    </>
  );
};
