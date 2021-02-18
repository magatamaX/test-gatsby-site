import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import GatsbyImage from 'gatsby-image';

const Image = ({ url, alt="" }) => {
  const { allFile } = useStaticQuery(query);
  const targetEdge = allFile.edges.find(edge => edge.node.fields.link === url);

  if (!targetEdge) {
    return null;
  }

  return (
    <GatsbyImage
      alt={alt}
      fluid={targetEdge.node.childImageSharp.fluid}
    />
  )
};

export default Image;

const query = graphql`
  query {
    allFile(
      filter: {fields: {SampleImage: {eq: "true"}}}
    ){
      edges {
        node {
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
          id
          fields {
            # 一応メタ情報も取得する
            SampleImage
            link
          }
        }
      }
    }
  }
`;