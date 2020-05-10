import React from "react";
import styled from "styled-components";
import { Chip, Typography } from "@material-ui/core";
import Link from "next/link";
import dayjs from "@/lib/time";

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
  return (
    <StyledPostCard>
      <Link href="/[username]/[postId]" as={`/${username}/${id}`}>
        <MyLink>
          <Typography variant="h1" color="textPrimary">
            {title}
          </Typography>
        </MyLink>
      </Link>
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
