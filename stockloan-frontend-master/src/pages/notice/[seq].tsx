/* eslint-disable unused-imports/no-unused-vars */
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import * as React from 'react';
import tw from 'tailwind-styled-components';

import 'react-quill/dist/quill.snow.css';

import { useMediaQuery } from '@/hooks/useMediaQuery';

// component
import Layout from '@/components/layout/Layout';
import UnstyledLink from '@/components/links/UnstyledLink';

import { getNotice } from '@/api/BetterApi';
import { IconArrowDown } from '@/assets/icon/IconArrowDown';
import { IconArrowUp } from '@/assets/icon/IconArrowUp';
import { CommonUtil } from '@/utils/commonUtil';

import { INotice, INoticeBoard } from '@/types/notice';

// image, icon
const QuillWrapper = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});
const initNoticeValue: INotice = {
  id: 0,
  attributes: {
    CNTNT: '',
    NTC_TYP: '',
    TTL: '',
    createdAt: new Date(),
    publishedAt: new Date(),
    updatedAt: new Date(),
  },
};

export default function Notice() {
  const router = useRouter();
  const isMobile = useMediaQuery(768);
  const [noticeSeq, setNoticeSeq] = useState<string | undefined>('');
  const [notice, setNotice] = useState<INotice>(initNoticeValue);
  const [prevNotice, setPrevNotice] = useState<INotice>();
  const [nextNotice, setNextNotice] = useState<INotice>();

  const getNoticeData = useCallback(async () => {
    const noticeId = noticeSeq ? noticeSeq : '';
    if (noticeId) {
      setPrevNotice(undefined);
      setNextNotice(undefined);
      const result: INoticeBoard = await getNotice(parseInt(noticeId));
      if (!result.current) {
        router.push('/404');
      } else {
        setNotice(result.current);
      }
      if (result.prev) setPrevNotice(result.prev);
      if (result.next) setNextNotice(result.next);
    }
  }, [noticeSeq, router]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    // eslint-disable-next-line
    const noticeSeq = router.query.seq;
    setNoticeSeq(noticeSeq?.toString());
  }, [router, router.query.seq]);

  useEffect(() => {
    if (noticeSeq) {
      getNoticeData();
    }
  }, [getNoticeData, noticeSeq]);

  return (
    <Layout>
      {isMobile ? (
        <div className='py-[20px]'>
          <div className='border-b border-b-[#858794] px-[20px] pb-[20px]'>
            <h1 className='mb-[8px] text-[22px] font-semibold leading-[32px] text-[#33374D]'>
              {notice?.attributes.TTL}
            </h1>
            <p className='text-[12px] leading-[18px] text-[#858794]'>
              {CommonUtil.dateFilter(notice.attributes.updatedAt, '.')}
            </p>
          </div>
          <QuillWrapper
            value={notice.attributes.CNTNT}
            readOnly={true}
            theme='bubble'
            className='relative mt-[40px] min-h-[200px] w-full px-[20px] pb-[140px]'
          />
        </div>
      ) : (
        <div className='relative mx-auto w-full max-w-[1180px] py-[95px]'>
          <NoticeTitle>공지/안내</NoticeTitle>
          <div className='mt-[82px] border-t-[2px] border-b border-t-[#222] border-b-[#E8E8E8] px-[20px] pt-[36px] pb-[10px]'>
            <h2 className='mb-[32px] overflow-hidden text-ellipsis whitespace-nowrap text-[24px] leading-[29px] text-[#222]'>
              {notice?.attributes.TTL}
            </h2>
            <p className='text-[#666]'>
              {noticeSeq}
              <span className='mx-[12px] text-[#E8E8E8]'>|</span>
              {CommonUtil.dateFilter(notice.attributes.updatedAt, '.')}
            </p>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: notice.attributes.CNTNT }}
            className='relative mt-[40px] min-h-[200px] w-full px-[20px] pb-[140px]'
          ></div>
          <div className='w-full'>
            <UnstyledLink
              href='/notice'
              className='mx-auto block h-[50px] w-[180px] rounded-[4px] border border-[#aaa] bg-white text-center text-[16px] leading-[50px] text-[#666]'
            >
              목록
            </UnstyledLink>
          </div>
          <div className='mt-[100px] border-b border-b-[#f1f1f1]'>
            {/* 이전글 */}
            {prevNotice ? (
              <ListBox>
                <ListDirection>
                  <IconArrowUp className='mr-[14px] h-[10px] w-[15px]' />
                  이전글
                </ListDirection>
                <UnstyledLink
                  href={`/notice/${prevNotice.id}`}
                  className='w-full text-[18px] font-normal leading-[49px] text-[#222]'
                >
                  {prevNotice.attributes.TTL}
                </UnstyledLink>
                <ListDate>
                  {CommonUtil.dateFilter(prevNotice.attributes.updatedAt, '.')}
                </ListDate>
              </ListBox>
            ) : (
              ''
            )}
            {nextNotice ? (
              <ListBox>
                <ListDirection>
                  <IconArrowDown className='mr-[14px] h-[10px] w-[15px]' />
                  다음글
                </ListDirection>
                <UnstyledLink
                  href={`/notice/${nextNotice.id}`}
                  className='w-full text-[18px] font-normal leading-[49px] text-[#222]'
                >
                  {/* Markdown 형식으로 변경 할 수도 있음(react-markdown 사용) */}
                  {nextNotice.attributes.TTL}
                </UnstyledLink>
                <ListDate>
                  {CommonUtil.dateFilter(nextNotice.attributes.updatedAt, '.')}
                </ListDate>
              </ListBox>
            ) : (
              ''
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

// style
const NoticeTitle = tw.h3`
text-center text-[48px] font-bold leading-[58px] text-[#222]
after:content-[''] after:inline-block after:w-[10px] after:h-[10px] after:ml-[8px] after:mt-[25px] after:rounded-[5px] after:bg-[#26B7BC] after:align-middle
`;
const ListBox = tw.div`
flex h-[90px] w-full justify-between border-t border-t-[#E8E8E8] p-[20px] hover:bg-[#f6f6f6]
`;
const ListDirection = tw.span`
flex w-[170px] flex-nowrap items-center text-[16px] font-semibold text-[#666]
`;
const ListDate = tw.span`
flex w-[85px] items-center justify-center align-middle text-[16px] text-[#666] font-normal leading-[49px]
`;
