import React from "react";

const hoge = (a: number, b: number): number => a + b;

export default () => <div>hello{hoge(2, 3)}</div>;
