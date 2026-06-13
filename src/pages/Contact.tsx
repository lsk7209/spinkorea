import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Clock, Github, Mail, MessageSquare } from "lucide-react";

const SITE_ORIGIN = "https://spinkorea.kr";

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
    <div className="min-h-[100dvh] bg-slate-50 text-slate-950 flex flex-col">
      <SEO
        title="문의하기 | SpinFlow"
        description="SpinFlow의 오류 제보, 기능 제안, 개인정보 문의, 광고 및 제휴 문의를 위한 공식 연락 페이지입니다."
        keywords="SpinFlow 문의, 오류 제보, 서비스 제안, 개인정보 문의, 제휴 문의"
        structuredData={structuredData}
      />

      <header className="w-full px-4 pt-28 pb-12 border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-bold text-cyan-700 mb-3 uppercase tracking-widest">Contact</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-950 mb-4">문의하기</h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600">
            도구 오류, 콘텐츠 정정 요청, 개인정보 문의, 광고·제휴 제안은 아래 연락 경로로 보내주세요.
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            {
              icon: <Github className="text-slate-800" size={24} />,
              title: "GitHub Issues",
              content: (
                <>
                  <a
                    href="https://github.com/lsk7209/spinkorea/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-sm font-semibold text-cyan-700 hover:underline"
                  >
                    github.com/lsk7209/spinkorea/issues
                  </a>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    기능 오류, 오타, 계산 결과 이상, 개선 제안은 가능한 한 관련 URL과 재현 방법을 함께 남겨주세요.
                  </p>
                </>
              ),
            },
            {
              icon: <Mail className="text-cyan-700" size={24} />,
              title: "운영 문의",
              content: (
                <p className="text-sm leading-6 text-slate-500">
                  개인정보 처리, 광고 노출, 제휴 문의처럼 공개 이슈에 적기 어려운 내용은 사이트 운영자가 확인할 수 있는 연락 채널을 통해 검토합니다. 관련 페이지 주소와 요청 목적을 포함해 주세요.
                </p>
              ),
            },
            {
              icon: <Clock className="text-amber-600" size={24} />,
              title: "응답 기준",
              content: (
                <p className="text-sm leading-6 text-slate-500">
                  일반 문의는 평일 기준으로 순차 검토합니다. 서비스 장애, 명백한 개인정보 문제, 잘못된 광고 표시 등 이용자 보호와 관련된 문의는 우선 확인합니다.
                </p>
              ),
            },
            {
              icon: <MessageSquare className="text-green-600" size={24} />,
              title: "문의 전 확인",
              content: (
                <p className="text-sm leading-6 text-slate-500">
                  개인정보 처리 방식은{" "}
                  <Link to="/privacy" className="text-cyan-700 hover:underline font-medium">개인정보처리방침</Link>,
                  서비스 이용 조건은{" "}
                  <Link to="/terms" className="text-cyan-700 hover:underline font-medium">이용약관</Link>에
                  정리되어 있습니다.
                </p>
              ),
            },
          ].map(({ icon, title, content }) => (
            <article key={title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="mb-4">{icon}</div>
              <h2 className="text-base font-bold text-slate-950 mb-3">{title}</h2>
              {content}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
