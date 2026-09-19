import { useState, useEffect, useCallback } from 'react';
import { Copy, RefreshCw, KeyRound, Check } from 'lucide-react';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';
import { trackToolCompleted } from '@/utils/analytics';
import { getSecureRandomInt } from '@/utils/random';

const CHARS = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

export default function PasswordGenerator() {
    const [length, setLength] = useState(16);
    const [password, setPassword] = useState('');
    const [options, setOptions] = useState({
        upper: true,
        lower: true,
        numbers: true,
        symbols: true
    });

    const generatePassword = useCallback(() => {
        let charset = '';
        if (options.upper) charset += CHARS.upper;
        if (options.lower) charset += CHARS.lower;
        if (options.numbers) charset += CHARS.numbers;
        if (options.symbols) charset += CHARS.symbols;

        if (!charset) return;

        let newPassword = '';
        try {
            for (let i = 0; i < length; i++) {
                newPassword += charset[getSecureRandomInt(charset.length)];
            }
        } catch {
            setPassword('');
            toast.error('안전한 랜덤 생성기를 사용할 수 없습니다.');
            return;
        }

        setPassword(newPassword);
    }, [length, options]);

    // Initial generate
    useEffect(() => {
        generatePassword();
    }, [generatePassword]);

    const copyToClipboard = async () => {
        if (!password) return;
        try {
            await navigator.clipboard.writeText(password);
            toast.success('비밀번호가 복사되었습니다!');
        } catch {
            toast.error('복사하지 못했습니다. 브라우저 권한을 확인하거나 비밀번호를 직접 선택해 복사하세요.');
        }
    };

    const regeneratePassword = () => {
        generatePassword();
        trackToolCompleted('/tools/random-password', 'password_generated');
    };

    return (
        <ToolLayout
            title="랜덤 비밀번호 생성기"
            description="브라우저의 Crypto API 기반 난수로 추측하기 어려운 랜덤 비밀번호를 생성하세요. 생성된 문자열의 보관과 계정 보안은 사용자가 관리해야 하며, 길이·대문자·소문자·숫자·특수문자 포함 여부를 설정할 수 있습니다."
            keywords="비밀번호생성, 암호생성, 랜덤비밀번호, 패스워드제너레이터, 비밀번호보안, 안전한비밀번호"
            howToUse={[
                "사용할 서비스의 길이 제한을 확인하고 슬라이더로 길이를 조절하세요 (4~50자)",
                "포함할 문자 종류를 선택하세요 (대문자, 소문자, 숫자, 특수문자)",
                "'새로운 비밀번호 생성' 버튼을 클릭하세요",
                "생성된 비밀번호 옆의 복사 버튼을 눌러 클립보드에 저장하세요"
            ]}
            tips={[
                "생성 가능한 길이 범위가 모든 서비스의 보안 기준을 충족한다는 뜻은 아닙니다",
                "선택한 문자군은 추출 후보입니다. 모든 문자군이 결과에 반드시 포함되지는 않습니다",
                "사이트마다 다른 비밀번호를 사용하세요",
                "비밀번호 관리자(1Password, Bitwarden 등)와 함께 사용하면 편리합니다"
            ]}
            faqs={[
                { question: "생성된 비밀번호는 안전한가요?", answer: "브라우저의 Crypto API 기반 난수를 사용하지만 어떤 도구도 계정 보안을 보장하지는 않습니다. 생성된 비밀번호는 사이트에 입력하거나 공유하지 말고, 사용자가 안전한 비밀번호 관리자 등에 직접 보관하세요." },
                { question: "비밀번호 길이는 몇 자가 좋나요?", answer: "사용할 서비스의 길이 제한을 확인하고 충분히 긴 새 비밀번호를 계정마다 따로 생성하세요. 길이만으로 실제 해독 시간이나 계정 안전을 보장할 수는 없습니다." },
                { question: "특수문자를 포함해야 하나요?", answer: "사용할 서비스가 허용하는 문자와 요구 조건을 확인해 선택하세요. 이 옵션은 추출 후보를 정하며, 특수문자의 포함이나 특정 서비스의 조건 충족을 보장하지 않습니다." },
                { question: "같은 비밀번호가 생성될 수 있나요?", answer: "가능합니다. 결과의 중복을 검사하지 않으며, 발생 가능성은 길이와 선택한 문자 풀에 따라 달라집니다. 서로 다른 계정에서 같은 비밀번호를 재사용하지 마세요." }
            ]}
            relatedTools={[
                { name: "Base64 인코더", path: "/tools/base64-encoder", description: "텍스트를 Base64로 인코딩/디코딩" },
                { name: "QR 코드 생성기", path: "/tools/qr-code-generator", description: "텍스트나 URL을 QR 코드로 변환" }
            ]}
        >
            <div className="max-w-2xl mx-auto space-y-8">
                <p className="text-sm text-gray-400">표시되는 문자 수는 생성 결과의 길이입니다. 유출 여부·해독 시간·피싱 저항성은 검사하지 않습니다. 선택한 문자군이 모두 결과에 포함된다는 보장은 없습니다.</p>

                {/* Result Display */}
                <div className="relative">
                    <div className="w-full bg-black/30 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 break-all">
                        <KeyRound className="text-neon-primary hidden md:block" size={32} />
                        <div className="flex-1 text-center md:text-left">
                            <span className="text-2xl md:text-3xl font-mono text-white font-bold tracking-wider">
                                {password}
                            </span>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="p-3 hover:bg-white/10 rounded-xl transition-colors text-neon-secondary"
                            title="복사"
                        >
                            <Copy size={24} />
                        </button>
                    </div>

                    {/* Generated length */}
                    <div className="absolute -top-3 right-4 bg-neon-dark px-3 py-1 rounded-full border border-neon-border/50 flex items-center gap-2 text-xs font-bold shadow-lg">
                        <span className="text-gray-300">문자 수: {password.length}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-6">

                    {/* Length Slider */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-gray-300 font-medium">비밀번호 길이</label>
                            <span className="text-neon-primary font-bold text-xl">{length}</span>
                        </div>
                        <input
                            type="range"
                            min="4"
                            max="50"
                            value={length}
                            onChange={(e) => setLength(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-primary"
                        />
                    </div>

                    {/* Checkboxes */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.keys(options).map((key) => (
                            <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`
                                    w-5 h-5 rounded border flex items-center justify-center transition-colors
                                    ${options[key as keyof typeof options]
                                        ? 'bg-neon-primary border-neon-primary text-black'
                                        : 'border-gray-500 group-hover:border-neon-primary'}
                                `}>
                                    {options[key as keyof typeof options] && <Check size={14} strokeWidth={3} />}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={options[key as keyof typeof options]}
                                    onChange={() => {
                                        // Prevent unchecking the last option
                                        const checkedCount = Object.values(options).filter(Boolean).length;
                                        if (checkedCount === 1 && options[key as keyof typeof options]) {
                                            toast.error('최소 하나의 옵션은 선택해야 합니다.');
                                            return;
                                        }
                                        setOptions(prev => ({ ...prev, [key]: !prev[key as keyof typeof options] }));
                                    }}
                                    className="hidden"
                                />
                                <span className="text-gray-300 capitalize">
                                    {key === 'upper' && '대문자 (ABCD)'}
                                    {key === 'lower' && '소문자 (abcd)'}
                                    {key === 'numbers' && '숫자 (1234)'}
                                    {key === 'symbols' && '특수문자 (!@#$)'}
                                </span>
                            </label>
                        ))}
                    </div>

                    <button
                        onClick={regeneratePassword}
                        className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 shadow-neon mt-4"
                    >
                        <RefreshCw size={20} />
                        새로운 비밀번호 생성
                    </button>
                </div>
            </div>

        </ToolLayout>
    );
}
