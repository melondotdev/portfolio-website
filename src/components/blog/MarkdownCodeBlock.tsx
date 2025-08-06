'use client';

import { getImageAltText, getOptimizedImageUrl } from '@/lib/utils/images';
import type { HTMLAttributes } from 'react';
import type { Components } from 'react-markdown';
import { CodeBlock } from './CodeBlock';

interface CodeComponentProps extends HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
}

export const markdownComponents: Components = {
  code: ({ inline, className, children, ...props }: CodeComponentProps) => {
    if (inline) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'text';
    const codeContent = String(children).replace(/\n$/, '');

    return (
      <CodeBlock language={language} props={props}>
        {codeContent}
      </CodeBlock>
    );
  },
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-12 mb-6">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mt-10 mb-4">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold mt-8 mb-3">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
  li: ({ children }) => <li className="mb-2">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-accent pl-4 italic my-4">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-accent hover:text-accent/80 underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  img: ({ src, alt }) => {
    const optimizedSrc = getOptimizedImageUrl(src || '');
    const altText = alt || getImageAltText(src || '');

    return (
      <img
        src={optimizedSrc}
        alt={altText}
        className="rounded-lg my-8 w-full h-64 md:h-80 object-cover shadow-lg"
        loading="lazy"
      />
    );
  },
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  pre: ({ children }) => <pre className="my-4">{children}</pre>,
};
