import React from "react";
import { NextPage } from "next";
import { useQuery } from "@apollo/react-hooks";
import Box from "@material-ui/core/Box";

import Layout from "@/layout/default";
import { FETCH_SEARCH_RESULT_QUERY } from "@/constant/graphql";
import {
  FetchSearchResultQuery,
  FetchSearchResultQueryVariables
} from "@/generated/types";
// import Loading from "@/components/Loading";
import { PostCard } from "@/components/PostCard";

interface Props {
  language: string | string[] | undefined;
}

const SearchPage: NextPage<Props> = ({ language }) => {
  const { data, error, loading } = useQuery<
    FetchSearchResultQuery,
    FetchSearchResultQueryVariables
  >(FETCH_SEARCH_RESULT_QUERY, {
    variables: { query: { language: language ? +language : undefined } }
  });

  if (loading) {
    return <></>;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("Fetch data is malformed");
  }

  return (
    <Layout>
      <Box paddingLeft="30%" paddingRight="30%">
        {data.search.length === 0 && <span>Sorry not results found!</span>}
        {data.search.map(post => (
          <Box key={post.id} mb="1rem">
            <PostCard
              id={post.id}
              title={post.title}
              username={post.user.username}
              language={post.language.name}
              updatedAt={post.updatedAt}
            />
          </Box>
        ))}
      </Box>
    </Layout>
  );
};

SearchPage.getInitialProps = async ctx => {
  const { query } = ctx;
  const { lang } = query;
  return { language: lang };
};

export default SearchPage;
