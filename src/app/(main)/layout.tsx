import { AuthModal } from '@/components/AuthModal';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="pb-24">
        {children}
        <Footer />
      </main>
      <BottomNav />
      <AuthModal />
    </>
  );
}
