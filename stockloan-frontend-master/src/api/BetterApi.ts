/* eslint-disable @typescript-eslint/no-explicit-any */
import qs from 'qs';

import axiosClient from '@/utils/axios';
import { CommonUtil } from '@/utils/commonUtil';

import { INotice, INoticeBoard } from '@/types/notice';
import { ISearchParams } from '@/types/product';

// ----------------------------------------------------------------------

const BETTER_ADMIN_BASE_URL = '/api/better';
export const URLS = {
  GET_STOCKLOAN_PRODUCT_LIST: '/bo-stockloan-gds-mngs',
  GET_TAG_LIST: '/bo-stockloan-gds-grp-mngs',
  GET_STOCK_LIST: '/bo-stockloan-org-mngs',
  GET_CODE_LIST: '/bo-stockloan-cd-mngs',
  GET_NTC_LIST: '/bo-stockloan-ntc-mngs',
};
// API
export async function getStockloanProducts(searchParams: ISearchParams) {
  const { data } = await axiosClient.get(
    BETTER_ADMIN_BASE_URL + URLS.GET_STOCKLOAN_PRODUCT_LIST,
    {
      params: searchParams,
      paramsSerializer: (searchParams: ISearchParams) =>
        productApiParamsSerializer(searchParams),
    }
  );
  return data;
}

function productApiParamsSerializer(searchParams: ISearchParams) {
  return qs.stringify(
    {
      populate: '*',
      sort: ['INQRY_PRRTY', 'GDS_NM'],
      pagination: {
        page: searchParams.page,
        pageSize: searchParams.countPerPage,
      },
      filters: {
        $and: [
          {
            $or: [
              { stock_org: { ORG_NM: { $contains: searchParams.keyword } } },
              { finance_org: { CD_NM: { $contains: searchParams.keyword } } },
            ],
          },
          { gds_grp: { id: { $eq: searchParams.tagId } } },
          { IS_MN_FRQNTLY: { $eq: searchParams.isMnFrqntly } },
          { IS_MN_GDS: { $eq: searchParams.isMnGds } },
          { id: { $eq: searchParams.productId } },
          { stock_org: { id: { $in: searchParams.stockCompanyIds } } },
          { finance_org: { id: { $in: searchParams.financialCompanyIds } } },
          { gds_type: { id: { $in: searchParams.productTypeIds } } },
          { rate_type: { id: { $in: searchParams.interestRateTypeIds } } },
          { con_rate: { id: { $in: searchParams.focusInvestRateIds } } },
          { period: { id: { $in: searchParams.loanTermIds } } },
          { gds_grp: { id: { $in: searchParams.tagIds } } },
        ],
      },
    },
    {
      arrayFormat: 'indices',
      charset: 'utf-8',
      encodeValuesOnly: true,
      filter: (prefix: string, value: any) => {
        if (CommonUtil.isEmpty(value)) return;
        return value;
      },
    }
  );
}

export async function getStockList() {
  const { data } = await axiosClient.get(
    BETTER_ADMIN_BASE_URL + URLS.GET_STOCK_LIST,
    {
      params: {
        'pagination[pageSize]': 100,
      },
    }
  );
  return data;
}

export async function getTagList() {
  const { data } = await axiosClient.get(
    BETTER_ADMIN_BASE_URL + URLS.GET_TAG_LIST,
    {
      params: {
        'pagination[pageSize]': 100,
      },
    }
  );
  return data;
}

export async function getCodeList() {
  const { data } = await axiosClient.get(
    BETTER_ADMIN_BASE_URL + URLS.GET_CODE_LIST,
    {
      params: {
        'pagination[pageSize]': 100,
      },
    }
  );
  return data;
}

export async function getNoticeList() {
  const { data } = await axiosClient.get(
    BETTER_ADMIN_BASE_URL + URLS.GET_NTC_LIST
  );
  return data;
}
export async function getNotice(id: number) {
  const { data } = await axiosClient.get(
    BETTER_ADMIN_BASE_URL + URLS.GET_NTC_LIST
  );
  const index = data.data.findIndex((item: INotice) => {
    return item.id === id;
  });

  const noticeList: INoticeBoard = {
    current: data.data[index],
  };
  if (index > 0) noticeList.prev = data.data[index - 1];
  if (index < data.data.length - 1) noticeList.next = data.data[index + 1];

  return noticeList;
}
