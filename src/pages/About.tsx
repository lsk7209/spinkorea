import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { CheckCircle2, Shuffle, ShieldCheck, Sparkles } from "lucide-react";

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
    <div className="min-h-[100dvh] bg-neon-bg px-4 py-24 text-gray-300">
      <SEO
        title="SpinFlow 소개 - 무료 결정 도구와 생활 유틸리티"
        description="SpinFlow는 룰렛, 무작위 추첨, 텍스트 도구, 계산기 등 일상 결정과 반복 작업을 돕는 무료 웹 유틸리티 서비스입니다."
        keywords="SpinFlow 소개, 랜덤 결정 도구, 무료 웹 유틸리티, 룰렛, 추첨 도구"
        structuredData={structuredData}
      />

      <main className="mx-auto max-w-4xl">
        <header className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neon-primary">
            <Sparkles size={16} />
            서비스 소개
          </div>
          <h1 className="mb-5 text-4xl font-black text-white md:text-5xl">
            선택을 줄이고 실행을 빠르게 만드는 SpinFlow
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-gray-400">
            SpinFlow는 점심 메뉴, 순서 정하기, 추첨, 숫자 생성, 텍스트 변환,
            날짜 계산처럼 작지만 반복되는 결정을 빠르게 처리하도록 만든 무료
            웹 서비스입니다. 사용자는 회원가입 없이 도구를 열고 바로 사용할 수
            있습니다.
          </p>
        </header>

        <section className="mb-10 grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Shuffle className="mb-4 text-neon-primary" />
            <h2 className="mb-2 text-lg font-bold text-white">결정 도구</h2>
            <p className="text-sm leading-6 text-gray-400">
              룰렛, 주사위, 동전 던지기, 팀 나누기처럼 결과가 필요한 상황에서
              공정하고 간단한 선택 흐름을 제공합니다.
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <CheckCircle2 className="mb-4 text-neon-secondary" />
            <h2 className="mb-2 text-lg font-bold text-white">생활 유틸리티</h2>
            <p className="text-sm leading-6 text-gray-400">
              글자 수 세기, JSON 포맷, 날짜 계산, 단위 변환 등 자주 필요한
              작업을 별도 설치 없이 처리할 수 있게 구성했습니다.
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <ShieldCheck className="mb-4 text-aurora-accent" />
            <h2 className="mb-2 text-lg font-bold text-white">투명한 운영</h2>
            <p className="text-sm leading-6 text-gray-400">
              광고, 분석 도구, 개인정보 처리 범위를 명확히 안내하고 오류
              수정 요청을 받을 수 있는 문의 경로를 공개합니다.
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="mb-5 text-2xl font-bold text-white">운영 원칙</h2>
          <ul className="space-y-3">
            {principles.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-7">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-neon-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/tools"
              className="rounded-full bg-neon-primary px-5 py-3 text-sm font-bold text-black"
            >
              도구 보기
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              문의하기
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
