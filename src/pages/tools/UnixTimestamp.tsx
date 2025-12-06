import { useState, useEffect } from 'react';
import { Clock, Calendar, ArrowRight, Copy } from 'lucide-react';
import { format, fromUnixTime, getUnixTime, parseISO } from 'date-fns';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

export default function UnixTimestamp() {
    const [now, setNow] = useState<number>(getUnixTime(new Date()));
    const [inputTimestamp, setInputTimestamp] = useState('');
    const [convertedDate, setConvertedDate] = useState('');

    const [inputDate, setInputDate] = useState(''); // ISO format YYYY-MM-DDTHH:mm:ss
    const [convertedTimestamp, setConvertedTimestamp] = useState('');

    // Update "Current Unix Time" live
    useEffect(() => {
        const timer = setInterval(() => {
            setNow(getUnixTime(new Date()));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Convert Timestamp -> Date
    useEffect(() => {
        if (!inputTimestamp) {
            setConvertedDate('');
            return;
        }
        const ts = parseInt(inputTimestamp);
        if (!isNaN(ts)) {
            try {
                // Determine if it's seconds or milliseconds
                // Unix timestamp (seconds) usually 10 digits (until Year 2286)
                // Milliseconds is 13 digits
                const date = inputTimestamp.length > 11 ? fromUnixTime(ts / 1000) : fromUnixTime(ts);
                setConvertedDate(format(date, 'yyyy-MM-dd HH:mm:ss (XXX)'));
            } catch (e) {
                setConvertedDate('Invalid Timestamp');
            }
        } else {
            setConvertedDate('Invalid Number');
        }
    }, [inputTimestamp]);

    // Convert Date -> Timestamp
    useEffect(() => {
        if (!inputDate) {
            setConvertedTimestamp('');
            return;
        }
        try {
            const date = parseISO(inputDate);
            setConvertedTimestamp(getUnixTime(date).toString());
        } catch (e) {
            setConvertedTimestamp('Invalid Date');
        }
    }, [inputDate]);

    const copyToClipboard = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success('복사되었습니다!');
    };

    return (
        <ToolLayout
            title="Unix 타임스탬프 변환기"
            description="현재 Unix Timestamp를 확인하고, 타임스탬프를 날짜로 변환하거나 그 반대로 변환할 수 있습니다. 개발자 디버깅 필수 도구."
            keywords="unix timestamp, epoch time, 시간 변환, 유닉스 시간, 타임스탬프 변환기"
        >
            <div className="flex flex-col gap-8 max-w-2xl mx-auto">

                {/* Current Time Banner */}
                <div className="bg-gradient-to-r from-neon-primary/20 to-blue-500/20 border border-neon-primary/50 p-6 rounded-2xl text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-neon-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-neon-primary font-bold mb-2 flex items-center justify-center gap-2">
                        <Clock size={20} /> 현재 Unix Timestamp
                    </h3>
                    <div
                        className="text-4xl md:text-6xl font-black text-white font-mono tracking-wider cursor-pointer active:scale-95 transition-transform"
                        onClick={() => copyToClipboard(now.toString())}
                        title="클릭하여 복사"
                    >
                        {now}
                    </div>
                    <p className="text-gray-400 text-sm mt-2 font-mono">
                        {format(fromUnixTime(now), 'yyyy-MM-dd HH:mm:ss')}
                    </p>
                </div>

                {/* Converter Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Timestamp -> Date */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
                            <Clock size={18} className="text-neon-secondary" /> Timestamp → Date
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Unix Timestamp (Seconds or ms)</label>
                                <input
                                    type="number"
                                    value={inputTimestamp}
                                    onChange={(e) => setInputTimestamp(e.target.value)}
                                    placeholder={now.toString()}
                                    className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-neon-secondary"
                                />
                            </div>
                            <div className="flex justify-center text-gray-500">
                                <ArrowRight size={20} className="rotate-90 md:rotate-0" />
                            </div>
                            <div
                                className="bg-black/50 border border-white/10 rounded-lg p-3 text-neon-secondary font-mono text-sm break-all cursor-pointer hover:bg-black/70 transition-colors relative group"
                                onClick={() => copyToClipboard(convertedDate)}
                            >
                                {convertedDate || '결과가 여기에 표시됩니다'}
                                {convertedDate && <Copy size={14} className="absolute top-2 right-2 opacity-50" />}
                            </div>
                        </div>
                    </div>

                    {/* Date -> Timestamp */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
                            <Calendar size={18} className="text-blue-400" /> Date → Timestamp
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Date (Local Time)</label>
                                <input
                                    type="datetime-local"
                                    value={inputDate}
                                    onChange={(e) => setInputDate(e.target.value)}
                                    className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-400 [color-scheme:dark]"
                                />
                            </div>
                            <div className="flex justify-center text-gray-500">
                                <ArrowRight size={20} className="rotate-90 md:rotate-0" />
                            </div>
                            <div
                                className="bg-black/50 border border-white/10 rounded-lg p-3 text-blue-400 font-mono text-lg font-bold text-center break-all cursor-pointer hover:bg-black/70 transition-colors relative"
                                onClick={() => copyToClipboard(convertedTimestamp)}
                            >
                                {convertedTimestamp || '-'}
                                {convertedTimestamp && <Copy size={14} className="absolute top-2 right-2 opacity-50" />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="text-sm text-gray-500 bg-white/5 p-4 rounded-lg">
                    <p>💡 <b>Unix Timestamp</b>는 1970년 1월 1일 00:00:00 UTC로부터 경과한 초(Seconds)를 의미합니다.</p>
                    <p className="mt-1">* 자바스크립트는 밀리초(ms) 단위를 사용하므로, js 내에서는 `Date.now()` 값이 13자리(ms)로 반환됩니다. 위 변환기는 10자리(초)와 13자리(밀리초)를 자동 감지합니다.</p>
                </div>
            </div>
        </ToolLayout>
    );
}
