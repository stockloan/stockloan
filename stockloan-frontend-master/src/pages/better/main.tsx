/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  styled,
} from '@mui/material';
import _ from 'lodash';
import Image from 'next/image';
import * as React from 'react';
import { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components';

import Layout from '@/components/layout/Layout';
import UnstyledLink from '@/components/links/UnstyledLink';
import MainBetterSlider from '@/components/main/MainBetterSlider';

import { useAppDispatch } from '@/store/hook';
import { setIsEnterBetter } from '@/store/slice/better';

import {
  getStockList,
  getStockloanProducts,
  getTagList,
} from '@/api/BetterApi';
import { IconArrowDown } from '@/assets/icon/IconArrowDown';
import { IconArrowNext } from '@/assets/icon/IconArrowNext';
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

// ----------------------------------------------------------------------

export default function BetterMain() {
  const [stockValueList, setStockValueList] = useState<IStock[]>([]);
  const [tagKeyValueList, setTagKeyValueList] = useState<IKeyValue[]>([]);
  const [tagProducts, setTagProducts] = useState<ITagProduct[]>([]);
  const [mainProducts, setMainProducts] = useState<IProduct[]>([]);
  const dispatch = useAppDispatch();

  const setEnterBetter = () => {
    dispatch(setIsEnterBetter(true));
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
  }, []);
  return (
    <Layout>
      <div className='mx-auto w-full max-w-[425px]'>
        <div className='betterCard-shadow mx-[18px] mt-[30px] mb-[20px] rounded-[12px] bg-white py-[32px] text-center'>
          <h1 className='mb-[16px] text-[21px] text-[#33374D]'>
            팍스넷 스탁론의 새로운시작.
            <br />
            수수료 부담없이 이용하세요
          </h1>
          <UnstyledLink href='/stock'>
            <button className='betterButton'>대출가능 종목 검색</button>
          </UnstyledLink>
        </div>
        <div className='px-[20px] pb-[86px]'>
          <MainBetterSlider tagProduct={tagProducts} />
        </div>
        <div className='mb-[40px] bg-[#F1F5F9] px-[20px] pt-[52px] pb-[30px] text-center '>
          <h1 className='mb-[8px] text-[22px] text-[#33374D]'>
            증권사별 대출상품
          </h1>
          <p className='mb-[25px] text-[16px] text-[#858794]'>
            증권사별 상품을 빠르게 찾아보세요
          </p>
          <span className='text-[14px] font-medium text-[#2E9BFF]'>
            <UnstyledLink href='/product'>상품 전체 보기 &gt;</UnstyledLink>
          </span>
          <div className='mt-[30px] flex flex-wrap justify-between'>
            {stockValueList.map((item) => (
              <UnstyledLink
                key={item.stockId}
                href={'/product?searchType=stock&stockNm=' + item.stockNm}
                className='relative mb-[10px] h-[80px] w-[32%] rounded-[10px] bg-white'
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
        </div>
        <div className='pb-[40px]'>
          <UnstyledLink href='/notice'>
            <BetterAccordion disabled style={{ backgroundColor: '#fff' }}>
              <AccordionSummary
                expandIcon={<IconArrowNext className='h-[15px] w-[15px]' />}
                aria-controls='panel1a-content'
                style={{ padding: '0 20px' }}
              >
                <p className='test-[#33374D] text-[16px]'>공지/안내</p>
              </AccordionSummary>
            </BetterAccordion>
          </UnstyledLink>
          <BetterAccordion>
            <AccordionSummary
              expandIcon={<IconArrowDown className='h-[15px] w-[15px]' />}
              aria-controls='panel1a-content'
              style={{ padding: '0 20px' }}
            >
              <p className='test-[#33374D] text-[16px]'>스탁론 진행절차</p>
            </AccordionSummary>
            <AccordionDetails className='bg-[#EBF5FF]'>
              <div className='flex items-center px-[4px] pt-[12px] pb-[4px]'>
                <IndexCircle>1</IndexCircle>
                <div>
                  <h3 className='text-[14px] leading-[21px] text-[#33374D]'>
                    상담
                  </h3>
                  <p className='text-[12px] leading-[18px] text-[#858794]'>
                    전화/채팅 상담으로 맞춤형 대출상품 안내
                    <br />
                    <span className='text-[#2E9BFF]'>상담전화</span>{' '}
                    <span className='text-[#D6D7DB]'>|</span>{' '}
                    <a href='tel:1544-8125'>
                      <span className='text-[#2E9BFF]'>1544-8125</span>
                    </a>
                  </p>
                </div>
              </div>
              <div className='mt-[4px] flex items-center px-[4px] pt-[12px] pb-[4px]'>
                <IndexCircle>2</IndexCircle>
                <div>
                  <h3 className='text-[14px] leading-[21px] text-[#33374D]'>
                    신청
                  </h3>
                  <p className='text-[12px] leading-[18px] text-[#858794]'>
                    온라인으로 상품약관동의 후 대출신청 진행
                    <br />* 영업시간 내 신청가능 (08:00-15:30)
                  </p>
                </div>
              </div>
              <div className='mt-[4px] flex items-center px-[4px] pt-[12px] pb-[4px]'>
                <IndexCircle>3</IndexCircle>
                <div>
                  <h3 className='text-[14px] leading-[21px] text-[#33374D]'>
                    입금
                  </h3>
                  <p className='text-[12px] leading-[18px] text-[#858794]'>
                    대출신청이 완료되면 해당 증권계좌로 대출금 바로 입금
                    <br />* 계좌가 없다면 신규계좌 개설 필요
                  </p>
                </div>
              </div>
            </AccordionDetails>
          </BetterAccordion>
        </div>
        <div className='bg-[#F1F5F9] py-[32px] px-[20px]'>
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
              <p className='text-[13px] text-[#858794]'>평일 08:30 ~ 17:30</p>
            </div>
            <UnstyledLink href='/consulting'>
              <button className='betterButton'>상담 신청하기</button>
            </UnstyledLink>
          </div>
        </div>
      </div>
    </Layout>
  );
}
// style
const BetterAccordion = styled((props: AccordionProps) => (
  <Accordion disableGutters elevation={0} square {...props} />
))(() => ({
  marginTop: 0,
  backgroundColor: '#ffffff',
  border: `unset`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const IndexCircle = tw.div`
h-[24px] w-[24px] rounded-[64px] bg-[#2E9BFF] mr-[8px]
flex items-center justify-center text-white
`;
