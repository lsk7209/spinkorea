import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Clock, Github, Mail, MessageSquare } from "lucide-react";

const SITE_ORIGIN = "https://www.spinkorea.kr";

export default function Contact() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "SpinFlow 문의하기",
    description:
      "SpinFlow 서비스 제안, 오류 제보, 개인정보 문의, 광고 및 제휴 문의를 받는 공식 연락 페이지입니다.",
    url: `${SITE_ORIGIN}/contact`,
  };

  return (
    <div className="min-h-[100dvh] bg-neon-bg px-4 py-24 text-gray-300">
      <SEO
        title="문의하기 - SpinFlow"
        description="SpinFlow의 오류 제보, 기능 제안, 개인정보 문의, 광고 및 제휴 문의를 위한 공식 연락 페이지입니다."
        keywords="SpinFlow 문의, 오류 제보, 서비스 제안, 개인정보 문의, 제휴 문의"
        structuredData={structuredData}
      />

      <main className="mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-neon-primary/20">
            <MessageSquare className="text-neon-primary" size={32} />
          </div>
          <h1 className="mb-4 text-4xl font-black text-white">문의하기</h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-gray-400">
            SpinFlow 도구 사용 중 발견한 오류, 콘텐츠 정정 요청, 개인정보 관련
            문의, 광고 및 제휴 제안은 아래 연락 경로로 보내주세요.
          </p>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Github className="mb-4 text-neon-primary" />
            <h2 className="mb-2 text-lg font-bold text-white">GitHub Issues</h2>
            <a
              href="https://github.com/lsk7209/spinkorea/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm font-semibold text-neon-primary hover:underline"
            >
              github.com/lsk7209/spinkorea/issues
            </a>
            <p className="mt-4 text-sm leading-6 text-gray-400">
              기능 오류, 오타, 계산 결과 이상, 개선 제안은 가능한 한 관련 URL과
              재현 방법을 함께 남겨주세요.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Mail className="mb-4 text-neon-secondary" />
            <h2 className="mb-2 text-lg font-bold text-white">운영 문의</h2>
            <p className="text-sm leading-6 text-gray-400">
              개인정보 처리, 광고 노출, 제휴 문의처럼 공개 이슈에 적기 어려운
              내용은 사이트 운영자가 확인할 수 있는 연락 채널을 통해 검토합니다.
              문의에는 관련 페이지 주소와 요청 목적을 포함해 주세요.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Clock className="mb-4 text-aurora-accent" />
            <h2 className="mb-2 text-lg font-bold text-white">응답 기준</h2>
            <p className="text-sm leading-6 text-gray-400">
              일반 문의는 평일 기준으로 순차 검토합니다. 서비스 장애, 명백한
              개인정보 문제, 잘못된 광고 표시 등 이용자 보호와 관련된 문의는
              우선 확인합니다.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <MessageSquare className="mb-4 text-white" />
            <h2 className="mb-2 text-lg font-bold text-white">문의 전 확인</h2>
            <p className="text-sm leading-6 text-gray-400">
              개인정보 처리 방식은 <Link to="/privacy" className="text-neon-primary hover:underline">개인정보처리방침</Link>,
              서비스 이용 조건은 <Link to="/terms" className="text-neon-primary hover:underline">이용약관</Link>에
              정리되어 있습니다.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
