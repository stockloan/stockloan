import Image from 'next/image';
import * as React from 'react';
import tw from 'tailwind-styled-components';

import UnstyledLink from '@/components/links/UnstyledLink';

import footerLogo from '@/assets/common/ATConneck/ATConneck_logo_1.webp';

const footerLinks = [
  { href: '/product', label: '상품안내' },
  { href: '/notice', label: '공지/안내' },
  { href: '/introduction', label: '회사소개' },
  { href: '/notice/1', label: '개인정보처리방침' },
];

const addressList = [
  { label: '사업자명', content: '(주)에이티코넥' },
  { label: '대표', content: '안수진' },
  { label: '사업자등록번호', content: '579-81-02798' },
  // { label: '통신판매업신고번호', content: '2019-서울영등포-1224' },
  {
    label: '영업소재지',
    content: '서울특별시 영등포구 여의도동 43 7층',
  },
  // { label: '대표번호', content: '070-8838-0118' },
  { label: '이메일', content: 'contact@atconneck.com' },
];

export default function Footer() {
  return (
    <FooterContainer>
      <div className='layout'>
        <FooterNavContainer>
          <span className='hidden md:inline'>
            <Image src={footerLogo} width={150} height={62} alt='logo' />
          </span>
          <div className='md:ml-2'>
            {footerLinks.map(({ href, label }) => (
              <FooterNavButton key={`${href}${label}`}>
                <UnstyledLink href={href}>{label}</UnstyledLink>
              </FooterNavButton>
            ))}
          </div>
        </FooterNavContainer>
        <FooterContentsContainer>
          <address className='not-italic leading-[30px]'>
            {addressList.map(({ label, content }, index) => (
              <FooterAddressList key={`${label}${content}`}>
                <strong className='mr-[3px] font-semibold'>{label}.</strong>
                {content}
                {index === 3 ? <br /> : ''}
              </FooterAddressList>
            ))}
          </address>
          {/* <FooterCopyright>© Gitple. All Rights Reserved.</FooterCopyright> */}
        </FooterContentsContainer>
      </div>
    </FooterContainer>
  );
}

// style
const FooterContainer = tw.footer`
pt-[41px] pb-[39px] bg-[#F8F8F8]
`;
const FooterNavContainer = tw.div`
flex
md:flex-row md:items-end
`;
const FooterNavButton = tw.button`
px-[16px] py-[7px] bg-white border border-[#E8E8E8] ml-0 rounded mb-[8px] mr-[8px]
md:mb-0 md:ml-[5px] md:mr-0
`;
const FooterContentsContainer = tw.div`
flex items-start justify-between mt-[27px] flex-col
md:flex-row md:items-end
`;
const FooterAddressList = tw.span`
mr-[10px] text-[15px] font-normal tracking-[-0.02em] break-words text-[#666666] block
md:inline
`;
