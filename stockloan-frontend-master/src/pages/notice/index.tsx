/* eslint-disable unused-imports/no-unused-vars */
import { Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import router from 'next/router';
import { useEffect, useState } from 'react';
import * as React from 'react';
import tw from 'tailwind-styled-components';

import { useMediaQuery } from '@/hooks/useMediaQuery';

// component
import Layout from '@/components/layout/Layout';
import UnstyledLink from '@/components/links/UnstyledLink';

import { getNoticeList } from '@/api/BetterApi';
import { IconArrowNext } from '@/assets/icon/IconArrowNext';
import { IconSearchBlack } from '@/assets/icon/IconSearchBlack';
import { CommonUtil } from '@/utils/commonUtil';

import { INotice } from '@/types/notice';

// image, icon

interface NoticeListDTO {
  title: string;
  date: string;
  seq: string;
}

interface SearchParams {
  keyword: string;
}

const initSearchParams: SearchParams = {
  keyword: '',
};

export default function Notice() {
  const isMobile = useMediaQuery(768);
  const [noticeList, setNoticeList] = useState<INotice[]>([]);
  const [searcheList, setSearchList] = useState<INotice[]>([]);
  const [searchParams, setSearchParams] =
    useState<SearchParams>(initSearchParams);
  const [noticeTab, setNoticeTab] = useState<number>(0);

  const getNoticeListData = async () => {
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
    setSearchList(noticeKeyValueList);
  };

  const filterNoticeData = () => {
    if (searchParams.keyword) {
      const searchNotice: INotice[] = [];
      noticeList.forEach((item: INotice) => {
        if (item.attributes.TTL.indexOf(searchParams.keyword) > -1) {
          searchNotice.push(item);
        }
      });
      setSearchList(searchNotice);
    } else {
      setSearchList(noticeList);
    }
  };

  const handleSearchParams = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      filterNoticeData();
    }
  };

  const handleMobileNoticeTab = (
    event: React.SyntheticEvent,
    index: number
  ) => {
    setNoticeTab(index);
  };

  const handleSubmit = React.useCallback(() => {
    getNoticeListData();
  }, []);

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <Layout>
      {isMobile ? (
        <div className='relative mx-auto max-w-[768px] py-[32px]'>
          <div className='mb-[20px] border-b border-b-[#F1F5F9]'>
            <MobileTabs
              value={noticeTab}
              onChange={handleMobileNoticeTab}
              variant='scrollable'
              scrollButtons='auto'
              aria-label='scrollable auto tabs example'
              TabIndicatorProps={{
                children: <span className='MuiTabs-indicatorSpan' />,
              }}
            >
              <MobileTab label='공지/안내' />
            </MobileTabs>
          </div>
          <div>
            {searcheList.map((list) => (
              <div
                key={list.id}
                className='flex h-[74px] items-center justify-between px-[20px]'
                onClick={() => router.push(`/notice/${list.id}`)}
              >
                <div>
                  <h1 className='text-[16px] font-normal leading-[22px] text-[#33374D]'>
                    {list.attributes.TTL}
                  </h1>
                  <p className='text-[12px] leading-[18px] text-[#ADAFB8]'>
                    {CommonUtil.dateFilter(list.attributes.updatedAt, '.')}
                  </p>
                </div>
                <div className='h-[10px] w-[10px]'>
                  <IconArrowNext />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='relative mx-auto w-full max-w-[1180px] py-[95px]'>
          <NoticeTitle>공지/안내</NoticeTitle>
          <div className='mt-[37px] mb-[25px] flex w-full items-center justify-between'>
            <div className='pt-[25px] text-[18px] font-normal leading-[22px] text-[#222]'>
              <span>Total</span>&nbsp;
              <strong>{searcheList.length}</strong>&nbsp;건
            </div>
            <div className='relative h-[50px] w-[300px]'>
              <input
                name='keyword'
                value={searchParams.keyword}
                type='text'
                onChange={(e) => handleSearchParams(e)}
                onKeyPress={(e) => handleEnterKeyPress(e)}
                placeholder='검색어를 입력해주세요.'
                className='h-[50px] w-full rounded-[50px] border-0 bg-[#F8F8F8] pr-[42px] pl-[21px] text-[13px]'
              />
              <button
                type='submit'
                className='absolute right-[18px] top-[50%] h-[24px] w-[24px] translate-y-[-50%]'
                onClick={() => filterNoticeData()}
              >
                <IconSearchBlack />
              </button>
            </div>
          </div>
          <div className='mb-[10px]'>
            <hr className='border border-[#222]' />
            {searcheList.map((list) => (
              <div
                key={list.id}
                className='flex h-[80px] items-center justify-between border-b border-b-[#E8E8E8] pr-[35px]'
              >
                <NoticeLabel>공지</NoticeLabel>
                <NoticeLink>
                  <UnstyledLink key={list.id} href={`/notice/${list.id}`}>
                    {list.attributes.TTL}
                  </UnstyledLink>
                </NoticeLink>
                <NoticeDate>
                  {CommonUtil.dateFilter(list.attributes.updatedAt, '-')}
                </NoticeDate>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

// style
const NoticeTitle = tw.h3`
text-center text-[48px] font-bold leading-[58px] text-[#222]
`;
const NoticeLabel = tw.label`
block h-[30px] w-[56px] rounded-[50px] bg-[#26499D] text-center text-[16px] font-semibold leading-[30px] text-white ml-[5px]
`;
const NoticeLink = tw.div`
w-[85%] pl-[35px] text-left text-[15px] font-semibold text-[#222]
`;
const NoticeDate = tw.p`
w-[150px] text-right text-[15px] text-[#666]
`;

interface StyledTabProps {
  label: string;
}
const MobileTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    marginLeft: 16,
    marginRight: 16,
    width: '100%',
    backgroundColor: '#2E9BFF',
  },
});
const MobileTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(() => ({
  fontSize: '15px',
  color: '#33374D',
  lineHeight: '24px',
  '&.Mui-selected': {
    color: '#33374D',
    fontWeight: '500',
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#33374D',
  },
}));
