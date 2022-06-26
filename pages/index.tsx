/* @jsxImportSource @emotion/react */
import Head from 'next/head';
import Link from 'next/link';
import { Container, Box, Avatar, List, ListItemButton, ListSubheader, ListItemText } from '@mui/material';
import { getPosts } from '../lib/api';
import { IPosts } from '../types';
import type { FC, ReactElement } from 'react';

interface IProps {
  posts: IPosts[];
}

const Home: FC<IProps> = ({ posts }): ReactElement => {
  return (
    <>
      <Head>
        <title>7777zzz-blog</title>
        <meta name='description' content='7777zzz-blog' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1rem',
          fontSize: ' 2.25rem',
          fontStyle: 'italic',
          fontWeight: '700',
          lineHeight: '2.5rem',
          backgroundColor: 'rgba(240, 240, 240, 0.6)',
        }}
      >
        <Avatar alt='avatar' src='/images/7777zzz.jpg' sx={{ width: 80, height: 80 }} />
        <span>Welcome,This is an unknown front-end space</span>
      </Box>
      <Container maxWidth='md'>
        <List
          sx={{
            overflow: 'auto',
            width: '100%',
            height: '70vh',
          }}
          component='nav'
          aria-labelledby='nested-list-subheader'
        >
          {posts.map(post => {
            return (
              <Link href={`/post/${post.title}`} key={post.description}>
                <ListItemButton sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                  <ListItemText
                    primary={
                      <>
                        <h1
                          css={{
                            fontWeight: '600',
                          }}
                        >
                          {post.title}
                        </h1>
                        <p
                          css={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            marginTop: '0.5rem',
                            color: '#86909c',
                          }}
                        >
                          {post.description}
                        </p>
                      </>
                    }
                  />
                </ListItemButton>
              </Link>
            );
          })}
        </List>
      </Container>
    </>
  );
};

export default Home;

export const getStaticProps = async () => {
  const posts = getPosts();
  return {
    props: { posts },
  };
};
