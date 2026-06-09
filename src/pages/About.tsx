import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { CheckCircle2, Shuffle, ShieldCheck, Wallet } from "lucide-react";

const SITE_ORIGIN = "https://www.spinkorea.kr";

const principles = [
  "무료로 사용할 수 있는 생활형 결정 도구와 계산 도구를 제공합니다.",
  "도구 결과가 절대적인 정답이 아니라 판단을 돕는 참고 정보임을 명확히 안내합니다.",
  "개인정보를 최소한으로 처리하고, 광고와 분석 서비스 사용 여부를 공개합니다.",
  "오류 제보와 개선 요청을 받을 수 있는 연락 경로를 유지합니다.",
];

export default function About() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "SpinFlow 소개",
    description:
      "SpinFlow는 선택을 빠르게 정리하는 랜덤 결정 도구와 일상 계산 유틸리티를 제공하는 무료 웹 서비스입니다.",
    url: `${SITE_ORIGIN}/about`,
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 text-slate-950 flex flex-col">
      <SEO
        title="SpinFlow 소개 | 무료 결정 도구·생활 유틸리티 33종"
        description="SpinFlow는 룰렛, 시급·대출·전월세·복리 계산기, 글자수 세기 등 일상 결정과 반복 작업을 돕는 무료 웹 유틸리티 서비스입니다."
        keywords="SpinFlow 소개, 랜덤 결정 도구, 무료 웹 유틸리티, 연봉실수령액계산기, 시급계산기, 대출계산기, 전월세계산기, 복리계산기, 퇴직금계산기, 연차계산기"
        structuredData={structuredData}
      />

      <header className="w-full px-4 pt-28 pb-12 border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-bold text-cyan-700 mb-3 uppercase tracking-widest">About SpinFlow</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-950 mb-5">
            선택을 줄이고 실행을 빠르게 만드는 SpinFlow
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            SpinFlow는 점심 메뉴, 순서 정하기, 추첨, 시급·대출·전월세 계산처럼
            작지만 반복되는 결정을 빠르게 처리하도록 만든 무료 웹 서비스입니다.
            회원가입 없이 도구를 열고 바로 사용할 수 있습니다.
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 space-y-10">
        {/* 카드 3종 */}
        <section className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: <Shuffle className="text-cyan-700" size={24} />,
              title: "결정 도구",
              desc: "룰렛, 주사위, 동전 던지기, 팀 나누기처럼 결과가 필요한 상황에서 공정하고 간단한 선택 흐름을 제공합니다.",
            },
            {
              icon: <Wallet className="text-amber-600" size={24} />,
              title: "생활 금융·유틸리티",
              desc: "시급·대출·전월세·복리·퇴직금·연차·실수령액 계산기, 글자수, JSON, QR 등 33가지 도구를 설치 없이 바로 이용합니다.",
            },
            {
              icon: <ShieldCheck className="text-green-600" size={24} />,
              title: "투명한 운영",
              desc: "광고, 분석 도구, 개인정보 처리 범위를 명확히 안내하고 오류 수정 요청을 받을 수 있는 연락 경로를 공개합니다.",
            },
          ].map(({ icon, title, desc }) => (
            <article key={title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="mb-4">{icon}</div>
              <h2 className="text-base font-bold text-slate-950 mb-2">{title}</h2>
              <p className="text-sm leading-6 text-slate-500">{desc}</p>
            </article>
          ))}
        </section>

        {/* 운영 원칙 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950 mb-5">운영 원칙</h2>
          <ul className="space-y-3">
            {principles.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-7 text-slate-600">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-cyan-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/tools" className="rounded-full bg-cyan-700 px-5 py-3 text-sm font-bold text-white hover:bg-cyan-800 transition-all">
              도구 보기
            </Link>
            <Link to="/contact" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all">
              문의하기
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
