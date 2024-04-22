import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import * as React from 'react';
import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import tw from 'tailwind-styled-components';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import Layout from '@/components/layout/Layout';
import UnstyledLink from '@/components/links/UnstyledLink';

import { useAppDispatch, useAppSelector } from '@/store/hook';
import {
  deleteSearchedParamsList,
  setSearchedParamsList,
  setSearchedStock,
} from '@/store/slice/stock';

import {
  getSearchedStockloanPresent,
  getStockloanPresent,
  IPagination,
  IStockloanPresent,
} from '@/api/StockloanApi';
import { IconArrowDown } from '@/assets/icon/IconArrowDown';
import { IconArrowNext } from '@/assets/icon/IconArrowNext';
import { IconArrowUp } from '@/assets/icon/IconArrowUp';
import { IconCloseCircle } from '@/assets/icon/IconCloseCircle';
import { IconInfo } from '@/assets/icon/IconInfo';
import { IconInputCancel } from '@/assets/icon/IconInputCancel';
import { IconMore } from '@/assets/icon/IconMore';
import { IconSearch } from '@/assets/icon/IconSearch';

import { initSearchParams, ISearchParams } from '@/types/product';

// ----------------------------------------------------------------------
/*
  TODO
  1. 검색 Loading 필요
  2. Skeleton loading 필요
  3. pagination loading 필요
*/

