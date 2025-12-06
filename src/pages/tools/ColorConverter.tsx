import { useState, useEffect } from 'react';
import { Palette, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

// Helper: HEX to RGB
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

// Helper: RGB to HEX
const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

// Helper: RGB to HSL
const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

// Helper: HSL to RGB
const hslToRgb = (h: number, s: number, l: number) => {
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

export default function ColorConverter() {
    const [hex, setHex] = useState('#3B82F6');
    const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
    const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });

    // Update from HEX input
    const handleHexChange = (val: string) => {
        setHex(val);
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            const newRgb = hexToRgb(val);
            if (newRgb) {
                setRgb(newRgb);
                setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
            }
        }
    };

    // Update from RGB input
    const handleRgbChange = (key: 'r' | 'g' | 'b', val: string) => {
        const num = Math.min(255, Math.max(0, parseInt(val) || 0));
        const newRgb = { ...rgb, [key]: num };
        setRgb(newRgb);
        setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
    };

    // Update from HSL input
    const handleHslChange = (key: 'h' | 's' | 'l', val: string) => {
        let num = parseInt(val) || 0;
        if (key === 'h') num = Math.min(360, Math.max(0, num));
        else num = Math.min(100, Math.max(0, num));

        const newHsl = { ...hsl, [key]: num };
        setHsl(newHsl);
        // HSL -> RGB -> HEX
        // Note: Logic here needs normalization (s/l 0-100 -> 0-1)
        const newRgb = hslToRgb(newHsl.h / 360, newHsl.s / 100, newHsl.l / 100);
        setRgb(newRgb);
        setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${text} 복사됨!`);
    };

    return (
        <ToolLayout
            title="색상 코드 변환기 (HEX, RGB, HSL)"
            description="웹 디자인과 개발에 필요한 색상 코드를 변환하세요. HEX, RGB, HSL 값을 실시간으로 변환하고 미리보기 할 수 있습니다."
            keywords="색상변환기, color converter, hex to rgb, rgb to hex, hsl converter, 웹색상코드, 컬러피커"
        >
            <div className="flex flex-col gap-8 max-w-2xl mx-auto">

                {/* Preview Box */}
                <div
                    className="w-full h-32 rounded-2xl shadow-lg border border-white/10 flex items-center justify-center transition-colors duration-300"
                    style={{ backgroundColor: hex }}
                >
                    <span className="bg-black/40 px-4 py-2 rounded-lg text-white font-mono font-bold backdrop-blur-sm">
                        {hex.toUpperCase()}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* HEX Input */}
                    <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-200">HEX</h3>
                            <button onClick={() => copyToClipboard(hex)} className="text-gray-400 hover:text-white"><Copy size={16} /></button>
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">#</span>
                            <input
                                type="text"
                                value={hex.replace('#', '')}
                                onChange={(e) => handleHexChange('#' + e.target.value)}
                                maxLength={6}
                                className="w-full bg-black/30 border border-white/20 rounded-lg pl-6 pr-3 py-2 text-white font-mono focus:outline-none focus:border-neon-primary uppercase"
                            />
                        </div>
                    </div>

                    {/* RGB Input */}
                    <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-200">RGB</h3>
                            <button onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} className="text-gray-400 hover:text-white"><Copy size={16} /></button>
                        </div>
                        <div className="flex gap-2">
                            <input type="number" value={rgb.r} onChange={(e) => handleRgbChange('r', e.target.value)} className="w-full bg-black/30 border border-white/20 rounded-lg px-2 py-2 text-white font-mono text-center focus:border-red-500 focus:outline-none" placeholder="R" />
                            <input type="number" value={rgb.g} onChange={(e) => handleRgbChange('g', e.target.value)} className="w-full bg-black/30 border border-white/20 rounded-lg px-2 py-2 text-white font-mono text-center focus:border-green-500 focus:outline-none" placeholder="G" />
                            <input type="number" value={rgb.b} onChange={(e) => handleRgbChange('b', e.target.value)} className="w-full bg-black/30 border border-white/20 rounded-lg px-2 py-2 text-white font-mono text-center focus:border-blue-500 focus:outline-none" placeholder="B" />
                        </div>
                    </div>

                    {/* HSL Input */}
                    <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-200">HSL</h3>
                            <button onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)} className="text-gray-400 hover:text-white"><Copy size={16} /></button>
                        </div>
                        <div className="flex gap-2">
                            <input type="number" value={hsl.h} onChange={(e) => handleHslChange('h', e.target.value)} className="w-full bg-black/30 border border-white/20 rounded-lg px-2 py-2 text-white font-mono text-center focus:border-neon-secondary focus:outline-none" placeholder="H" />
                            <input type="number" value={hsl.s} onChange={(e) => handleHslChange('s', e.target.value)} className="w-full bg-black/30 border border-white/20 rounded-lg px-2 py-2 text-white font-mono text-center focus:border-neon-secondary focus:outline-none" placeholder="S" />
                            <input type="number" value={hsl.l} onChange={(e) => handleHslChange('l', e.target.value)} className="w-full bg-black/30 border border-white/20 rounded-lg px-2 py-2 text-white font-mono text-center focus:border-neon-secondary focus:outline-none" placeholder="L" />
                        </div>
                    </div>
                </div>

                <div className="text-sm text-gray-500 text-center">
                    * 값을 입력하면 다른 포맷으로 자동 변환됩니다.
                </div>
            </div>
        </ToolLayout>
    );
}
