const { createRemoteFileNode } = require('gatsby-source-filesystem');

exports.sourceNodes = async ({
    actions: { createNode, createNodeField },
    createNodeId,
    cache,
    store,
    getNode,
    getNodes
}) => {
    const allNodes = getNodes();
    const allImageUrls = allNodes.reduce((acc, cur) => {
        if (cur.internal.type === "MicrocmsEndpoint" && !!cur.image.url) {
            acc.push(cur.image.url);
        }
        return acc;
    }, []);
    console.log(allImageUrls);

    await Promise.all(allImageUrls.map(async (url) => {

    // createRemoteFileNodeで外部の画像のファイルノードを作成する
    const fileNode = await createRemoteFileNode({
        url,
        cache,
        store,
        createNode,
        createNodeId,
      });
  
      // 他ファイルノードと区別するための識別子を付与
      await createNodeField({
        node: fileNode,
        name: 'SampleImage',
        value: 'true',
      });
  
      // メタ情報として画像のURLを付与
      await createNodeField({
        node: fileNode,
        name: 'link',
        value: url,
      });
  
      return fileNode;
    }));
};



exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  const blogPostTemplate = require.resolve(`./src/templates/blogTemplate.js`);
  const blogPostMicroCMSTemplate = require.resolve(`./src/templates/blogTemplateMicroCMS.js`);

  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___DATE] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
                BASENAME
            }
          }
        }
      }
      allMicrocmsEndpoint(
          limit: 1000
      ) {
          edges {
              node {
                endpointId
              }
          }
      }
    }
  `);
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: `/blog/${node.frontmatter.BASENAME}`,
      component: blogPostTemplate,
      context: {
        // additional data can be passed via context
        slug: node.frontmatter.BASENAME,
      },
    });
  });

  result.data.allMicrocmsEndpoint.edges.forEach(({ node }) => {
      createPage({
          path: `/blog/${node.endpointId}`,
          component: blogPostMicroCMSTemplate,
          context: {
              slug: node.endpointId
          }
      });
  });
};