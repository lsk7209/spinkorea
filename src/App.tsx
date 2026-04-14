import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// 페이지 lazy loading — 초기 번들 분할
const Home = lazy(() => import("@/pages/Home"));
const LunchMenu = lazy(() => import("@/pages/LunchMenu"));
const RandomNumber = lazy(() => import("@/pages/RandomNumber"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const Terms = lazy(() => import("@/pages/Terms"));
const BlogIndex = lazy(() => import("@/pages/BlogIndex"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const ToolsIndex = lazy(() => import("@/pages/ToolsIndex"));
const About = lazy(() => import("@/pages/About"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Contact = lazy(() => import("@/pages/Contact"));
const SpinflowStandalone = lazy(() => import("@/pages/SpinflowStandalone"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// 툴 페이지
const LottoGenerator = lazy(() => import("@/pages/tools/LottoGenerator"));
const DiceRoller = lazy(() => import("@/pages/tools/DiceRoller"));
const CoinFlip = lazy(() => import("@/pages/tools/CoinFlip"));
const YesNoOracle = lazy(() => import("@/pages/tools/YesNoOracle"));
const RandomTeam = lazy(() => import("@/pages/tools/RandomTeam"));
const PasswordGenerator = lazy(() => import("@/pages/tools/PasswordGenerator"));
const TextCounter = lazy(() => import("@/pages/tools/TextCounter"));
const CaseConverter = lazy(() => import("@/pages/tools/CaseConverter"));
const LoremIpsum = lazy(() => import("@/pages/tools/LoremIpsum"));
const JsonFormatter = lazy(() => import("@/pages/tools/JsonFormatter"));
const UriEncoder = lazy(() => import("@/pages/tools/UriEncoder"));
const Base64Encoder = lazy(() => import("@/pages/tools/Base64Encoder"));
const AgeCalculator = lazy(() => import("@/pages/tools/AgeCalculator"));
const BmiCalculator = lazy(() => import("@/pages/tools/BmiCalculator"));
const ColorConverter = lazy(() => import("@/pages/tools/ColorConverter"));
const CssShadowGenerator = lazy(
  () => import("@/pages/tools/CssShadowGenerator"),
);
const DDayCounter = lazy(() => import("@/pages/tools/DDayCounter"));
const DiffChecker = lazy(() => import("@/pages/tools/DiffChecker"));
const MarkdownPreviewer = lazy(() => import("@/pages/tools/MarkdownPreviewer"));
const PercentageCalculator = lazy(
  () => import("@/pages/tools/PercentageCalculator"),
);
const QrCodeGenerator = lazy(() => import("@/pages/tools/QrCodeGenerator"));
const TimeCalculator = lazy(() => import("@/pages/tools/TimeCalculator"));
const UnitConverter = lazy(() => import("@/pages/tools/UnitConverter"));
const UnixTimestamp = lazy(() => import("@/pages/tools/UnixTimestamp"));

const PageLoader = () => (
  <div className="min-h-[100dvh] bg-neon-bg flex items-center justify-center">
    <div className="w-10 h-10 rounded-full border-2 border-aurora-primary border-t-transparent animate-spin" />
  </div>
);

function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<PageLoader />}>
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
          <Route
            path="/tools/random-password"
            element={<PasswordGenerator />}
          />
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
          <Route
            path="/tools/qr-code-generator"
            element={<QrCodeGenerator />}
          />
          <Route path="/tools/time-calculator" element={<TimeCalculator />} />
          <Route path="/tools/unit-converter" element={<UnitConverter />} />
          <Route path="/tools/unix-timestamp" element={<UnixTimestamp />} />

          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
