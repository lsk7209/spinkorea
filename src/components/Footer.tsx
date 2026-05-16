import { Link } from 'react-router-dom';

const mainNav = [
    { name: '룰렛돌리기', path: '/' },
    { name: '유틸리티 도구', path: '/tools' },
    { name: '블로그', path: '/blog' },
    { name: '소개', path: '/about' },
];

const subNav = [
    { name: 'FAQ', path: '/faq' },
    { name: '문의하기', path: '/contact' },
    { name: '개인정보처리방침', path: '/privacy' },
    { name: '이용약관', path: '/terms' },
];

export default function Footer() {
    return (
        <footer className="w-full border-t border-gray-200 bg-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* 메인 네비게이션 */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <Link to="/" className="text-xl font-black text-gray-900">
                        SpinKorea
                    </Link>
                    <nav className="flex flex-wrap gap-x-6 gap-y-2">
                        {mainNav.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* 구분선 */}
                <div className="my-6 border-t border-gray-100" />

                {/* 하단 서브 메뉴 + 카피라이트 */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} SpinKorea. All Rights Reserved.
                    </p>
                    <nav className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
                        {subNav.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
}
