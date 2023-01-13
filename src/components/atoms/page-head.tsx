import * as React from "react";
import { useEffect, useRef } from "react";
import { graphql, useStaticQuery } from "gatsby";

const useHeadData = () =>
  useStaticQuery<Queries.HeadDataQuery>(graphql`
    query HeadData {
      site {
        siteMetadata {
          counterKey
          twitterUser
          title
          description
          shortDescription
          siteUrl
          mail
          links {
            twitter
          }
        }
      }
    }
  `).site?.siteMetadata;

const useCounter = (counterKey: string) => {
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
};

export const PageHead: React.FC<{ title: string | null; description?: string | null }> = ({ title, description }) => {
  const data = useHeadData();
  useCounter(data?.counterKey ?? "lukasbachcom23");
  const pageTitle = `${title === null ? "" : `${title} - `}lukasbach.com`;
  const descr = description ?? data?.description ?? "";
  const image = "/icon.png";
  return (
    <>
      <title>{pageTitle}</title>
      <link rel="preconnect" href="https://fonts.lukasbach.com" crossOrigin="true" />
      <link href="https://fonts.lukasbach.com/homepage2023.css" rel="stylesheet" />
      <meta name="description" content={descr} />
      <meta name="image" content={image} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title ?? data?.title ?? ""} />
      <meta name="twitter:url" content={data?.links?.twitter ?? ""} />
      <meta name="twitter:description" content={descr} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content={data?.twitterUser ?? ""} />
      <meta name="twitter:site" content={data?.twitterUser ?? ""} />
      <meta property="og:url" content={window.location.pathname} />
      <meta property="og:title" content={title ?? data?.title ?? ""} />
      <meta property="og:type" content="website" />
      {/* TODO https://ogp.me/#no_vertical */}
      <meta property="og:description" content={descr} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={data?.title ?? ""} />
      <meta property="og:locale" content="en_US" />
    </>
  );
};
