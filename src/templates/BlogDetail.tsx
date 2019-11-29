import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '@src/layouts/HeaderNotFixedLayout'
import {
  Flex,
  Container,
  Box,
  Fixed,
  Button,
  BackgroundProps,
  Text,
  InlineBlock,
} from '@src/components/atoms'
import { Blog, GraphqlBlogResult } from '@src/types'
import Breadcrumbs from '@src/components/Breadcrumbs'
import styled from 'styled-components'
import Markdown from '@src/components/Markdown'
import BlogCatalogs from '@src/components/Markdown/Catalogs'
import Category from '@src/components/pages/blogList/CategoryList'
import Recommend from '@src/components/pages/blog/RecommendList'
import theme from '@src/constants/theme'
import { debounce } from '@src/utils'
import BlogDetailLink from '@src/components/Link/BlogDetailLink'
import Helmet from '@src/components/Helmet'
import {
  background,
  display,
  DisplayProps,
  space,
  SpaceProps,
} from 'styled-system'
import { formateDate } from '@src/utils'
import ExternalLink from '@src/components/Link/ExternalLink'
import CategoryLink from '@src/components/Link/CategoryLink'

const ExternalLinkWrapper = styled(InlineBlock)`
  margin-left: 5px;

  a {
    transition: all 0.3s ease;
  }
  &:hover {
    a {
      color: ${theme.colors.serverlessRed};
    }
  }
`

interface Props {
  data: {
    currentBlog: Blog['node']
    previousBlog: Blog['node']
    nextBlog: Blog['node']
    recommendBlogs: GraphqlBlogResult
  }
  location: any
}

const LinkWrapper = styled.div<DisplayProps & SpaceProps>`
  ${display}
  ${space}
  a {
    margin: 20px 0;

    transition: all 0.3s ease;

    line-height: 22px;

    &:hover {
      color: ${theme.colors.serverlessRed};
    }
  }
`

const BoxWithBackground = styled(Box)<BackgroundProps>`
  ${background}
  display: flex;
  flex-direction: column;
  border-radius: 5px;
`

