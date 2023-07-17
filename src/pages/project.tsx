/** @jsxImportSource @emotion/react */
import Layout from "../components/Layout";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { css } from "@emotion/react";
import cloudinary from "../utils/cloudinary";
import Link from "next/link";

const styles = {
  container: css`
    flex-wrap: wrap;
    margin-left: -0.75rem;
    margin-right: -0.75rem;
    margin-top: -0.75rem;

    &:last-child {
      margin-bottom: -0.75rem;
    }

    @media (min-width: 769px) {
      display: flex;
    }
  `,
  item: css`
    padding: 0.75rem;
    display: block;

    @media (min-width: 769px) {
      flex: none;
      width: 50%;
    }
  `,
  image: css`
    display: block;
    height: auto;
    width: 100%;
  `,
};

type Project = {
  title: string;
  publicId: string;
  secureUrl: string;
  sort: number;
  dir: string;
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const response = await cloudinary.v2.search
    .expression("folder:portfolio/project")
    .with_field("context")
    .with_field("tags")
    .max_results(10)
    .execute()
    .then((result) => {
      return result.resources;
    });

  const projectList: Project[] = response.map((source: any) => {
    const context: Project = {
      title: source.context.caption,
      publicId: source.public_id,
      secureUrl: source.secure_url,
      sort: source.context.sort,
      dir: source.context.dir,
    };
    return context;
  });

  return {
    props: {
      projectList: projectList,
    },
  };
};

export default function IndexPage(props: Props) {
  return (
    <Layout title="Project" subTitle="">
      <div css={styles.container}>
        {props.projectList.map((project) => (
          <div css={styles.item} key={project.sort}>
            <Link href={`/project/${project.dir}/`}>
              <figure className="image">
                <img
                  css={styles.image}
                  src={project.secureUrl}
                  alt={project.title}
                />
              </figure>
              <p>{project.title}</p>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
}
