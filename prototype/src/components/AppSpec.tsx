import { X, ChevronUp, ChevronDown } from 'lucide-react';

interface AppSpecProps {
    id: string;
}

export const AppSpec = ({ id: _id }: AppSpecProps) => {
    return (
        <div className="w-full h-full flex flex-col bg-slate-50 text-slate-900 border border-slate-300 shadow-sm overflow-hidden select-none">
            {/* Header */}
            <div className="h-8 flex items-center justify-between px-3 bg-cyan-50 border-b border-cyan-100 shrink-0">
                <span className="text-sm font-medium text-slate-700">Fiber Photometry Settings</span>
                <button className="text-slate-500 hover:text-slate-800 transition-colors">
                    <X size={14} />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-3 font-sans">

                {/* 405nm LED Section */}
                <section className="flex flex-col gap-2">
                    <div className="bg-[#1e74ad] text-white px-2 py-1 flex items-center justify-between rounded-sm">
                        <span className="font-bold text-sm">405nm LED</span>
                        <div className="flex items-center gap-1.5">
                            <div className="bg-white/90 rounded-full h-4 w-10 relative cursor-pointer">
                                <div className="absolute left-0.5 top-0.5 h-3 w-3 bg-slate-400 rounded-full shadow-sm" />
                                <span className="absolute right-1 text-[8px] font-bold text-slate-500 top-0.5">STANDBY</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 space-y-2">
                        <SettingRow label="Intensity (%):" value="0" />
                        <SettingRow label="Frequency (Hz):" value="0" fading />
                    </div>
                </section>

                {/* 470nm LED Section */}
                <section className="flex flex-col gap-2">
                    <div className="bg-[#439639] text-white px-2 py-1 flex items-center justify-between rounded-sm">
                        <span className="font-bold text-sm">470nm LED</span>
                        <div className="flex items-center gap-1.5">
                            <div className="bg-white/90 rounded-full h-4 w-10 relative cursor-pointer">
                                <div className="absolute left-0.5 top-0.5 h-3 w-3 bg-slate-400 rounded-full shadow-sm" />
                                <span className="absolute right-1 text-[8px] font-bold text-slate-500 top-0.5">STANDBY</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 space-y-2">
                        <SettingRow label="Intensity (%):" value="0" />
                        <SettingRow label="Frequency (Hz):" value="0" hasStepper />
                    </div>
                </section>

                {/* 560nm LED Section */}
                <section className="flex flex-col gap-2">
                    <div className="bg-[#d12e1a] text-white px-2 py-1 flex items-center justify-between rounded-sm">
                        <span className="font-bold text-sm">560nm LED</span>
                        <div className="flex items-center gap-1.5">
                            <div className="bg-white/90 rounded-full h-4 w-10 relative cursor-pointer">
                                <div className="absolute left-0.5 top-0.5 h-3 w-3 bg-slate-400 rounded-full shadow-sm" />
                                <span className="absolute right-1 text-[8px] font-bold text-slate-500 top-0.5">STANDBY</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 space-y-2">
                        <SettingRow label="Intensity (%):" value="0" />
                        <SettingRow label="Frequency (Hz):" value="0" hasStepper />
                    </div>
                </section>

                {/* Camera Section */}
                <section className="flex flex-col gap-2">
                    <div className="bg-slate-500 text-white px-2 py-1 flex items-center rounded-sm">
                        <span className="font-bold text-sm">Camera</span>
                    </div>
                    <div className="px-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-500 font-medium">Frame Rate (Hz):</span>
                            <div className="w-[180px] h-5 border border-slate-200 bg-white" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-500 font-medium">Exposure Time (ms):</span>
                            <div className="w-[180px] h-5 border border-slate-200 bg-white" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

const SettingRow = ({ label, value, fading, hasStepper }: { label: string, value: string, fading?: boolean, hasStepper?: boolean }) => {
    return (
        <div className={fading ? "opacity-50" : ""}>
            <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] text-slate-600 font-medium w-32">{label}</span>
                <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 h-3 flex items-center relative">
                        {/* Track */}
                        <div className="w-full h-[3px] bg-indigo-100/50" />
                        {/* Thumb */}
                        <div className="absolute left-0 w-4 h-4 rounded-full bg-white border border-slate-200 shadow-sm shadow-indigo-100 flex items-center justify-center pointer-events-none" />
                    </div>
                    <div className="w-12 h-4 border border-slate-200 bg-white flex items-center px-1 text-[10px] justify-end relative">
                        {value}
                        {hasStepper && (
                            <div className="flex flex-col absolute -right-[1px] top-0 bottom-0 border-l border-slate-200">
                                <span className="leading-[6px] text-slate-400 border-b border-slate-100 px-0.5 hover:bg-slate-50">
                                    <ChevronUp size={6} />
                                </span>
                                <span className="leading-[6px] text-slate-400 px-0.5 hover:bg-slate-50">
                                    <ChevronDown size={6} />
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
