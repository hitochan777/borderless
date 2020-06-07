import React, { useEffect } from "react";

import { PostCard } from "@/components/PostCard";
import { useFetchFeedForUserQuery } from "@/generated/types";

const throttle = (func: () => void, timeFrame: number) => {
  let lastTime = 0;
  return () => {
    const now = new Date().getTime();
    if (now - lastTime >= timeFrame) {
      func();
      lastTime = now;
    }
  };
};

const useScrollDetect = (fn: () => void, threshold = 80) => {
  const throttledFn = throttle(fn, 1000);
  useEffect(() => {
    let scrollPos = 0;
    const handleScroll = (): void => {
      const {
        clientHeight,
        scrollTop,
        scrollHeight,
      } = document.documentElement;
      if (document.documentElement.getBoundingClientRect().top > scrollPos) {
        // scrolled upward
        scrollPos = document.documentElement.getBoundingClientRect().top;
        return;
      }
      scrollPos = document.documentElement.getBoundingClientRect().top;
      const scrollPercent =
        ((1.0 * (scrollTop + clientHeight)) / scrollHeight) * 100;
      if (scrollPercent > threshold) {
        throttledFn();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fn, threshold]);
};

export const Feed: React.FC = () => {
  const { data, loading, error, fetchMore } = useFetchFeedForUserQuery();
  const handleLoadMore = () => {
    if (!data) {
      return;
    }
    fetchMore({
      variables: {
        offset: data.feed.length,
        limit: 1,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return Object.assign({}, prev, {
          feed: [...prev.feed, ...fetchMoreResult.feed],
        });
      },
    });
  };
  useScrollDetect(handleLoadMore);

  if (loading) {
    return <></>;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error();
  }
  return (
    <>
      {data.feed.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          username={post.user.username}
          description={post.lines
            .map((line) => line.partialLines.map((pl) => pl.text).join(""))
            .join("  ")}
          language={post.language.name}
          updatedAt={post.updatedAt}
        />
      ))}
    </>
  );
};
