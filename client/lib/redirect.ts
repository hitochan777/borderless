import { NextPageContext } from "next";
import Router from "next/router";

export default (cxt: NextPageContext, target: string) => {
  if (cxt.res) {
    // For SSR
    cxt.res.writeHead(303, { Location: target });
    cxt.res.end();
  } else {
    // on browser
    Router.replace(target);
  }
};
