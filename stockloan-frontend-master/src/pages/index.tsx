/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import Layout from '@/components/layout/Layout';
import UnstyledLink from '@/components/links/UnstyledLink';
import MainNoticeSlider from '@/components/main/MainNoticeSlider';
import MainProductCard from '@/components/main/MainProductCard';
import MainSlider from '@/components/main/MainSlider';

import { useAppDispatch, useAppSelector } from '@/store/hook';
import { setIsEnterBetter } from '@/store/slice/better';
import { setSearchedParamsList } from '@/store/slice/stock';

import {
  getStockList,
  getStockloanProducts,
  getTagList,
} from '@/api/BetterApi';
import bannerLogo from '@/assets/common/ATConneck/ATConneck_logo_2.webp';
import { IconArrowNext } from '@/assets/icon/IconArrowNext';
import { IconSearch } from '@/assets/icon/IconSearch';
import { apiResponseMapping } from '@/pages/product';
import { CommonUtil } from '@/utils/commonUtil';

import {
  IKeyValue,
  initSearchParams,
  IProduct,
  ITagProduct,
  tagMappingTable,
} from '@/types/product';
import { IStock } from '@/types/stock';
// test json

// ----------------------------------------------------------------------

const MainStepList = [
  {
    title: '상담',
    description:
      '전화/채팅 상담으로 맞춤형 대출상품 안내<br/>상담전화 1544-8125',
    icon: 'main_step1_ico.png',
  },
  {
    title: '신청',
    description:
      '온라인으로 상품 약관동의 후 대출신청 진행<br/>* 영업시간 내 신청가능 (08:00-15:30)',
    icon: 'main_step2_ico.png',
  },
  {
    title: '입금',
    description:
      '대출신청이 완료되면 해당<br/>증권계좌로 대출금 바로 입금<br/>* 계좌가 없다면 신규계좌 개설 필요',
    icon: 'main_step3_ico.png',
  },
];

