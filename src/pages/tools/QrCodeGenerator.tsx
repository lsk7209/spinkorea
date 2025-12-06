import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

export default function QrCodeGenerator() {
    const [value, setValue] = useState('https://spinflow.kr');
    const [size, setSize] = useState(256);
    const [bgColor, setBgColor] = useState('#ffffff');
    const [fgColor, setFgColor] = useState('#000000');
    const qrRef = useRef<HTMLDivElement>(null);

    const downloadQrCode = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = url;
            link.download = 'qrcode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('QR 코드가 저장되었습니다.');
        } else {
            toast.error('QR 코드 생성 중 오류가 발생했습니다.');
        }
    };

    const reset = () => {
        setValue('https://spinflow.kr');
        setSize(256);
        setBgColor('#ffffff');
        setFgColor('#000000');
    };

    return (
        <ToolLayout
            title="QR 코드 생성기"
            description="URL, 텍스트, 이메일 등을 무료 QR 코드로 변환하세요. 색상과 크기를 커스터마이징하고 이미지로 저장할 수 있습니다."
            keywords="qr code generator, qr 생성, 큐알코드 만들기, 무료 qr 코드, url to qr"
        >
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                {/* Input & Settings */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block font-bold">내용 입력 (URL, 텍스트)</label>
                        <textarea
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full h-32 bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-neon-primary resize-none"
                            placeholder="https://example.com 또는 텍스트 입력"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">배경색 (Background)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                                />
                                <span className="text-xs text-gray-300 font-mono uppercase">{bgColor}</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">전경색 (Foreground)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={fgColor}
                                    onChange={(e) => setFgColor(e.target.value)}
                                    className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                                />
                                <span className="text-xs text-gray-300 font-mono uppercase">{fgColor}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 mb-2 block">크기 (Size: {size}px)</label>
                        <input
                            type="range"
                            min={128}
                            max={512}
                            step={32}
                            value={size}
                            onChange={(e) => setSize(parseInt(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-neon-primary [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>

                    <button
                        onClick={reset}
                        className="w-full text-gray-400 hover:text-white text-sm flex items-center justify-center gap-1 py-2 hover:bg-white/5 rounded transition-colors"
                    >
                        <RefreshCw size={14} /> 설정 초기화
                    </button>
                </div>

                {/* Preview & Download */}
                <div className="flex flex-col items-center gap-6">
                    <div
                        ref={qrRef}
                        className="bg-white p-4 rounded-xl shadow-lg transform transition-transform hover:scale-105 duration-300"
                    >
                        <QRCodeCanvas
                            value={value}
                            size={size}
                            bgColor={bgColor}
                            fgColor={fgColor}
                            level={"H"}
                            includeMargin={true}
                        />
                    </div>

                    <div className="text-center space-y-4">
                        <button
                            onClick={downloadQrCode}
                            disabled={!value}
                            className={`
                                flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition-all
                                ${value
                                    ? 'bg-neon-primary hover:bg-neon-primary/80 text-black shadow-lg shadow-neon-primary/20 hover:-translate-y-1'
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
                            `}
                        >
                            <Download size={20} />
                            PNG 이미지 저장
                        </button>
                        <p className="text-xs text-gray-500">
                            * 고해상도 PNG 파일로 저장됩니다.
                        </p>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
