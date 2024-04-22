import * as React from 'react';
import tw from 'tailwind-styled-components';

import UnstyledLink from '@/components/links/UnstyledLink';

import { IconArrowNext } from '@/assets/icon/IconArrowNext';

// ----------------------------------------------------------------------
interface IProps {
  label: string;
  path: string;
  isShowArrow?: boolean;
  arrowFill?: string;
}

export default function MainButton({
  label,
  path,
  isShowArrow,
  arrowFill,
}: IProps) {
  return (
    <UnstyledLink href={path} className='mr-[8px] w-[120px] md:w-auto'>
      <MainButtonLink>
        <span dangerouslySetInnerHTML={{ __html: label }}></span>
        {isShowArrow && (
          <IconArrowNext
            className='ml-[5px] h-[7px] w-[7px]'
            fill={arrowFill || '#000000'}
          />
        )}
      </MainButtonLink>
    </UnstyledLink>
  );
}

// style
const MainButtonLink = tw.button`
w-[100%] h-[28px] mb-[20px] px-[10px] py-[6px]
flex justify-center items-center
text-[#274A9E] text-[13px] font-semibold leading-[16px]
bg-[rgba(255,255,255,0.6)] rounded-[60px] duration-[0.3s]
hover:bg-white hover:shadow-[4px_4px_15px_rgb(38,73,157,0.25)]

md:w-[180px] md:h-[60px] md:mr-[12px] md:text-[18px]
`;
