/* eslint-disable @typescript-eslint/no-explicit-any */

import { IallianceData } from '@/store/slice/alliance';

import axiosClient from '@/utils/axios';

// ----------------------------------------------------------------------

const STOCKLOAN_ADMIN_BASE_URL = '/api/better';
export const URLS = {
  GET_STOCKLOAN_ALLIANCE: '/stockloan/alliance/',
};

// INTERFACE
export interface Ialliance {
  attributes: IallianceData;
}

// API
export async function getStockloanAlliance(code: string) {
  const { data } = await axiosClient.get(
    STOCKLOAN_ADMIN_BASE_URL + URLS.GET_STOCKLOAN_ALLIANCE + `/${code}`
  );
  return data;
}
