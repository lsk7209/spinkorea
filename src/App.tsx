import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import LunchMenu from '@/pages/LunchMenu';
import RandomNumber from '@/pages/RandomNumber';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Terms from '@/pages/Terms';
import BlogIndex from '@/pages/BlogIndex';
import BlogPost from '@/pages/BlogPost';
import Footer from '@/components/Footer';
import LottoGenerator from '@/pages/tools/LottoGenerator';
import DiceRoller from '@/pages/tools/DiceRoller';
import CoinFlip from '@/pages/tools/CoinFlip';
import YesNoOracle from '@/pages/tools/YesNoOracle';
import RandomTeam from '@/pages/tools/RandomTeam';
import PasswordGenerator from '@/pages/tools/PasswordGenerator';
import TextCounter from '@/pages/tools/TextCounter';
import CaseConverter from '@/pages/tools/CaseConverter';
import LoremIpsum from '@/pages/tools/LoremIpsum';
import JsonFormatter from '@/pages/tools/JsonFormatter';
import UriEncoder from '@/pages/tools/UriEncoder';
import Base64Encoder from '@/pages/tools/Base64Encoder';
import SpinflowStandalone from '@/pages/SpinflowStandalone';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spinflow-standalone" element={<SpinflowStandalone />} />
        <Route path="/lunch-menu" element={<LunchMenu />} />
        <Route path="/random-number" element={<RandomNumber />} />
        <Route path="/tools/lotto-generator" element={<LottoGenerator />} />
        <Route path="/tools/dice-roller" element={<DiceRoller />} />
        <Route path="/tools/coin-flip" element={<CoinFlip />} />
        <Route path="/tools/yes-no-oracle" element={<YesNoOracle />} />
        <Route path="/tools/random-team" element={<RandomTeam />} />
        <Route path="/tools/random-password" element={<PasswordGenerator />} />
        <Route path="/tools/text-counter" element={<TextCounter />} />
        <Route path="/tools/case-converter" element={<CaseConverter />} />
        <Route path="/tools/lorem-ipsum" element={<LoremIpsum />} />
        <Route path="/tools/json-formatter" element={<JsonFormatter />} />
        <Route path="/tools/uri-encoder" element={<UriEncoder />} />
        <Route path="/tools/base64-encoder" element={<Base64Encoder />} />
        {/* Batch 2 Complete */}
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
