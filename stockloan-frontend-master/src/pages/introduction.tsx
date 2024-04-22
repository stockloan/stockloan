import Image from 'next/image';
import * as React from 'react';
import tw from 'tailwind-styled-components';

import Layout from '@/components/layout/Layout';

import companyLogo from '@/assets/common/ATConneck/ATConneck_logo_2.webp';
import companyLogo2 from '@/assets/common/ATConneck/ATConneck_logo_3.webp';

// ----------------------------------------------------------------------

export default function Introduction() {
  return (
    <Layout>
      <div className='relative h-full w-full'>
        <div className="h-[640px] w-full bg-[url('/images/introduction/bg_sub_company.png')] bg-center px-[20px] pt-[40px] md:h-[720px] md:px-0 md:pt-[125px]">
          <IntroInner className='pb-[217px]'>
            <h2 className='text-[36px] font-bold leading-[58px] text-white md:text-[48px] '>
              알아서 딱! 쉽게,
              <br className='md:hidden' /> 안전하게
              <IntroDot className='mt-[25px]' />
            </h2>
            <p className='mt-[22px] text-[18px] font-normal leading-[29px] text-white md:text-[24px]'>
              쉬운 투자 연결,&nbsp;
              <span className='text-[32px] font-bold leading-[38px]'>
                코넥 스탁론
              </span>
              <IntroDot className='mt-[10px] ml-[4px] h-[8px] w-[8px]' />
            </p>
            <div className='absolute bottom-0 right-0 flex h-[150px] w-full max-w-[200px] flex-col-reverse md:h-full md:max-w-[400px]'>
              <div className='w-full'>
                <Image
                  src={companyLogo}
                  layout='fill'
                  alt='com_logo'
                  objectFit='contain'
                />
              </div>
            </div>
          </IntroInner>
        </div>
        <div className='px-[20px] pt-[95px] pb-[127px] md:px-0'>
          <IntroInner className='flex items-center justify-between'>
            <div>
              <VisionTitle>
                쉬운 투자 연결
                <br />
                코넥 스탁론
              </VisionTitle>
              <VisionTxt>
                깃플 스탁론이 코넥 스탁론으로 새 단장했어요.
                <br />
                코넥만의 위기관리 시스템으로 안전 투자하세요.
              </VisionTxt>
            </div>
            <div className='relative hidden h-[375px] w-[612px] md:block'>
              <Image
                src={companyLogo2}
                layout='fill'
                objectFit='contain'
                alt='vision_step1'
              />
            </div>
          </IntroInner>
        </div>
        {/* Section 5 */}
        <div className='bg-[#E1EBFF] px-[20px] pt-[96px] pb-[94px] md:px-0'>
          <IntroInner className='flex justify-between'>
            <div className='relative hidden h-[407px] w-[334px] md:block'>
              <Image
                src='/images/introduction/vision_step2.png'
                layout='fill'
                objectFit='contain'
                alt='vision_step2'
              />
            </div>
            <div className='pt-[34px]'>
              <VisionTitle>
                투자성향 맞춤
                <br />
                대출 조회
              </VisionTitle>
              <VisionTxt>
                조건검색으로 투자스타일에 맞는 스탁론 상품을 찾아보세요.
                <br />
                최다 제휴로 메이저 증권사와 금융사 모두 비교할 수 있어요.
              </VisionTxt>
            </div>
          </IntroInner>
        </div>
        {/* Section 6 */}
        <div className='px-[20px] pt-[83px] pb-[80px] md:px-0'>
          <IntroInner className='flex justify-between'>
            <div className='pt-[50px]'>
              <VisionTitle>
                모바일에서
                <br />
                간편하게 완료
              </VisionTitle>
              <VisionTxt>
                어디서든 바로 비교하고 신청할 수 있어요.
                <br />
                모바일에서 신청하고 증권계좌 입금까지 확인하세요.
              </VisionTxt>
              <VisionNotice>
                * 일부 모바일 미지원 상품의 경우 PC에서 신청할 수 있습니다.
              </VisionNotice>
            </div>
            <div className='relative hidden h-[434px] w-[522px] md:block'>
              <Image
                src='/images/introduction/vision_step3.png'
                layout='fill'
                objectFit='contain'
                alt='vision_step3'
              />
            </div>
          </IntroInner>
        </div>
      </div>
    </Layout>
  );
}

// style
const IntroInner = tw.div`
max-w-[1180px] mx-auto relative w-full
`;
const IntroDot = tw.span`
inline-block w-[10px] h-[10px] ml-[8px] rounded-[50%] bg-[#26B7BC] align-middle
`;

const VisionTitle = tw.h4`
text-[48px] font-bold leading-[65px] text-[#222]
`;
const VisionTxt = tw.p`
pt-[42px] text-[20px] font-normal leading-[40px] text-[#222]
`;
const VisionNotice = tw.p`
pt-[10px] text-[16px] text-[#666] leading-[30px] font-normal
`;
