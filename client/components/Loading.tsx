import React from "react";
import styled from "styled-components";

const Spinner = styled.div`
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
`;

const SpinnerItem = styled.div`
  display: inline-block;
  position: absolute;
  left: 6px;
  width: 13px;
  background: #000;
  animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  @keyframes lds-facebook {
    0% {
      top: 6px;
      height: 51px;
    }
    50%,
    100% {
      top: 19px;
      height: 26px;
    }
  }
  &:nth-child(1) {
    left: 6px;
    animation-delay: -0.24s;
  }

  &:nth-child(2) {
    left: 26px;
    animation-delay: -0.12s;
  }

  &:nth-child(3) {
    left: 45px;
    animation-delay: 0;
  }
`;

const Loading = () => (
  <Spinner>
    <SpinnerItem />
    <SpinnerItem />
    <SpinnerItem />
  </Spinner>
);

export default Loading;
