import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import LunchMenu from "@/pages/LunchMenu";
import RandomNumber from "@/pages/RandomNumber";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import BlogIndex from "@/pages/BlogIndex";
import BlogPost from "@/pages/BlogPost";
import ToolsIndex from "@/pages/ToolsIndex";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LottoGenerator from "@/pages/tools/LottoGenerator";
import DiceRoller from "@/pages/tools/DiceRoller";
import CoinFlip from "@/pages/tools/CoinFlip";
import YesNoOracle from "@/pages/tools/YesNoOracle";
import RandomTeam from "@/pages/tools/RandomTeam";
import PasswordGenerator from "@/pages/tools/PasswordGenerator";
import TextCounter from "@/pages/tools/TextCounter";
import CaseConverter from "@/pages/tools/CaseConverter";
import LoremIpsum from "@/pages/tools/LoremIpsum";
import JsonFormatter from "@/pages/tools/JsonFormatter";
import UriEncoder from "@/pages/tools/UriEncoder";
import Base64Encoder from "@/pages/tools/Base64Encoder";
import SpinflowStandalone from "@/pages/SpinflowStandalone";
import AgeCalculator from "@/pages/tools/AgeCalculator";
import BmiCalculator from "@/pages/tools/BmiCalculator";
import ColorConverter from "@/pages/tools/ColorConverter";
import CssShadowGenerator from "@/pages/tools/CssShadowGenerator";
import DDayCounter from "@/pages/tools/DDayCounter";
import DiffChecker from "@/pages/tools/DiffChecker";
import MarkdownPreviewer from "@/pages/tools/MarkdownPreviewer";
import PercentageCalculator from "@/pages/tools/PercentageCalculator";
import QrCodeGenerator from "@/pages/tools/QrCodeGenerator";
import TimeCalculator from "@/pages/tools/TimeCalculator";
import UnitConverter from "@/pages/tools/UnitConverter";
import UnixTimestamp from "@/pages/tools/UnixTimestamp";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spinflow" element={<Home />} />
        <Route path="/spinflow/:slug" element={<Home />} />
        <Route path="/spinflow-standalone" element={<SpinflowStandalone />} />
        <Route path="/lunch-menu" element={<LunchMenu />} />
        <Route path="/random-number" element={<RandomNumber />} />

        <Route path="/tools" element={<ToolsIndex />} />

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

        <Route path="/tools/age-calculator" element={<AgeCalculator />} />
        <Route path="/tools/bmi-calculator" element={<BmiCalculator />} />
        <Route path="/tools/color-converter" element={<ColorConverter />} />
        <Route
          path="/tools/css-shadow-generator"
          element={<CssShadowGenerator />}
        />
        <Route path="/tools/d-day-counter" element={<DDayCounter />} />
        <Route path="/tools/diff-checker" element={<DiffChecker />} />
        <Route
          path="/tools/markdown-previewer"
          element={<MarkdownPreviewer />}
        />
        <Route
          path="/tools/percentage-calculator"
          element={<PercentageCalculator />}
        />
        <Route path="/tools/qr-code-generator" element={<QrCodeGenerator />} />
        <Route path="/tools/time-calculator" element={<TimeCalculator />} />
        <Route path="/tools/unit-converter" element={<UnitConverter />} />
        <Route path="/tools/unix-timestamp" element={<UnixTimestamp />} />

        {/* Batch 2 Complete */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
