import SEO from '@/components/SEO';

export default function Terms() {
    return (
        <div className="min-h-screen bg-neon-bg text-gray-300 px-4 py-12">
            <SEO
                title="이용약관 - SpinFlow"
                description="SpinFlow 서비스 이용약관입니다. 서비스 이용에 관한 제반 사항을 확인하세요."
                keywords="이용약관, 서비스이용약관, SpinFlow규정"
            />
            <div className="max-w-3xl mx-auto prose prose-invert">
                <h1 className="text-3xl font-bold text-white mb-8">이용약관</h1>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">제1조 (목적)</h2>
                <p>
                    본 약관은 SpinFlow(이하 "서비스")가 제공하는 모든 서비스의 이용조건 및 절차, 이용자와 서비스의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">제2조 (서비스의 제공)</h2>
                <p>
                    1. 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.<br />
                    2. 서비스는 시스템 정기점검, 증설 및 교체 등 운영상 필요하다고 판단되는 경우 일정기간 동안 서비스를 일시 중지할 수 있습니다.
                </p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">제3조 (책임의 한계)</h2>
                <p>
                    1. 본 서비스가 제공하는 룰렛 결과는 무작위로 생성되며, 법적 효력이 없습니다.<br />
                    2. 서비스는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
                </p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">제4조 (약관의 개정)</h2>
                <p>
                    서비스는 관련 법령에 위배되지 않는 범위에서 본 약관을 개정할 수 있습니다.
                </p>
            </div>
        </div>
    );
}
