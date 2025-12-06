import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

export default function CssShadowGenerator() {
    const [hOffset, setHOffset] = useState(0);
    const [vOffset, setVOffset] = useState(4);
    const [blur, setBlur] = useState(10);
    const [spread, setSpread] = useState(0);
    const [opacity, setOpacity] = useState(0.5);
    const [color, setColor] = useState('#000000');
    const [inset, setInset] = useState(false);

    // Convert HEX to RGBA for shadow
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    };

    const rgb = hexToRgb(color);
    const rgbaColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    const shadowString = `${inset ? 'inset ' : ''}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${rgbaColor}`;
    const codeString = `box-shadow: ${shadowString};`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(codeString);
        toast.success('CSS 코드가 복사되었습니다!');
    };

    const reset = () => {
        setHOffset(0);
        setVOffset(4);
        setBlur(10);
        setSpread(0);
        setOpacity(0.5);
        setColor('#000000');
        setInset(false);
    };

    return (
        <ToolLayout
            title="CSS Box Shadow 생성기"
            description="CSS 박스 그림자 효과를 시각적으로 조정하고 코드를 생성하세요. Offset, Blur, Spread, Color를 실시간으로 미리보기 할 수 있습니다."
            keywords="css shadow generator, box-shadow generator, css 그림자 만들기, 박스 쉐도우, 웹 디자인 도구"
        >
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Controls */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                        <span className="text-gray-200 font-bold">Inset</span>
                        <div
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${inset ? 'bg-neon-primary' : 'bg-gray-600'}`}
                            onClick={() => setInset(!inset)}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${inset ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <ControlSlider label="Horizontal Offset" value={hOffset} min={-50} max={50} onChange={setHOffset} unit="px" />
                        <ControlSlider label="Vertical Offset" value={vOffset} min={-50} max={50} onChange={setVOffset} unit="px" />
                        <ControlSlider label="Blur Radius" value={blur} min={0} max={100} onChange={setBlur} unit="px" />
                        <ControlSlider label="Spread Radius" value={spread} min={-50} max={50} onChange={setSpread} unit="px" />
                        <ControlSlider label="Opacity" value={opacity} min={0} max={1} step={0.01} onChange={setOpacity} />

                        <div>
                            <label className="text-xs text-gray-500 mb-2 block">Shadow Color</label>
                            <div className="flex gap-3">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-10 h-10 rounded cursor-pointer border-none bg-transparent"
                                />
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="flex-1 bg-black/30 border border-white/20 rounded-lg px-3 text-white font-mono uppercase"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            onClick={copyToClipboard}
                            className="flex-1 bg-neon-primary hover:bg-neon-primary/80 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <Copy size={18} /> CSS 복사하기
                        </button>
                        <button
                            onClick={reset}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 p-3 rounded-xl transition-colors"
                            title="초기화"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                {/* Preview */}
                <div className="sticky top-8">
                    <div className="bg-white/5 border border-white/10 p-12 rounded-xl flex items-center justify-center min-h-[400px] overflow-hidden bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px]">
                        <div
                            className="w-48 h-48 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 font-bold transition-all duration-200"
                            style={{ boxShadow: shadowString }}
                        >
                            Preview
                        </div>
                    </div>

                    <div className="mt-4 bg-black/50 border border-white/10 p-4 rounded-xl font-mono text-sm text-neon-secondary break-all">
                        {codeString}
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}

// Sub-component for Sliders
function ControlSlider({ label, value, min, max, onChange, unit = '', step = 1 }: any) {
    return (
        <div>
            <div className="flex justify-between mb-2">
                <label className="text-xs text-gray-400">{label}</label>
                <span className="text-xs text-white font-mono">{value}{unit}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-neon-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
            />
        </div>
    );
}
