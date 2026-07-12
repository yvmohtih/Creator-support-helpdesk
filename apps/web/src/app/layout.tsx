import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Creator Support',
  description: 'Social media support platform foundation.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
