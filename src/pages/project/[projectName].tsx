/** @jsxImportSource @emotion/react */
import Layout from "../../components/Layout";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { css } from "@emotion/react";
import cloudinary from "../../utils/cloudinary";
import { useState } from "react";
import { sortBy } from "lodash";

const navBase = css`
  position: absolute;
  font-size: 2rem;
  color: white;
  top: 42vh;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
`;

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
      width: 25%;
    }
  `,
  figXX: css`
    display: block;
    position: relative;
  `,
  image: css`
    display: block;
    width: 250px;
    height: 250px;
    object-fit: cover;
    margin: auto;
    // TODO: global
    max-width: 100%;
  `,
  imageModal: css`
    z-index: 40;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-width: 100%;
    background: rgba(0, 0, 0, 0.85);
  `,
  prevNav: css`
    ${navBase}
    text-align: left;
    right: auto;
    left: 3%;
    &:before {
      content: "<";
    }
  `,
  nextNav: css`
    ${navBase}
    text-align: right;
    left: auto;
    right: 3%;
    &:before {
      content: ">";
    }
  `,
  bigImage: css`
    display: block;
    margin: auto;
    max-width: 80%;
    max-height: 90%;
    height: 88vh;
    padding-top: 4%;
    object-fit: scale-down;
  `,
  imageText: css`
    font-size: 80%;
    z-index: 100;
    display: block;
    margin: auto;
    color: aliceblue;
    text-align: center;
  `,
  imageTextChild: css`
    padding-top: 0.5rem;
  `,
};

type Photo = {
  title: string;
  description: string | null;
  publicId: string;
  sort: number;
  sourceUrl: string;
  thumbSourceUrl: string;
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export async function getStaticPaths() {
  return {
    paths: [
      { params: { projectName: "object" } },
      { params: { projectName: "portrait" } },
      { params: { projectName: "miura" } },
      { params: { projectName: "kyoto" } },
      { params: { projectName: "taiwan" } },
    ],
    fallback: false,
  };
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const projectName = context.params.projectName as string;
  const response = await cloudinary.v2.search
    .expression(`folder:portfolio/project/${projectName}`)
    .with_field("context")
    .with_field("tags")
    .max_results(200)
    // metadata(context)でのソートはサポートされていない
    .execute()
    .then((result) => {
      return result.resources;
    });

  const photoList: Photo[] = response.map((source: any) => {
    const sourceUrl = cloudinary.v2.url(source.public_id, {
      transformation: [
        { fetch_format: "webp" },
        { if: "w_gt_h" },
        { overlay: "hr_mat" },
        { if: "else" },
        { overlay: "vr_mat" },
        { if: "end" },
      ],
    });
    const thumbSourceUrl = cloudinary.v2.url(source.public_id, {
      transformation: [
        { crop: "fit" },
        { width: 500 },
        { height: 500 },
        { fetch_format: "webp" },
      ],
    });

    const photo: Photo = {
      title: source.context.caption,
      description: source.context.alt ?? null,
      publicId: source.public_id,
      sort: Number(source.context.sort),
      sourceUrl: sourceUrl,
      thumbSourceUrl: thumbSourceUrl,
    };

    return photo;
  });
  const sortedPhotoList = sortBy(photoList, "sort").reverse();

  const captalizedName =
    projectName.charAt(0).toUpperCase() + projectName.slice(1);

  return {
    props: {
      projectName: captalizedName,
      photoList: sortedPhotoList,
    },
  };
};

export default function IndexPage(props: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const totalImageNumber = props.photoList.length;

  const openImageModal = (
    modalNum: number,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImageIndex(modalNum);
  };

  const closeImageModal = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setActiveImageIndex(null);
  };

  return (
    <Layout title="Project" subTitle={props.projectName}>
      <div css={styles.container}>
        {props.photoList.map((photo, index) => (
          <div css={styles.item} key={index}>
            <div onClick={(e) => openImageModal(index, e)}>
              <figure css={styles.figXX} data-modal="hoge">
                <img css={styles.image} src={photo.thumbSourceUrl} />
              </figure>
            </div>
            {activeImageIndex === index && (
              <div css={styles.imageModal} onClick={closeImageModal}>
                {/* 最初or最後の画像でなければ前後ナビ表示 */}
                {index > 0 && (
                  <div
                    css={styles.prevNav}
                    onClick={(e) => openImageModal(index - 1, e)}
                  />
                )}
                {index < totalImageNumber - 1 && (
                  <div
                    css={styles.nextNav}
                    onClick={(e) => openImageModal(index + 1, e)}
                  />
                )}
                <img
                  css={styles.bigImage}
                  src={photo.sourceUrl}
                  alt={photo.title}
                />
                <div css={styles.imageText}>
                  <p css={styles.imageTextChild}>{photo.title}</p>
                  <p css={styles.imageTextChild}>{photo.description}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}