export default function HomePage() {
  const isMobile = useMediaQuery(768);
  const [stockValueList, setStockValueList] = useState<IStock[]>([]);
  const [tagKeyValueList, setTagKeyValueList] = useState<IKeyValue[]>([]);
  const [tagProducts, setTagProducts] = useState<ITagProduct[]>([]);
  const [mainProducts, setMainProducts] = useState<IProduct[]>([]);
  const [searchParams, setSearchParams] = useState<string>('');
  const [searchedParams, setSearchedParams] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const inputKeyword = useRef<HTMLInputElement>(null);
  const { searchedParams: searchedParamsList } = useAppSelector(
    (state) => state.stockReducer
  );
  const { TEL_NUM, URL } = useAppSelector((state) => state.allianceReducer);

  const setEnterBetter = () => {
    dispatch(setIsEnterBetter(false));
  };

  const getStockValue = async () => {
    const stockList = await getStockList();
    setStockValueList(
      stockList.data.map((item: any) => {
        return {
          stockId: item.id,
          stockNm: item.attributes.ORG_NM,
          stockImgUrl: item.attributes.ORG_IMG_URL,
        };
      })
    );
  };

  const setTagKeyList = async () => {
    const tagList = await getTagList();
    const tagKeyValueList: IKeyValue[] = tagList.data.map((item: any) => ({
      type: 'tag',
      id: item.id,
      name: item.attributes.GRP_NM,
    }));
    setTagKeyValueList(tagKeyValueList);
  };

  const drawTagProduct = async () => {
    let tagProducts: ITagProduct[] = [];
    tagKeyValueList.forEach((item) => {
      tagProducts.push({
        tagId: item.id,
        tagNm: item.name,
        tagTitle: tagMappingTable[item.name].title,
        tagDetail: tagMappingTable[item.name].detail,
        productInfo: [],
      });
    });

    const searchParams = _.cloneDeep(initSearchParams);
    searchParams.countPerPage = 100;
    searchParams.tagIds = tagProducts.map((item) => item.tagId);
    searchParams.isMnFrqntly = 'y';
    const apiResponse = await getStockloanProducts(searchParams);
    const products: IProduct[] = apiResponseMapping(apiResponse);
    tagProducts.forEach((tagProduct) => {
      for (const product of products) {
        if (product.tagIds.includes(tagProduct.tagId)) {
          tagProduct.productInfo.push(product);
        }
        if (tagProduct.productInfo.length >= 3) break;
      }
    });
    tagProducts = tagProducts.filter((item) => item.productInfo.length > 0);
    setTagProducts(tagProducts);
  };

  const getMainProducts = async () => {
    const searchParams = _.cloneDeep(initSearchParams);
    searchParams.countPerPage = 8;
    searchParams.isMnGds = 'y';
    const apiResponse = await getStockloanProducts(searchParams);
    const products: IProduct[] = apiResponseMapping(apiResponse);
    setMainProducts(products);
  };

  // 종목검색
  const handleSearchParams = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(value);
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputKeyword.current?.blur();
      handleSubmit();
    }
  };
  const handleSubmit = async (word?: string) => {
    const keyword = word ? word : searchParams;
    if (keyword.length < 2) {
      window.showErrorAlert('두글자 이상 입력해주세요.');
      return;
    }
    await dispatch(setSearchedParamsList(keyword));
    router.push(`/stock?search=${keyword}`);
  };

  useEffect(() => {
    setEnterBetter();
    if (CommonUtil.isNotEmpty(tagKeyValueList)) {
      drawTagProduct();
    }
  }, [tagKeyValueList]);

  useEffect(() => {
    getStockValue();
    setTagKeyList();
    getMainProducts();
    setSearchedParams([...(searchedParamsList ?? [])]);
  }, []);
  return (
    <Layout>
      <main>
        <section className='bg-white'>
          <MainViContainer>
            <MainViContents>
              <div className='mt-[23px] md:mt-0 md:w-[50%]'>
                {/* <MainViText1>팍스넷 스탁론의 새로운 시작</MainViText1> */}
                <MainViText2>코넥 스탁론</MainViText2>
                <MainViText3>13개 증권사와 함께 하는 코넥 스탁론</MainViText3>

                <div className='mb-[30px] mt-[30px] rounded-[20px] bg-white px-[17px] py-[26px] shadow-[5px_15px_30px_rgba(38,73,157,0.25)] md:w-[95%] md:px-[30px] md:py-[33px]'>
                  <div className='text-center md:text-left'>
                    <h1 className='z-0 text-[20px] font-normal leading-[25px] text-[#222222] md:text-[31px] md:leading-[37px]'>
                      나의 관심 종목으로
                      <br />
                      <strong className='md:text-[#274A9E]'>
                        대출 가능 여부를 알아보세요.
                      </strong>
                    </h1>
                  </div>
                  <div className='my-[15px]'>
                    <div className='relative w-full rounded-[50px] border border-[#E1E1E1]'>
                      <input
                        className='h-[46px] w-full border-0 bg-transparent pl-[18px] pr-[15px]'
                        type='text'
                        placeholder='종목명 / 종목코드'
                        value={searchParams}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleSearchParams(e)
                        }
                        onKeyPress={(e: KeyboardEvent<HTMLInputElement>) =>
                          handleEnterKeyPress(e)
                        }
                      />
                      <button
                        className='absolute top-[15px] right-[20px]'
                        onClick={() => handleSubmit()}
                      >
                        <IconSearch className='h-[16px] w-[16px] stroke-[#33374D]' />
                      </button>
                    </div>
                  </div>

                  <div className='flex flex-nowrap overflow-x-scroll whitespace-nowrap scrollbar-hide'>
                    {searchedParamsList.map((tag) => (
                      <button
                        key={tag}
                        className='mr-[5px]  rounded-[30px] bg-[#F2F2F2] py-[5px] px-[8px]'
                        onClick={() => handleSubmit(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className='mb:mt-[26px] mt-[20px] mb-[30px] flex flex-nowrap whitespace-nowrap md:flex-row-reverse md:justify-end'>
                  <UnstyledLink
                    href={`${URL}`}
                    openNewTab={true}
                    className='w-[30%] md:w-[25%]'
                  >
                    <MainButtonLink>
                      카카오톡 상담{' '}
                      {isMobile && (
                        <IconArrowNext
                          className='ml-[5px] h-[7px] w-[7px]'
                          fill='#26499D'
                        />
                      )}
                    </MainButtonLink>
                  </UnstyledLink>
                  <UnstyledLink
                    href={`tel:${TEL_NUM}`}
                    openNewTab={false}
                    className='mx-[5px] w-[40%] md:mx-[12px] md:w-[35%]'
                  >
                    <MainButtonLink>
                      상담센터&nbsp;
                      <strong className='font-semibold text-[#26B7BC]'>
                        {TEL_NUM}
                      </strong>{' '}
                    </MainButtonLink>
                  </UnstyledLink>
                  <MainButtonLink
                    className='w-[25%] bg-[#26499D] text-white md:justify-between'
                    onClick={() => router.push('/consulting')}
                  >
                    상담신청{' '}
                    <IconArrowNext
                      className='ml-[5px] h-[7px] w-[7px] md:h-[11px] md:w-[11px]'
                      fill='#ffffff'
                    />
                  </MainButtonLink>
                </div>
              </div>
              <MainSlider tagProduct={tagProducts} />
            </MainViContents>
          </MainViContainer>
          <div className='relative z-[2] hidden md:block'>
            <MainInnerBox>
              <div className='absolute bottom-[-100px] left-[55px]'>
                <Image
                  src='/images/main/main_money_ico.png'
                  alt='main_money_ico'
                  width={128}
                  height={147}
                />
              </div>
              <div className='absolute bottom-[-92px] left-[196px]'>
                <Image
                  src='/images/main/main_woman_ico.png'
                  alt='main_money_ico'
                  width={162}
                  height={203}
                />
              </div>
              <div className='absolute bottom-[-194px] right-[100px]'>
                <Image
                  src='/images/main/main_percent_ico.png'
                  alt='main_money_ico'
                  width={200}
                  height={137}
                />
              </div>
            </MainInnerBox>
          </div>
          <MainProductContainer>
            <MainProductTitle>상품안내</MainProductTitle>
            <MainInnerBox className='overflow-x-scroll px-[8px] pb-[60px] md:px-0 md:pb-0 lg:overflow-x-visible'>
              <MainProductCard mainProducts={mainProducts} />
            </MainInnerBox>
          </MainProductContainer>
          <MainStepContainer>
            <MainInnerBox>
              <MainStepTitle>스탁론 진행절차</MainStepTitle>
              <MainStepCardContainer>
                {MainStepList.map((list, index) => (
                  <MainStepCard key={list.title}>
                    <MainStepText1>Step {index + 1}</MainStepText1>
                    <MainStepText2>{list.title}</MainStepText2>
                    <MainStepText3
                      dangerouslySetInnerHTML={{ __html: list.description }}
                    ></MainStepText3>
                    <MainStepIcon>
                      <Image
                        src={`/images/main/${list.icon}`}
                        alt={list.title}
                        layout='fill'
                        objectFit='contain'
                      />
                    </MainStepIcon>
                  </MainStepCard>
                ))}
              </MainStepCardContainer>
            </MainInnerBox>
          </MainStepContainer>
          <MainFindContainer>
            <MainInnerBox>
              <MainFindTitle>증권사별 대출상품 찾기</MainFindTitle>
              <div className='flex flex-wrap justify-between px-[8px] md:px-0'>
                {stockValueList.map((item) => (
                  <UnstyledLink
                    key={item.stockId}
                    href={'/product?searchType=stock&stockNm=' + item.stockNm}
                    className='relative mt-[20px] h-[80px] w-[49%] rounded-[10px] bg-white md:h-[110px] md:w-[24%]'
                  >
                    <Image
                      src={item.stockImgUrl}
                      layout='fill'
                      objectFit='contain'
                      alt={item.stockNm}
                      className='rounded-[10px]'
                    />
                  </UnstyledLink>
                ))}
              </div>
            </MainInnerBox>
          </MainFindContainer>
          <MainBannerContainer>
            <MainInnerBox className='h-[100%]'>
              <div className='z-1 md:z-1 absolute right-0 top-[40%] h-[150px] w-[100px] md:top-0 md:h-[100px] md:w-[200px]'>
                <Image
                  src={bannerLogo}
                  layout='fill'
                  objectFit='contain'
                  alt='main_banner'
                />
              </div>
              <MainBannerText1>
                대출가능여부와
                <br />
                대출금액을 빠르게 알려드려요.
              </MainBannerText1>
              <MainBannerText2>
                <MainBannerPoint>{TEL_NUM}</MainBannerPoint>평일 am08:30 -
                pm17:30
              </MainBannerText2>
              <UnstyledLink
                href='/consulting'
                className='z-2 absolute right-0 bottom-[-15%] md:bottom-0'
              >
                <MainBannerButton>상담신청</MainBannerButton>
              </UnstyledLink>
            </MainInnerBox>
          </MainBannerContainer>
          <MainInnerBox>
            <MainNoticeSlider />
          </MainInnerBox>
        </section>
      </main>
    </Layout>
  );
}

// style
// common
const MainInnerBox = tw.div`
max-w-[1180px] w-full mx-auto relative box-border
`;
// main header
const MainViContainer = tw.div`
  bg-[url('/images/main/main_bg.png')] h-full bg-cover pb-[46px]
`;
const MainViContents = tw.div`
text-[#222] relative z-2 layout flex 
flex-col
md:pt-[105px] md:justify-between md:flex-row
`;
const MainViText1 = tw.h3`
mt-[25px] text-[16px] font-bold leading-none 
md:text-[32px] md:leading-[29px]
`;
const MainViText2 = tw.h1`
text-[38px] font-extrabold text-[#274A9E] leading-none
after:content-[''] after:w-[8px] after:h-[8px] after:bg-[#26B7BC] after:inline-block after:rounded-[50%] 
after:ml-[7px] after:mt-[38px] after:align-bottom
md:text-[40px] md:mt-[0px] md:leading-[47px] md:after:mb-[4px]
`;
const MainViText3 = tw.p`
text-[16px] mt-[10px] text-[#3D3D3D] leading-[22px] font-base
md:text-[20px] md:mt-[6px] md:leading-[31px]
`;
const MainButtonLink = tw.button`
w-[100%] h-[28px] mb-[15px] px-[10px] py-[6px]
flex justify-center items-center
text-[#274A9E] text-[13px] font-semibold leading-[16px]
bg-[rgba(255,255,255,0.6)] rounded-[60px] duration-[0.3s]
md:h-[51px]  md:text-[18px] md:p-[15px] md:shadow-[4px_4px_15px_rgba(38,73,157,0.25)]
`;

// main product
const MainProductContainer = tw.div`
relative pb-[147px] bg-[#E1EBFF]
`;
const MainProductTitle = tw.h3`
pt-[115px] pb-[85px] text-[48px] font-bold text-center text-[#222] leading-[58px] 
`;

// main step
const MainStepContainer = tw.div`
relative pt-[110px] pb-[108px]
`;
const MainStepTitle = tw.h3`
pb-[59px] text-[40px] text-[#222] text-center font-bold leading-[48px]
`;
const MainStepCardContainer = tw.div`
flex justify-between flex-col items-center
md:flex-row
`;
const MainStepCard = tw.div`
relative px-[40px] py-[48px] h-auto bg-[#F5F6F8] rounded-[30px] w-[90%] mb-[12px]
md:w-[32%] md:mb-0 md:h-[340px]
`;
const MainStepText1 = tw.p`
text-[18px] font-bold text-[#26499D] leading-[22px]
`;
const MainStepText2 = tw.h4`
mt-[13px] text-[24px] font-bold text-[#222] leading-[29px]
`;
const MainStepText3 = tw.p`
mt-[21px] text-[16px] font-normal text-[#222] leading-[28px]
`;
const MainStepIcon = tw.div`
relative h-[75px] w-[77px] hidden
absolute right-[37px] bottom-[40px]
md:block
`;

// main product
const MainFindContainer = tw.div`
relative bg-[#E3E9F6] pb-[120px] pt-[100px]
`;
const MainFindTitle = tw.h3`
pb-[42px] text-center text-[30px] font-bold leading-[48px] text-[#222]
md:text-[40px]
`;

// main banner
const MainBannerContainer = tw.div`
relative h-[300px] bg-[#26499D] pt-[40px] pb-[65px] px-[8px]
md:px-0 md:pt-[60px]
`;
const MainBannerText1 = tw.h4`
mb-[17px] text-[18px] font-bold text-white z-2 leading-[24px]
md:text-[36px] md:leading-[50px]
`;
const MainBannerText2 = tw.p`
text-[12px] font-normal text-white leading-[19px]
md:text-[16px]
`;
const MainBannerPoint = tw.b`
text-[24px] font-extrabold text-[#26B7BC] mr-[8px] leading-[58px]
md:text-[48px]
`;
const MainBannerButton = tw.span`
inline-block w-[120px] h-[40px] text-[18px] font-bold text-[#26499D] bg-white rounded-[50px] text-center leading-[40px]
md:w-[280px] md:h-[60px] md:leading-[60px]
`;
