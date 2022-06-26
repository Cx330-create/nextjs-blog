import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';
import type { IPosts } from '../types';

const postsDirectory = join(process.cwd(), '_posts');

export function getPosts(): IPosts[] {
  try {
    return fs.readdirSync(postsDirectory).map(fileName => {
      const fullPath = join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { content } = matter(fileContents);
      return {
        title: fileName.replace(/\.md$/, ''),
        description: content.match(/<description hidden>(.*)<\/description>/)![1],
      };
    });
  } catch (e) {
    return [];
  }
}

export function getPostByTitle(title: string) {
  const fullPath = join(postsDirectory, `${title}.md`);
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    return content.replace(/<description hidden>(.*)<\/description>/, '');
  } catch (e) {
    return '哎呀，好像出错了';
  }
}
