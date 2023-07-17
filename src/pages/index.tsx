/** @jsxImportSource @emotion/react */
import Layout from "../components/Layout";
import { css } from "@emotion/react";

const styles = {
  topImage: css`
    width: 100%;
    height: auto;
  `,
};
const IndexPage = () => (
  <Layout title="" subTitle="sss">
    <figure>
      <img
        css={styles.topImage}
        src="https://res.cloudinary.com/omdwn/portfolio/top.jpg"
        alt="top"
      />
    </figure>
  </Layout>
);

export default IndexPage;
