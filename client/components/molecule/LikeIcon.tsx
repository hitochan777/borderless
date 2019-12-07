import React from "react";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

interface Props {
  liked: boolean;
}

export const LikeIcon: React.FC<Props> = ({ liked }) => {
  if (liked) {
    return <FavoriteIcon />;
  }
  return <FavoriteBorderIcon />;
};
