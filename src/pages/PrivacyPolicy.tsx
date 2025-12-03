import SEO from '@/components/SEO';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-neon-bg text-gray-300 px-4 py-12">
            <SEO
                title="개인정보처리방침 - SpinFlow"
                description="SpinFlow의 개인정보처리방침입니다. 이용자의 개인정보 보호를 위한 정책을 확인하세요."
                keywords="개인정보처리방침, 개인정보보호, SpinFlow약관"
            />
            <div className="max-w-3xl mx-auto prose prose-invert">
                <h1 className="text-3xl font-bold text-white mb-8">개인정보처리방침</h1>

                <p className="mb-4">
                    SpinFlow(이하 "서비스")는 이용자의 개인정보를 중요시하며, "정보통신망 이용촉진 및 정보보호"에 관한 법률을 준수하고 있습니다.
                </p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. 수집하는 개인정보 항목</h2>
                <p>
                    본 서비스는 별도의 회원가입 없이 이용 가능하며, 서비스 이용 과정에서 다음과 같은 정보들이 자동으로 생성되어 수집될 수 있습니다.
                </p>
                <ul className="list-disc pl-5 mb-4">
                    <li>IP Address, 쿠키, 방문 일시, 서비스 이용 기록, 불량 이용 기록</li>
                    <li>Google Analytics를 통한 익명화된 이용 통계 데이터</li>
                </ul>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. 개인정보의 수집 및 이용목적</h2>
                <p>
                    수집한 개인정보를 다음의 목적을 위해 활용합니다.
                </p>
                <ul className="list-disc pl-5 mb-4">
                    <li>서비스 제공 및 운영</li>
                    <li>접속 빈도 파악 및 서비스 이용에 대한 통계</li>
                    <li>서비스 개선 및 신규 서비스 개발</li>
                </ul>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. 쿠키(Cookie)의 운용 및 거부</h2>
                <p>
                    서비스는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
                    이용자는 쿠키 설치에 대한 선택권을 가지고 있으며, 웹브라우저의 옵션을 설정함으로써 모든 쿠키를 허용하거나,
                    쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
                </p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">4. 문의처</h2>
                <p>
                    개인정보 관련 문의사항은 아래 이메일로 연락 주시기 바랍니다.<br />
                    Email: contact@spinflow.pages.dev
                </p>
            </div>
        </div>
    );
}
