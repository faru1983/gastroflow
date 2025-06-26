import { AuthModal } from '@/components/AuthModal';
import { BottomNav } from '@/components/BottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="pb-24">{children}</main>
      <BottomNav />
      <AuthModal />
    </>
  );
}
