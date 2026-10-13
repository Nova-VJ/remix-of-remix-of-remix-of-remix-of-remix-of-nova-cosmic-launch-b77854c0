// Server-side render of the top of the home page (menu + hero), built by
// vite.shell.config.ts and written into dist/index.html by scripts/prerender-seo.mjs.
// Visitors see real content before the JavaScript arrives, and crawlers read the
// headline. The app replaces this markup with the same components when it starts.
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';

export function render() {
  return renderToString(
    <AuthProvider>
      <StaticRouter location="/">
        <main className="relative pb-20 md:pb-0">
          <Navbar />
          <HeroSection />
        </main>
      </StaticRouter>
    </AuthProvider>
  );
}
