import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import tw from 'tailwind-styled-components';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import UnstyledLink from '@/components/links/UnstyledLink';

import { getNoticeList } from '@/api/BetterApi';
import { CommonUtil } from '@/utils/commonUtil';

// test json
import { INotice } from '@/types/notice';
// ----------------------------------------------------------------------

const SlickSettings = {
  dots: false,
  arrows: false,
  infinite: true,
  speed: 200,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function MainNoticeSlider() {
  const [noticeList, setNoticeList] = useState<INotice[]>([]);
  const slickRef = useRef<Slider | null>(null);

  const getNoticeData = async () => {
    const result = await getNoticeList();
    const noticeKeyValueList: INotice[] = result.data.map((item: INotice) => {
      const noticeKeyValueMap: INotice = {
        id: item.id,
        attributes: {
          CNTNT: item.attributes.CNTNT,
          NTC_TYP: item.attributes.NTC_TYP,
          TTL: item.attributes.TTL,
          createdAt: item.attributes.createdAt,
          publishedAt: item.attributes.publishedAt,
          updatedAt: item.attributes.updatedAt,
        },
      };
      return noticeKeyValueMap;
    });
    setNoticeList(noticeKeyValueList);
  };

  useEffect(() => {
    getNoticeData();
  }, []);
  return (
    <div className='flex h-[100px] w-full justify-between px-[8px] md:px-0'>
      <MainNoticeHeader>공지사항</MainNoticeHeader>
      <Slider ref={slickRef} {...SlickSettings} className='w-[80%]'>
        {noticeList.map((list) => (
          <div key={list.id}>
            <div className='flex h-[100px] items-center justify-between'>
              <UnstyledLink
                href={'/notice/' + list.id}
                className='overflow-hidden text-ellipsis whitespace-nowrap'
              >
                <MainNoticeTitle>{list.attributes.TTL}</MainNoticeTitle>
              </UnstyledLink>
              <MainNoticeDate>
                {CommonUtil.dateFilter(list.attributes.updatedAt, '-')}
              </MainNoticeDate>
            </div>
          </div>
        ))}
      </Slider>
      <div className='flex w-full max-w-[100px] items-center justify-center'>
        <MainNoticeIcon
          onClick={() => {
            slickRef?.current?.slickPrev();
          }}
        >
          <Image
            src='/images/main/main_notice_prev_ico.png'
            width={8}
            height={12}
            alt='notice_prev'
          />
        </MainNoticeIcon>
        <MainNoticeIcon
          onClick={() => {
            slickRef?.current?.slickNext();
          }}
        >
          <Image
            src='/images/main/main_notice_next_ico.png'
            width={8}
            height={12}
            alt='notice_prev'
          />
        </MainNoticeIcon>
      </div>
    </div>
  );
}

// style
const MainNoticeHeader = tw.h3`
w-[100px] text-[18px] font-bold text-[#26499D] leading-[100px] hidden
md:inline-block
`;
const MainNoticeTitle = tw.span`
text-[18px] text-[#222] font-bold leading-[100px] 
`;
const MainNoticeDate = tw.span`
text-[18px] text-[#aaa] font-normal hidden
md:inline
`;
const MainNoticeIcon = tw.span`
w-[25px] h-[25px] bg-white rounded-[50%] border border-[#E8E8E8] flex justify-center items-center cursor-pointer
md:w-[40px] md:h-[40px]
`;
