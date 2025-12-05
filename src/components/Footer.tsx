import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="w-full py-8 px-4 border-t border-neon-primary/20 bg-neon-dark/50 backdrop-blur-sm mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <span className="font-semibold text-neon-primary">SpinFlow</span>
                    <span className="hidden md:inline">|</span>
                    <span>© {new Date().getFullYear()} All Rights Reserved. (v1.2.0)</span>
                </div>

                <div className="flex items-center gap-6">
                    <Link to="/blog" className="hover:text-white transition-colors">
                        블로그
                    </Link>
                    <Link to="/privacy" className="hover:text-white transition-colors">
                        개인정보처리방침
                    </Link>
                    <Link to="/terms" className="hover:text-white transition-colors">
                        이용약관
                    </Link>
                    <a href="mailto:contact@spinflow.pages.dev" className="hover:text-white transition-colors">
                        문의하기
                    </a>
                </div>
            </div>
        </footer>
    );
}
