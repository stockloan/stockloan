import { map } from 'lodash';
import * as React from 'react';

import Layout from '@/components/layout/Layout';
import UnderlineLink from '@/components/links/UnderlineLink';
import Seo from '@/components/Seo';

import { getFakePosts, IPost, useFakePosts } from '@/api/example';

// import { getFakePosts } from ''
import Vercel from '~/svg/Vercel.svg';

// ----------------------------------------------------------------------

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

interface Props {
  posts: IPost[];
}

export default function HomePage({ posts }: Props) {
  const { data } = useFakePosts();
  // eslint-disable-next-line no-console
  console.log('data >>> ', data);

  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('posts ', posts);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo templateTitle='Posts' />

      <main>
        <section className='bg-white'>
          <div className='layout flex min-h-screen flex-col items-center justify-center text-center'>
            <Vercel className='text-5xl' />
            <h1 className='mt-4'>Posts</h1>
            <p className='mt-2 text-sm text-gray-800'>
              A starter for Next.js, Tailwind CSS, and TypeScript with Absolute
              Import, Seo, Link component, pre-configured with Husky{' '}
            </p>

            {map(data as IPost[], (item) => (
              <div key={item.id} style={{ marginTop: '15px' }}>
                <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                <div>{item.body}</div>
              </div>
            ))}

            <footer className='absolute bottom-2 text-gray-700'>
              © {new Date().getFullYear()} By{' '}
              <UnderlineLink href='/'>Gitple</UnderlineLink>
            </footer>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export async function getServerSideProps() {
  const postsFromServer = await getFakePosts();
  return {
    props: { posts: postsFromServer }, // will be passed to the page component as props
  };
}
