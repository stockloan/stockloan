import React from 'react';

interface Props {
  onClick?: () => void;
}

export const IconArrow = ({ onClick, ...other }: Props) => (
  <span onClick={onClick} {...other}>
    <svg
      width='9'
      height='15'
      viewBox='0 0 9 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M2.83883 1.06068C2.25305 0.474895 1.3033 0.474895 0.717514 1.06068C0.131726 1.64647 0.131726 2.59622 0.717514 3.182L5.31371 7.7782L0.717514 12.3744C0.131726 12.9602 0.131726 13.9099 0.717514 14.4957C1.3033 15.0815 2.25305 15.0815 2.83883 14.4957L8.49569 8.83886C9.08148 8.25307 9.08148 7.30333 8.49569 6.71754L2.83883 1.06068Z'
        fill='#26499D'
      />
    </svg>
  </span>
);
