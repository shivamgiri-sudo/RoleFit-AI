import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RoleFit AI',
  description: 'AI-assisted hiring with trait intelligence and role-fit scoring',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
