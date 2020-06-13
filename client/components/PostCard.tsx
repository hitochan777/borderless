import React from "react";
import styled from "styled-components";
import { Chip, Grid, Typography, IconButton } from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";

import Link from "next/link";
import dayjs from "@/lib/time";

import { useViewer } from "@/hooks/useViewer";
import { usePostDeleteMutation } from "@/generated/types";

interface Props {
  id: string;
  title: string;
  username: string;
  language: string;
  updatedAt: Date;
  description: string;
}

const MyLink = styled.a`
  &:visited {
    text-decorations: none;
  }
  &:hover {
    cursor: pointer;
  }
`;

const StyledPostCard = styled.div`
  padding: 20px;
  &:hover {
    background-color: #e5e9f0;
  }
  transition: 0.3s;
`;

const MAX_DESCRIPTION_LEN = 200;

export const PostCard: React.FC<Props> = ({
  id,
  title,
  username,
  language,
  updatedAt,
  description,
}) => {
  const [postDelete, postDeleteResult] = usePostDeleteMutation();
  const handleDeleteClick = async (id: string) => {
    if (confirm("Are you sure you want to delete this tweet?")) {
      await postDelete({
        variables: { id },
        update(cache) {
          cache.evict({ id });
        },
      });
    }
  };

  const { viewer } = useViewer();
  return (
    <StyledPostCard>
      <Grid container>
        <Grid item>
          <Link href="/[username]/[postId]" as={`/${username}/${id}`}>
            <MyLink>
              <Typography variant="h1" color="textPrimary">
                {title}
              </Typography>
            </MyLink>
          </Link>
        </Grid>
        <Grid>
          {viewer && viewer.username === username && (
            <IconButton
              disabled={postDeleteResult.loading}
              onClick={() => handleDeleteClick(id)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Grid>
      </Grid>

      <Chip
        label={language}
        size="small"
        onClick={(e) => {
          e.preventDefault();
          // TODO: To route to search result page
        }}
      />
      <Typography color="textPrimary">
        {description.substr(0, MAX_DESCRIPTION_LEN) +
          (description.length > MAX_DESCRIPTION_LEN ? "..." : "")}
      </Typography>
      {`${username}・${dayjs(updatedAt).fromNow()}`}
    </StyledPostCard>
  );
};
