import Image from 'next/image';
import * as React from 'react';
import { useState } from 'react';
import tw from 'tailwind-styled-components';

// component
import UnstyledLink from '@/components/links/UnstyledLink';

import { useAppSelector } from '@/store/hook';

// image, icon
// import Logo from '@/assets/common/stockloan_logo.png';
import Logo from '@/assets/common/ATConneck/ATConneck_logo_1.webp';
import { IconMenu } from '@/assets/icon/IconMenu';
import { IconPhoneCall } from '@/assets/icon/IconPhoneCall';

// import iconPhoneCall from '../../assets/icon/phonecall.svg'

// ----------------------------------------------------------------------

const links = [
  { href: '/stock', label: '종목검색' },
  { href: '/product', label: '상품안내' },
  { href: '/consulting', label: '상담신청' },
  { href: '/notice', label: '공지/안내' },
  { href: '/introduction', label: '회사소개' },
];

export default function Header() {
  const [isShowMenu, setShowMenu] = useState<boolean>(false);
  const { TEL_NUM } = useAppSelector((state) => state.allianceReducer);
  return (
    <SLHeaderContainer>
      <SLHeader>
        <UnstyledLink
          href='/'
          className='font-bold leading-4 hover:text-gray-600'
        >
          <Image src={Logo} alt='logo' width={100} height={40} />
        </UnstyledLink>
        <nav>
          <SLHeaderUl>
            {links.map(({ href, label }) => (
              <li key={`${href}${label}`}>
                <UnstyledLink href={href}>{label}</UnstyledLink>
              </li>
            ))}
          </SLHeaderUl>
        </nav>
        <SLPhoneCall href={`tel:${TEL_NUM}`}>
          <IconPhoneCall />
          <span className='ml-[5px]'>{TEL_NUM}</span>
        </SLPhoneCall>
      </SLHeader>
      <div className='flex h-[75px] items-center justify-between px-[15px] md:hidden'>
        <UnstyledLink
          href='/'
          className='font-bold leading-4 hover:text-gray-600'
        >
          <Image src={Logo} alt='logo' width={100} height={40} />
        </UnstyledLink>
        <span
          className='cursor-pointer'
          onClick={() => {
            setShowMenu(!isShowMenu);
          }}
        >
          <IconMenu />
        </span>
      </div>
      {/* 모바일 */}
      {isShowMenu && (
        <div>
          <div
            className='absolute top-[75px] right-[0px] h-screen w-screen bg-black opacity-50'
            onClick={() => {
              setShowMenu(false);
            }}
          ></div>
          <div className='absolute top-[75px] right-0 h-screen w-[50%] bg-white p-[30px]'>
            <ul className='flex-col items-center justify-center text-left'>
              {links.map(({ href, label }) => (
                <li key={`${href}${label}`} className='mb-[16px]'>
                  <UnstyledLink
                    href={href}
                    className='text-[21px]'
                    onClick={() => {
                      setShowMenu(false);
                    }}
                  >
                    {label}
                  </UnstyledLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </SLHeaderContainer>
  );
}

// style
const SLHeaderContainer = tw.header`
sticky top-0 z-50 bg-white border-b border-[#EAEAEA]
`;
const SLHeader = tw.div`
layout h-[75px] items-center justify-between hidden
md:flex
`;
const SLHeaderUl = tw.ul`
flex items-center justify-between space-x-[65px] text-[#222] text-lg font-semibold tracking-[-0.03em]
`;
const SLPhoneCall = tw.a`
flex items-center 
text-white font-semibold text-base leading-[38px]
bg-[#26499D] py-0 px-4 rounded-[50px]
`;
