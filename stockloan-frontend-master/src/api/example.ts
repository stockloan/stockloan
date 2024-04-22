import { QueryOptions, useQuery } from '@tanstack/react-query';

import axiosClient from '@/utils/axios';

// ----------------------------------------------------------------------

export const URLS = {
  // GET
  FAKE_POSTS: 'https://jsonplaceholder.typicode.com/posts',
};

export interface IPost {
  id: number;
  userId: number;
  title: string;
  body: string;
}

// API

export async function getFakePosts() {
  const { data } = await axiosClient.get<IPost[]>(URLS.FAKE_POSTS);
  return data;
}


// HOOKS

export function useFakePosts(options: QueryOptions = {}) {
  return useQuery(['posts'], getFakePosts, options);
}
