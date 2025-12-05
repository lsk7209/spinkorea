import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import LunchMenu from '@/pages/LunchMenu';
import RandomNumber from '@/pages/RandomNumber';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Terms from '@/pages/Terms';
import BlogIndex from '@/pages/BlogIndex';
import BlogPost from '@/pages/BlogPost';
import Footer from '@/components/Footer';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lunch-menu" element={<LunchMenu />} />
        <Route path="/random-number" element={<RandomNumber />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        {/* Fallback for unknown routes */}
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
