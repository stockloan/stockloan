/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosClient from '@/utils/axios';

// ----------------------------------------------------------------------

const STOCKLOAN_ADMIN_BASE_URL = '/api/better';
export const URLS = {
  GET_STOCKLOAN_PRESENT_LIST: '/stockloan/stock/present',
  GET_STOCKLOAN_SEARCHED_LIST: '/stockloan/stock/search/present',
};

// INTERFACE
export interface IStockloanPresent {
  id: number;
  attributes: IPresentAttributes;
  stock?: IPresentStock;
}
export interface IPresentAttributes {
  FC_VLU: string;
  ISN_CD: string;
  ISU_KR_ABBR: string;
  ISU_KR_NM: string;
  ISU_SRT_CD: string;
  LAN_TPE: string; // 대출가능여부
  MRKT_CAP: string;
  MRKT_CD: string;
  RESN_PRCHS: string;
  createdAt: string;
  updatedAt: string;
}
export interface IPresentStock {
  accTrdval: number;
  accTrdvol: number;
  askordPrc_1: number;
  bidordPrc_1: number;
  cmpprevddPrc: number; // 상한가
  cmpprevddRate: number; // 상한율
  cmpprevddTpCd: string;
  hgprc: number;
  isuSrtCd: string;
  lstAskbidTpCd: number;
  lwprc: number;
  opnprc: number;
  trdPrc: number; // 현재가
  trdTm: number;
  trdvol: number;
}
export interface IPagination {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}
// API
export async function getStockloanPresent(searchParams: string, page: number) {
  const { data } = await axiosClient.get(
    STOCKLOAN_ADMIN_BASE_URL + URLS.GET_STOCKLOAN_PRESENT_LIST,
    {
      params: {
        nm: searchParams,
        page: page,
      },
    }
  );
  return data;
}
export async function getSearchedStockloanPresent(searchParams: string) {
  const { data } = await axiosClient.get(
    STOCKLOAN_ADMIN_BASE_URL + URLS.GET_STOCKLOAN_SEARCHED_LIST,
    {
      params: {
        stocks: searchParams,
      },
    }
  );
  return data;
}
