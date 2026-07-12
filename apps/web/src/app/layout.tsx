import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Creator Support',
  description: 'Simple help for Instagram, Facebook, and YouTube problems.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
