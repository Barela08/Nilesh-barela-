import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HackifyPro Control Center | Admin Portal',
  description: 'HackifyPro authorized administrative management portal and CRM.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
