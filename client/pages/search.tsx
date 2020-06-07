import React from "react";
import { NextPage } from "next";
import { useQuery } from "@apollo/react-hooks";
import { Box, Grid } from "@material-ui/core";

import Layout from "@/layout/default";
import { FETCH_SEARCH_RESULT_QUERY } from "@/constant/graphql";
import {
  FetchSearchResultQuery,
  FetchSearchResultQueryVariables,
} from "@/generated/types";
import { PostCard } from "@/components/PostCard";

interface PageProps {
  language: string | string[] | undefined;
  namespacesRequired: string[];
}

const SearchPage: NextPage<PageProps> = ({ language }) => {
  const { data, error, loading } = useQuery<
    FetchSearchResultQuery,
    FetchSearchResultQueryVariables
  >(FETCH_SEARCH_RESULT_QUERY, {
    variables: { query: { language: language as string } },
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
      <Grid container justify="center">
        <Grid item sm={12}>
          {data.search.length === 0 && <span>Sorry not results found!</span>}
          {data.search.map((post) => (
            <Box key={post.id} mb="1rem">
              <PostCard
                id={post.id}
                title={post.title}
                username={post.user.username}
                language={post.language.name}
                updatedAt={post.updatedAt}
                description={post.lines
                  .map((line) =>
                    line.partialLines.map((pl) => pl.text).join("")
                  )
                  .join("  ")}
              />
            </Box>
          ))}
        </Grid>
      </Grid>
    </Layout>
  );
};

SearchPage.getInitialProps = async (ctx) => {
  const { query } = ctx;
  const { lang } = query;
  return { language: lang, namespacesRequired: ["common"] };
};

export default SearchPage;
