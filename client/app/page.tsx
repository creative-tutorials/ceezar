import { Suspense, lazy } from "react";
import Footer from "@/components/layout/main/footer";
import FeedsSection from "@/components/layout/feed/feeds";
const Sidebar = lazy(() => import("@/components/layout/main/sidebar"));

export default function Page() {
  return (
    <main>
      <section className="h-screen flex">
        <Suspense fallback={<div>Loading</div>}>
          <Sidebar />
        </Suspense>
        <FeedsSection />
      </section>
      <Footer />
    </main>
  );
}
