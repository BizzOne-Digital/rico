export const dynamic = "force-dynamic";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { PublicClientWrapper } from "@/components/layout/PublicClientWrapper";
import { connectDB } from "@/lib/db";
import { getSiteSettings } from "@/models";

export default async function PublicLayout({ children }: LayoutProps<"/">) {
  let announcement: string | undefined;
  try {
    await connectDB();
    const settings = await getSiteSettings();
    announcement = settings.announcement;
  } catch {
    announcement = undefined;
  }

  return (
    <PublicClientWrapper>
      <SiteHeader announcement={announcement} />
      <main className="site-main flex-1 min-w-0 w-full max-w-full overflow-x-clip">{children}</main>
      <Footer />
    </PublicClientWrapper>
  );
}
