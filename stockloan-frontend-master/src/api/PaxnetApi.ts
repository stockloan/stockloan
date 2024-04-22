import { ConsultingRequest } from '@/pages/consulting';
import axiosClient from '@/utils/axios';
// ----------------------------------------------------------------------

const PAXNET_BASE_URL = '/api/paxnet';
export const PAXNET_API_URLS = {
  REQUEST_CONSULTING: '/stock/stockloan/consultAjax',
};

// API

export async function requestConsulting(request: ConsultingRequest) {
  const { data } = await axiosClient.post(
    PAXNET_BASE_URL + PAXNET_API_URLS.REQUEST_CONSULTING,
    getFormData(request)
  );
  return data;
}

function getFormData(request: ConsultingRequest) {
  const form = new FormData();
  form.append('userNm', request.userNm);
  form.append('hp', request.hp);
  form.append('tm', request.tm);
  form.append('sms', request.sms);
  form.append('path', request.path);
  return form;
}

// HOOKS

/* export function useFakePosts(options: QueryOptions = {}) {
  return useQuery(['posts'], getFakePosts, options);
} */
