import MobileHeader from '@/components/MobileHeader';
import { Link } from '@mui/joy';
import { DotIcon } from 'lucide-react';

const About = () => {
  return (
    <section className="@container flex min-h-full w-full max-w-5xl flex-col items-center justify-start pb-8 sm:pt-3 md:pt-6">
      <MobileHeader />
      <div className="w-full px-4 sm:px-6">
        <div className="flex w-full flex-col items-start justify-start rounded-xl bg-white px-4 py-3 text-black shadow dark:bg-zinc-800 dark:text-gray-300">
          <a href="https://www.usememos.com" target="_blank" rel="noreferrer">
            <img
              className="h-12 w-auto"
              src="https://www.usememos.com/full-logo-landscape.png"
              alt="memos"
            />
          </a>
          <p className="text-base">
            A privacy-first, lightweight note-taking service. Easily capture and
            share your great thoughts.
          </p>
          <div className="mt-1 flex flex-row flex-wrap items-center">
            <Link
              underline="always"
              href="https://www.github.com/usememos/memos"
              target="_blank"
            >
              GitHub Repo
            </Link>
            <DotIcon className="h-auto w-4 opacity-60" />
            <Link
              underline="always"
              href="https://www.usememos.com/"
              target="_blank"
            >
              Official Website
            </Link>
            <DotIcon className="h-auto w-4 opacity-60" />
            <Link
              underline="always"
              href="https://www.usememos.com/blog"
              target="_blank"
            >
              Blogs
            </Link>
            <DotIcon className="h-auto w-4 opacity-60" />
            <Link
              underline="always"
              href="https://www.usememos.com/docs"
              target="_blank"
            >
              Documents
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