export default function BetterStock() {
  const isMobile = useMediaQuery(768);
  const router = useRouter();
  const [searchParams, setSearchParams] =
    useState<ISearchParams>(initSearchParams);
  const [searchList, setSearchList] = useState<IStockloanPresent[]>([]);
  const [searchedList, setSearchedList] = useState<IStockloanPresent[]>([]);
  const [searchedParams, setSearchedParams] = useState<string[]>([]);
  const [pagination, setPagination] = useState<IPagination>();
  const [searchedKeyword, setSearchedKeyword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearchFold, setIsSearchFold] = useState<boolean>(true);
  const [isSearchedFold, setIsSearchedFold] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const inputKeyword = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { searched: searchedStockList, searchedParams: searchedParamsList } =
    useAppSelector((state) => state.stockReducer);

  useEffect(() => {
    const queryParam = router.query.search?.toString();
    if (queryParam) {
      handleSubmit(queryParam);
    }
    getSearchedList();
    setSearchedParams([...(searchedParamsList ?? [])]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStockloanPresentList = useCallback(
    async (searchParams: string, page: number, searchingNextPage: boolean) => {
      if (isLoading) return;
      const { data, meta } = await getStockloanPresent(searchParams, page);

      if (searchingNextPage) {
        const tempSearchList = searchList;
        data.forEach((element: IStockloanPresent) => {
          tempSearchList.push(element);
        });
        setSearchList(tempSearchList);
      } else {
        const list: IStockloanPresent[] = data ? data : [];
        setSearchList(list);
        saveSearchedStock(list, searchParams);
      }
      setPagination(meta.pagination);
      setIsLoading(false);
      setIsSearchFold(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, searchList]
  );

  const getSearchedList = async () => {
    const params = searchedStockList.join('|');
    const { data } = await getSearchedStockloanPresent(params);
    const list: IStockloanPresent[] = data ? data : [];
    setSearchedList(list);
  };

  const saveSearchedStock = async (
    list: IStockloanPresent[],
    searchParam: string
  ) => {
    if (!list || list.length === 0) return;
    const stock = list.filter(
      (item) => item.attributes.ISU_KR_NM === searchParam
    );
    if (stock.length > 0) {
      // 종목명이 일치하는 종목 하나
      await dispatch(setSearchedStock(stock[0].attributes.ISU_SRT_CD));
    } else {
      // 검색결과 최상위 하나
      await dispatch(setSearchedStock(list[0].attributes.ISU_SRT_CD));
    }
    getSearchedList();
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
      inputKeyword.current?.blur();
      handleSubmit();
    }
  };

  const handleSubmit = async (word?: string) => {
    const keyword = word ? word : searchParams.keyword;
    if (keyword.length < 2) {
      setErrorMsg('두글자 이상 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setSearchList([]);
    setSearchedKeyword(keyword);
    if (!word) {
      const paramsList: string[] = searchedParams.filter(
        (item) => item !== keyword
      );
      paramsList.unshift(keyword);
      setSearchedParams([...paramsList]);
      await dispatch(setSearchedParamsList(keyword));
    }
    setErrorMsg('');
    getStockloanPresentList(keyword, 1, false);
  };

  const searchNextPage = () => {
    if (isLoading) return;
    if (pagination) {
      setIsLoading(true);
      if (pagination?.page < pagination?.pageCount && !isLoading) {
        getStockloanPresentList(searchedKeyword, pagination?.page + 1, true);
      }
    }
  };

  return (
    <Layout>
      <StockHeaderContainer>
        <StockHeaderTitle>종목검색</StockHeaderTitle>

        {/* 검색 */}
        <div className='relative mx-auto mt-[16px] w-full max-w-[780px] bg-[#F1F5F9] px-[24px] py-[32px] md:mt-[47px] md:bg-transparent md:px-0 md:py-[32px]'>
          <p
            className={clsx(
              'mb-[17px] inline-block text-[15px] text-[#33374D] md:hidden',
              {
                'text-[#2E9BFF]': searchParams.keyword.length > 0,
              }
            )}
          >
            종목명 / 종목코드
          </p>
          <div
            className={clsx(
              'relative flex h-[38px] w-full border-b border-b-[#E6E7EA] md:h-[70px] md:border-b-0',
              { 'border-b-[#2E9BFF]': searchParams.keyword.length > 0 }
            )}
          >
            <StockSearchInput
              name='keyword'
              value={searchParams.keyword}
              type='text'
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleSearchParams(e)
              }
              onKeyPress={(e: KeyboardEvent<HTMLInputElement>) =>
                handleEnterKeyPress(e)
              }
              placeholder={
                isMobile ? '검색해보세요' : '증권사/금융사명을 입력하세요.'
              }
              ref={inputKeyword}
            />
            <StockSearchButton onClick={() => handleSubmit()}>
              <IconSearch className='stroke-[#33374D] ' />
            </StockSearchButton>
            <StockCancelButton
              onClick={() => {
                setSearchParams({ ...searchParams, ['keyword']: '' });
                setErrorMsg('');
              }}
            >
              <IconInputCancel />
            </StockCancelButton>
          </div>
          {errorMsg && <p className='text-[12px] text-[#EB4D3D]'>{errorMsg}</p>}
        </div>
        {!isMobile && (
          <div className='mx-auto mt-[-2px] flex max-w-[780px] justify-start overflow-x-scroll scrollbar-hide'>
            {searchedParams?.map((tag, index) => (
              <StockTagButton key={index}>
                <span onClick={() => handleSubmit(tag)}>{tag}</span>{' '}
                <IconCloseCircle
                  className='ml-[8px] block w-[20px]'
                  onClick={() => {
                    setSearchedParams(
                      searchedParams.filter((param) => param !== tag)
                    );
                    dispatch(deleteSearchedParamsList(tag));
                  }}
                />
              </StockTagButton>
            ))}
          </div>
        )}
      </StockHeaderContainer>

      {/* 결과 */}
      {searchedKeyword && (
        <>
          <div className='m-auto max-w-[1180px]'>
            {searchList.length > 0 ? (
              <>
                <div>
                  <Accordion
                    sx={{ border: 0 }}
                    elevation={0}
                    expanded={!isSearchFold}
                  >
                    <AccordionSummary
                      sx={{
                        px: 2.5,
                        my: isMobile ? 0 : '35px',
                        borderBottom: isMobile
                          ? `${isSearchFold ? 0 : 5}px solid #F7F9FB`
                          : 'none',
                      }}
                    >
                      <div className='flex w-full items-center justify-between leading-[22px] text-[#33374D]'>
                        <p className='md:text-[20px] md:font-semibold'>
                          현재 검색 종목
                        </p>
                        <div
                          className='flex items-center'
                          onClick={() => setIsSearchFold(!isSearchFold)}
                        >
                          {isSearchFold ? (
                            <div className='flex items-center md:rounded-[30px] md:bg-[#2e9bff] md:bg-opacity-[0.08] md:px-[15px] md:py-[4px]'>
                              <p>펼침</p>
                              <div className='ml-2 h-[12px] w-[12px]'>
                                <IconArrowDown fill='#33374D' />
                              </div>
                            </div>
                          ) : (
                            <div className='flex items-center md:rounded-[30px] md:bg-[#2e9bff] md:bg-opacity-[0.08] md:px-[15px] md:py-[4px]'>
                              <p>접기</p>
                              <div className='ml-2 h-[12px] w-[12px]'>
                                <IconArrowUp fill='#33374D' />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <div className='mb-[30px]'>
                        <div className='bg-white px-[20px]'>
                          {searchList.map((item) => (
                            <div
                              key={item.id}
                              className='h-[130px] border-b border-b-[#F1F5F9] last:border-0 md:mb-[30px] md:h-[160px] md:rounded-[20px] md:border-[1px] md:border-[#E8E8E8] md:last:border-[1px] '
                            >
                              <StockPresentItem presentItem={item} />
                            </div>
                          ))}
                        </div>
                        {!isLoading &&
                          pagination &&
                          pagination?.page < pagination?.pageCount && (
                            <div className='mt-[5px] flex w-full items-center justify-center'>
                              <IconMore
                                className='block h-[40px] w-[40px]'
                                onClick={() => searchNextPage()}
                              />
                            </div>
                          )}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </>
            ) : (
              !isLoading && (
                <div className='mt-[64px] flex flex-col items-center'>
                  <IconInfo className='block h-[36px] w-[36px]' />
                  <p className='mt-[16px] text-[16px] leading-[22px] text-[#ADAFB8]'>
                    검색결과가 없어요
                  </p>
                </div>
              )
            )}
          </div>
          {/* Loading */}
          {isLoading && (
            <div className='mx-auto max-w-[1180px] px-[40px] py-[20px]'>
              <div className='flex animate-pulse space-x-4'>
                <div className='h-10 w-10 rounded-full bg-black opacity-[0.1]'></div>
                <div className='flex-1 space-y-6 py-1'>
                  <div className='h-2 rounded bg-black opacity-[0.1]'></div>
                  <div className='space-y-3'>
                    <div className='grid grid-cols-3 gap-4'>
                      <div className='col-span-2 h-2 rounded bg-black opacity-[0.1]'></div>
                      <div className='col-span-1 h-2 rounded bg-black opacity-[0.1]'></div>
                    </div>
                    <div className='h-2 rounded bg-black opacity-[0.1]'></div>
                  </div>
                </div>
              </div>
              <p className='mt-[20px] text-center text-[#858794]'>
                종목을 불러오고 있습니다.
              </p>
            </div>
          )}
        </>
      )}
      {/* 나의 검색 종목 */}
      <div className='md:mb-[185px]'>
        {searchedList.length > 0 ? (
          <>
            <div className='h-[20px] w-full bg-[#F7F9FB] md:hidden'></div>
            <div className='m-auto max-w-[1180px]'>
              <>
                <div>
                  <Accordion
                    sx={{ border: 0 }}
                    elevation={0}
                    expanded={!isSearchedFold}
                  >
                    <AccordionSummary
                      sx={{
                        px: 2.5,
                        my: isMobile ? 0 : '35px',
                        borderBottom: isMobile
                          ? `${isSearchFold ? 0 : 5}px solid #F7F9FB`
                          : 'none',
                      }}
                    >
                      <div className='flex w-full items-center justify-between leading-[22px] text-[#33374D]'>
                        <p className='md:text-[20px] md:font-semibold'>
                          나의 검색 종목
                        </p>
                        <div
                          className='flex items-center'
                          onClick={() => setIsSearchedFold(!isSearchedFold)}
                        >
                          {isSearchedFold ? (
                            <div className='flex items-center md:rounded-[30px] md:bg-[#2e9bff] md:bg-opacity-[0.08] md:px-[15px] md:py-[4px]'>
                              <p>펼침</p>
                              <div className='ml-2 h-[12px] w-[12px]'>
                                <IconArrowDown fill='#33374D' />
                              </div>
                            </div>
                          ) : (
                            <div className='flex items-center md:rounded-[30px] md:bg-[#2e9bff] md:bg-opacity-[0.08] md:px-[15px] md:py-[4px]'>
                              <p>접기</p>
                              <div className='ml-2 h-[12px] w-[12px]'>
                                <IconArrowUp fill='#33374D' />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <div>
                        <div className='bg-[#F7F9FB] px-[20px] md:bg-white'>
                          {searchedList.map((item) => (
                            <div
                              key={item.id}
                              className='h-[130px] border-b border-b-[#F1F5F9] bg-[#F7F9FB] last:border-0 md:mb-[30px] md:h-[160px] md:rounded-[20px] md:border-[1px] md:border-[#E8E8E8] md:last:border-[1px] '
                            >
                              <StockPresentItem presentItem={item} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
                <div className='bg-[#F1F5F9] py-[32px] px-[20px] md:hidden'>
                  <h1 className='mt-[4px] mb-[8px] text-[19px] font-semibold leading-[26px] text-[#33374D]'>
                    대출가능여부와
                    <br />
                    대출금액을 빠르게 알려드려요!
                  </h1>
                  <div className='flex items-end justify-between'>
                    <div>
                      <strong className='text-[30px] font-semibold leading-[45px] text-[#33AAFF]'>
                        1544-8125
                      </strong>
                      <p className='text-[13px] text-[#858794]'>
                        평일 08:30 ~ 17:30
                      </p>
                    </div>
                    <UnstyledLink href='/consulting'>
                      <button className='betterButton'>상담 신청하기</button>
                    </UnstyledLink>
                  </div>
                </div>
              </>
            </div>
          </>
        ) : (
          <></>
        )}
        {/* Loading */}
        {isLoading && (
          <div className='mx-auto max-w-[1180px] px-[40px]'>
            <div className='flex animate-pulse space-x-4'>
              <div className='h-10 w-10 rounded-full bg-black opacity-[0.1]'></div>
              <div className='flex-1 space-y-6 py-1'>
                <div className='h-2 rounded bg-black opacity-[0.1]'></div>
                <div className='space-y-3'>
                  <div className='grid grid-cols-3 gap-4'>
                    <div className='col-span-2 h-2 rounded bg-black opacity-[0.1]'></div>
                    <div className='col-span-1 h-2 rounded bg-black opacity-[0.1]'></div>
                  </div>
                  <div className='h-2 rounded bg-black opacity-[0.1]'></div>
                </div>
              </div>
            </div>
            <p className='mt-[20px] text-center text-[#858794]'>
              종목을 불러오고 있습니다.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
interface StockPresentItemProps {
  presentItem: IStockloanPresent;
}
function StockPresentItem({ presentItem }: StockPresentItemProps) {
  const item = presentItem;
  const { TEL_NUM } = useAppSelector((state) => state.allianceReducer);
  const { isEnter: isEnterBetter } = useAppSelector(
    (state) => state.betterReducer
  );

  // stock이 없는 경우가 있음
  return (
    <div className='py-[20px] md:relative md:p-[42px]'>
      <div className=' mb-[6px] flex items-center justify-start'>
        <h3 className='mr-[5px] text-[18px] font-semibold leading-[24px] text-[#33374D] md:text-[28px] md:leading-[28px]'>
          {item.attributes.ISU_KR_NM}
        </h3>
        <label
          className={clsx(
            'rounded-[66px] px-[8px] py-[2px] text-[11px] font-medium leading-[14px] md:ml-[4px] md:py-[4px] md:px-[12px] md:text-[14px] md:leading-[18px]',
            {
              'label-possible': item.attributes.LAN_TPE === 'possible',
            },
            {
              'label-consultation': item.attributes.LAN_TPE === 'consultation',
            },
            {
              'label-impossible': item.attributes.LAN_TPE === 'impossible',
            }
          )}
        >
          {item.attributes.LAN_TPE === 'possible' && '대출가능'}
          {item.attributes.LAN_TPE === 'consultation' && '대출협의가능'}
          {item.attributes.LAN_TPE === 'impossible' && '대출불가'}
        </label>
      </div>
      <div className='flex justify-between align-bottom '>
        <div className='items-center pt-3 md:flex'>
          <p className='flex items-center text-[16px] leading-[20px] text-[#33374D] md:flex-row-reverse md:justify-end md:text-[24px] md:leading-[28px]'>
            {item.stock && (
              <>
                <span>{item.stock.trdPrc.toLocaleString('ko-KR')}</span>
                <span className='ml-1 text-[9px] leading-[11px] text-[#858794] md:ml-0 md:mr-[7px] md:text-[12px] md:leading-[21px]'>
                  현재가
                </span>
              </>
            )}
          </p>
          <div className='mt-[5px] text-[12px] md:mt-[2px] md:ml-[10px] md:text-[17px]'>
            {item.stock && (
              <div
                className={clsx(
                  'text-right',
                  {
                    'stock-up': item.stock.cmpprevddRate > 0,
                  },
                  {
                    'stock-down': item.stock.cmpprevddRate < 0,
                  },
                  {
                    'stock-freezing':
                      item.stock.cmpprevddRate === 0 ||
                      item.stock.cmpprevddRate === null,
                  }
                )}
              >
                <span className='text-[12px]'>
                  {item.stock.cmpprevddRate > 0 && '▲'}
                  {item.stock.cmpprevddRate < 0 && '▼'}
                </span>
                <span className='ml-[2px] mr-[5px] text-[#33374D] md:mr-[7px]'>
                  {Math.abs(item.stock.cmpprevddPrc).toLocaleString('ko-KR')}원
                </span>
                <span>
                  {item.stock.cmpprevddRate > 0 && '+'}
                  {Math.floor(item.stock.cmpprevddRate * 100) / 100}%
                </span>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col justify-between md:absolute md:right-[42px] md:top-[34px]'>
          {isEnterBetter ? (
            <UnstyledLink href='/consulting' className='w-full'>
              <StockConsulingButton className='w-full border-[#213DA1] bg-[#213DA1] text-white'>
                상담 신청
                <IconArrowNext
                  className='ml-1 inline-block h-[6px] w-[6px] md:h-[10px] md:w-[10px]'
                  fill='#ffffff'
                />
              </StockConsulingButton>
            </UnstyledLink>
          ) : (
            <>
              <UnstyledLink
                href='/consulting'
                openNewTab={false}
                className='w-full'
              >
                <StockConsulingButton className='mb-[5px] border-[#E4E4E4] bg-white text-[#4C2625] md:mb-[10px]'>
                  상담 신청
                  <IconArrowNext
                    className='ml-1 inline-block h-[6px] w-[6px] md:h-[10px] md:w-[10px]'
                    fill='#4C2625'
                  />
                </StockConsulingButton>
              </UnstyledLink>
              <UnstyledLink
                href={`tel:${TEL_NUM}`}
                openNewTab={false}
                className='w-full'
              >
                <StockConsulingButton className='w-full border-[#213DA1] bg-[#213DA1] text-white'>
                  전화 상담
                  <IconArrowNext
                    className='ml-1 inline-block h-[6px] w-[6px] md:h-[10px] md:w-[10px]'
                    fill='#ffffff'
                  />
                </StockConsulingButton>
              </UnstyledLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
const StockSearchInput = tw.input`
h-[28px] w-[100%] mt-[5px] border-none pr-[60px] indent-[15px] text-[24px]  text-[#858794] leading-[28px] bg-transparent py-0 
md:h-[70px] md:rounded-[50px] md:bg-white md:text-[18px] md:text-[#aaa] md:leadint-[22px] md:mt-0 md:indent-[35px]
`;
const StockSearchButton = tw.button`
absolute top-[50%] left-[0] h-[15px] w-[15px] translate-y-[-50%]
md:top-[50%] md:right-[29px] md:left-auto md:h-[28px] md:w-[28px] md:translate-y-[-50%]
`;
const StockCancelButton = tw.button`
absolute top-[50%] right-[0] h-[24px] w-[24px] translate-y-[-50%] md:hidden
`;
const StockConsulingButton = tw.button`
py-[6px] px-[10px] border-[1px] rounded-[76px] text-[12px] leading-[13px] flex items-center justify-center tracking-tighter
md:py-[8px] md:px-[20px] md:text-[18px] md:leading-[25px]
`;

const StockHeaderContainer = tw.div`
w-full pt-[20px] h-auto
md:h-[480px] md:bg-[url('/images/product/bg_sub_product.jpeg')] md:bg-center md:pt-[95px] 
`;
const StockHeaderTitle = tw.h2`
mb-[20px] text-[22px] font-semibold leading-[32px] text-[#33374D] px-[20px]
md:after:inline-block md:text-[48px] md:text-[#222] md:text-center md:leading-[58px] md:px-0
`;
const StockTagButton = tw.button`
mr-[10px] w-auto whitespace-nowrap  bg-[rgba(255,255,255,0.6)] px-[15px] py-[10px] font-semibold rounded-[50px] text-[16px] text-[#666] leading-1 flex items-center
`;
