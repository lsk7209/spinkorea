import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-neon-bg flex flex-col items-center justify-center px-4">
      <SEO
        title="404 - 페이지를 찾을 수 없음 | SpinFlow"
        description="요청한 페이지를 찾을 수 없습니다."
        keywords=""
      />
      <div className="text-center space-y-6">
        <p className="text-8xl font-black text-gradient">404</p>
        <h1 className="text-2xl font-bold text-white">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-gray-400">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Link
          to="/"
          className="inline-block mt-4 px-8 py-3 rounded-2xl bg-gradient-to-r from-aurora-primary to-aurora-secondary text-white font-bold hover:opacity-90 transition-opacity"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
