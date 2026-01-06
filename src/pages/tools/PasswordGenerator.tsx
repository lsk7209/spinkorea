import { useState, useEffect, useCallback } from 'react';
import { Copy, RefreshCw, KeyRound, ShieldCheck, ShieldAlert, Shield, Check } from 'lucide-react';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

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
    const [strength, setStrength] = useState(0);

    const generatePassword = useCallback(() => {
        let charset = '';
        if (options.upper) charset += CHARS.upper;
        if (options.lower) charset += CHARS.lower;
        if (options.numbers) charset += CHARS.numbers;
        if (options.symbols) charset += CHARS.symbols;

        if (!charset) return;

        let newPassword = '';
        const cryptoObj = window.crypto ?? (window as unknown as { msCrypto?: Crypto }).msCrypto;
        if (!cryptoObj?.getRandomValues) {
            toast.error('안전한 랜덤 생성기를 사용할 수 없습니다.');
            return;
        }
        const randomValues = new Uint32Array(length);
        cryptoObj.getRandomValues(randomValues);

        for (let i = 0; i < length; i++) {
            newPassword += charset[randomValues[i] % charset.length];
        }

        setPassword(newPassword);
        calculateStrength(newPassword);
    }, [length, options]);

    // Initial generate
    useEffect(() => {
        generatePassword();
    }, [generatePassword]);

    const calculateStrength = (pwd: string) => {
        let score = 0;
        if (pwd.length > 8) score += 1;
        if (pwd.length > 12) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
        setStrength(score);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(password);
        toast.success('비밀번호가 복사되었습니다!');
    };

    const getStrengthLabel = () => {
        if (strength < 2) return { text: 'Weak', color: 'text-red-500', icon: ShieldAlert };
        if (strength < 4) return { text: 'Medium', color: 'text-yellow-500', icon: Shield };
        return { text: 'Strong', color: 'text-green-500', icon: ShieldCheck };
    };

    const StrengthIcon = getStrengthLabel().icon;

    return (
        <ToolLayout
            title="강력한 비밀번호 생성기"
            description="해킹으로부터 안전한 랜덤 비밀번호를 생성하세요. 암호학적으로 안전한 난수 생성기(Crypto API)를 사용하여 예측 불가능한 비밀번호를 만들어 드립니다. 길이, 대문자, 소문자, 숫자, 특수문자 포함 여부를 자유롭게 설정할 수 있습니다."
            keywords="비밀번호생성, 암호생성, 랜덤비밀번호, 패스워드제너레이터, 비밀번호보안, 안전한비밀번호"
            howToUse={[
                "비밀번호 길이를 슬라이더로 조절하세요 (4~50자, 권장: 16자 이상)",
                "포함할 문자 종류를 선택하세요 (대문자, 소문자, 숫자, 특수문자)",
                "'새로운 비밀번호 생성' 버튼을 클릭하세요",
                "생성된 비밀번호 옆의 복사 버튼을 눌러 클립보드에 저장하세요"
            ]}
            tips={[
                "최소 12자 이상, 가능하면 16자 이상을 권장합니다",
                "모든 문자 유형을 포함하면 보안 강도가 크게 향상됩니다",
                "사이트마다 다른 비밀번호를 사용하세요",
                "비밀번호 관리자(1Password, Bitwarden 등)와 함께 사용하면 편리합니다"
            ]}
            faqs={[
                { question: "생성된 비밀번호는 안전한가요?", answer: "네, 암호학적으로 안전한 난수 생성기(Crypto API)를 사용합니다. 생성된 비밀번호는 서버에 저장되지 않으며, 오직 사용자의 브라우저에서만 처리됩니다." },
                { question: "비밀번호 길이는 몇 자가 좋나요?", answer: "보안 전문가들은 최소 12자 이상, 가능하면 16자 이상을 권장합니다. 길이가 길수록 브루트 포스 공격에 대한 저항력이 강해집니다." },
                { question: "특수문자를 포함해야 하나요?", answer: "가능하면 포함하는 것이 좋습니다. 다만, 일부 웹사이트에서 특정 특수문자를 허용하지 않는 경우가 있으니 확인이 필요합니다." },
                { question: "같은 비밀번호가 생성될 수 있나요?", answer: "이론적으로 가능하지만, 16자 비밀번호의 경우 가능한 조합이 천문학적으로 많아 실질적으로 불가능합니다." }
            ]}
            relatedTools={[
                { name: "Base64 인코더", path: "/tools/base64-encoder", description: "텍스트를 Base64로 인코딩/디코딩" },
                { name: "QR 코드 생성기", path: "/tools/qr-code-generator", description: "텍스트나 URL을 QR 코드로 변환" }
            ]}
        >
            <div className="max-w-2xl mx-auto space-y-8">

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

                    {/* Strength Indicator */}
                    <div className="absolute -top-3 right-4 bg-neon-dark px-3 py-1 rounded-full border border-neon-border/50 flex items-center gap-2 text-xs font-bold shadow-lg">
                        <span className="text-gray-400">보안 강도:</span>
                        <div className={`flex items-center gap-1 ${getStrengthLabel().color}`}>
                            <StrengthIcon size={14} />
                            {getStrengthLabel().text}
                        </div>
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
                        onClick={generatePassword}
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
