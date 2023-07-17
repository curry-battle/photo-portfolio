/** @jsxImportSource @emotion/react */
import Head from "next/head";
import HeaderNav from "./HeaderNav";
import { css } from "@emotion/react";
import Link from "next/link";

const TitleBase = css`
  letter-spacing: 0.1em;
  font-weight: 300;
  line-height: 1.125;

  a {
    color: #363636;
  }
`;

const styles = {
  siteTitle: css`
    ${TitleBase}
    font-size: 2.5rem;
  `,
  pageTitle: css`
    ${TitleBase}
    font-size: 2rem;
  `,
  header: css`
    display: flex;
    padding-bottom: 20px;
  `,
  headerRight: css`
    margin-left: auto;
  `,
};

export default function Layout({
  title,
  subTitle,
  children,
}: {
  title: string | null;
  subTitle: string | null;
  children: any;
}) {
  return (
    <>
      <Head>
        <title>Yuta Hirose</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div css={styles.header}>
        {/* headerLeft */}
        <div>
          <h1 css={styles.siteTitle}>
            <Link href="/">Yuta Hirose</Link>
          </h1>
          {title && (
            <h2 css={styles.pageTitle}>
              <Link href={`/${title.toLowerCase()}`}>
                {subTitle ? `${title}.${subTitle}` : title}
              </Link>
            </h2>
          )}
        </div>
        {/* headerRight */}
        <div css={styles.headerRight}>
          <HeaderNav />
        </div>
      </div>
      <main>{children}</main>
    </>
  );
}
