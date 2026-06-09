import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col items-center justify-center px-4">
      <SEO
        title="404 - 페이지를 찾을 수 없음 | SpinFlow"
        description="요청한 페이지를 찾을 수 없습니다."
        keywords=""
      />
      <div className="text-center space-y-6 max-w-md">
        <p className="text-8xl font-black text-cyan-600">404</p>
        <h1 className="text-2xl font-bold text-slate-950">페이지를 찾을 수 없습니다</h1>
        <p className="text-slate-500">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/"
            className="inline-block px-8 py-3 rounded-full bg-cyan-700 text-white font-bold hover:bg-cyan-800 transition-all"
          >
            홈으로 돌아가기
          </Link>
          <Link
            to="/tools"
            className="inline-block px-8 py-3 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-all"
          >
            도구 모음 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