const BlogDetail = ({
  data: { currentBlog, previousBlog, nextBlog, recommendBlogs },
  location,
}: Props) => {
  const [isBackTopButtonShow, setIsBackTopButtonShow] = React.useState(false)

  React.useEffect(() => {
    const onScroll = debounce(() => {
      const scrollTop = document.documentElement.scrollTop

      const clientHeight = document.documentElement.clientHeight

      if (scrollTop > clientHeight) {
      }

      setIsBackTopButtonShow(!!(scrollTop > clientHeight))
    }, 50)

    document.addEventListener('scroll', onScroll)

    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, [])

  console.log(currentBlog)

  return (
    <Layout>
      <Helmet {...currentBlog.frontmatter} location={location} />
      <Breadcrumbs>{currentBlog.frontmatter.title}</Breadcrumbs>
      <Container>
        <Flex
          alignItems={['center', 'center', 'center', 'flex-start']}
          justifyContent={['center', 'center', 'center', 'space-between']}
          flexDirection={['column', 'column', 'column', 'row']}
        >
          <Box
            width={[0.9, 0.9, 0.9, 0.72]}
            py={'40px'}
            px={[0, 0, 0, '10px', 0, 0]}
          >
            <BoxWithBackground
              mb="10px"
              py="20px"
              px="10px"
              background={theme.colors.gray[1]}
              width={1}
            >
              <Text my="5px">
                发布于: {formateDate(currentBlog.frontmatter.date)}
              </Text>
              <Text my="5px">
                作者:
                {currentBlog.frontmatter.authors.map((author, index) => (
                  <ExternalLinkWrapper>
                    {currentBlog.frontmatter.authorslink &&
                    currentBlog.frontmatter.authorslink[index] ? (
                      <ExternalLink
                        to={currentBlog.frontmatter.authorslink[index]}
                      >
                        {author}
                      </ExternalLink>
                    ) : (
                      author
                    )}
                  </ExternalLinkWrapper>
                ))}
              </Text>
              {currentBlog.frontmatter.translators &&
              currentBlog.frontmatter.translators.length ? (
                <Text my="5px">
                  译者:
                  {currentBlog.frontmatter.translators.map(
                    (translator, index) => (
                      <ExternalLinkWrapper>
                        {currentBlog.frontmatter.translatorslink &&
                        currentBlog.frontmatter.translatorslink[index] ? (
                          <ExternalLink
                            to={currentBlog.frontmatter.translatorslink[index]}
                          >
                            {translator}
                          </ExternalLink>
                        ) : (
                          translator
                        )}
                      </ExternalLinkWrapper>
                    )
                  )}
                </Text>
              ) : null}
              <Text my="5px">
                归档于:
                {currentBlog.frontmatter.categories.map(o => (
                  <LinkWrapper key={o} display="inline-block" ml="5px">
                    <CategoryLink category={o} />
                  </LinkWrapper>
                ))}
              </Text>
            </BoxWithBackground>

            <Markdown html={currentBlog.html as string}></Markdown>

            <Box mt="25px">
              <Flex
                alignItems="flex-start"
                justifyContent={['center', 'center', 'center', 'space-between']}
                flexDirection={['column', 'column', 'column', 'row']}
              >
                {previousBlog ? (
                  <LinkWrapper>
                    <BlogDetailLink blog={{ node: previousBlog }}>
                      上一篇：{previousBlog.frontmatter.title}
                    </BlogDetailLink>
                  </LinkWrapper>
                ) : null}

                {nextBlog ? (
                  <LinkWrapper>
                    <BlogDetailLink blog={{ node: nextBlog }}>
                      下一篇：{nextBlog.frontmatter.title}
                    </BlogDetailLink>
                  </LinkWrapper>
                ) : (
                  '已经是最后一篇了'
                )}
              </Flex>
            </Box>
          </Box>

          <Box width={[0.9, 0.9, 0.9, 0.25]}>
            <Recommend width={[1]} blogs={recommendBlogs.edges} />
            <Category width={[1]} />

            <BlogCatalogs html={currentBlog.tableOfContents} />
          </Box>
        </Flex>
      </Container>

      <Fixed right="30px" bottom="100px">
        {isBackTopButtonShow ? (
          <Button
            onClick={() => {
              document.documentElement.scrollTop = 0
            }}
            width="120px"
            fontSize="16px"
            p={'10px'}
            theme={theme}
          >
            回到顶部
          </Button>
        ) : null}
      </Fixed>
    </Layout>
  )
}

export default BlogDetail

export const query = graphql`
  fragment blogFields on MarkdownRemark {
    id
    frontmatter {
      thumbnail
      authors
      categories
      date
      title
      description
      authorslink
      translators
      translatorslink
    }
    wordCount {
      words
      sentences
      paragraphs
    }
    fileAbsolutePath
    fields {
      slug
    }
  }

  query BlogDetails(
    $blogId: String!
    $previousBlogId: String
    $nextBlogId: String
    $categories: [String!]
  ) {
    currentBlog: markdownRemark(id: { eq: $blogId }) {
      ...blogFields
      html
      tableOfContents(pathToSlugField: "fields.slug")
    }

    previousBlog: markdownRemark(id: { eq: $previousBlogId }) {
      ...blogFields
    }

    nextBlog: markdownRemark(id: { eq: $nextBlogId }) {
      ...blogFields
    }

    recommendBlogs: allMarkdownRemark(
      filter: {
        id: { ne: $blogId }
        frontmatter: { date: { ne: null }, categories: { in: $categories } }
        fileAbsolutePath: { regex: "/blog/" }
      }
      limit: 8
    ) {
      edges {
        node {
          ...blogFields
        }
      }
      totalCount
    }
  }
`
