import React from "react";
import { graphql } from "gatsby";
import Image from "../components/image";

export default function MicroCMSTemplate({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { microcmsEndpoint } = data; // data.markdownRemark holds your post data
  const { content, title, image, publishedAt, updatedAt } = microcmsEndpoint;
  return (
    <div className="blog-post-container">
      <div className="blog-post">
        <h1>{title}</h1>
        <h2>publishedAt: {publishedAt}</h2>
        <h2>updatedAt: {updatedAt}</h2>
        <figure>
            <Image url={image.url} alt="画像" />
        </figure>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query($slug: String!) {
    microcmsEndpoint(endpointId: {eq: $slug }) {
        content
        createdAt
        publishedAt
        title
        updatedAt
        image {
          height
          url
          width
        }
      }
  }
`