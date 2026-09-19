import SEO from "@/components/SEO";
import guidance from "@/data/site-guidance.json";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-[100dvh] bg-slate-50 text-slate-950 flex flex-col">
      <SEO
        title="개인정보처리방침 - SpinFlow"
        description="SpinFlow의 개인정보 수집 항목, 이용 목적, 쿠키와 광고 서비스, Google Analytics 및 AdSense 사용 안내입니다."
        keywords="SpinFlow 개인정보처리방침, 개인정보보호, Google Analytics, Google AdSense, 쿠키"
      />

      <header className="w-full px-4 pt-28 pb-12 border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-bold text-cyan-700 mb-3 uppercase tracking-widest">Privacy Policy</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-950 mb-4">개인정보처리방침</h1>
          <p className="text-slate-500 text-sm">최종 업데이트: 2026년 9월 20일</p>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-8 prose prose-slate max-w-none prose-headings:text-slate-950 prose-p:text-slate-600 prose-li:text-slate-600 prose-a:text-cyan-700">
          <p>
            SpinFlow는 회원가입 없이 사용할 수 있는 무료 웹 유틸리티 서비스입니다.
            이용자의 개인정보를 최소한으로 처리하며, 서비스 운영과 품질 개선에
            필요한 범위에서만 분석 및 광고 관련 기술을 사용할 수 있습니다.
          </p>

          <section>
            <h2>1. 수집될 수 있는 정보</h2>
            <ul>
              <li>방문 페이지, 유입 경로, 체류 시간, 브라우저 유형 등 방문 분석 정보</li>
              <li>기기 종류, 운영체제, 화면 크기 등 서비스 품질 점검에 필요한 기술 정보</li>
              <li>문의 또는 오류 제보 시 사용자가 직접 제공한 연락 정보와 문의 내용</li>
            </ul>
            <p>{guidance.privacy.inputProcessing}</p>
          </section>

          <section>
            <h2>2. 이용 목적</h2>
            <ul>
              <li>서비스 제공, 오류 진단, 보안 점검</li>
              <li>도구 사용성 개선과 콘텐츠 품질 개선</li>
              <li>광고 노출, 트래픽 분석, 악성 이용 방지</li>
              <li>문의 대응과 정정 요청 처리</li>
            </ul>
          </section>

          <section>
            <h2>3. 쿠키와 제3자 서비스</h2>
            <p>{guidance.privacy.thirdParty}</p>
            <p>{guidance.privacy.controls}</p>
            <ul>{guidance.privacy.links.map(link => <li key={link.url}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a></li>)}</ul>
          </section>

          <section>
            <h2>4. 보관과 파기</h2>
            <p>
              문의 기록은 답변과 분쟁 방지에 필요한 기간 동안 보관될 수 있으며,
              목적이 달성되면 삭제하거나 식별이 어려운 형태로 관리합니다. 분석
              데이터의 보관 기간은 각 제3자 서비스의 정책을 따릅니다.
            </p>
          </section>

          <section>
            <h2>5. 이용자의 권리</h2>
            <p>
              이용자는 개인정보 열람, 정정, 삭제, 처리 중지를 요청할 수 있습니다.
            </p>
            <p>{guidance.privacy.rightsContact}</p>
          </section>

          <section>
            <h2>6. 방침 변경</h2>
            <p>
              법령, 서비스 구조, 광고 및 분석 도구 변경에 따라 본 방침이 수정될 수
              있습니다. 중요한 변경 사항은 사이트 내에서 확인할 수 있도록 반영합니다.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
