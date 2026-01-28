import { X, ChevronUp, ChevronDown } from 'lucide-react';
import type { AppSpecSettings } from './Sidebar';

interface AppSpecProps {
    id: string;
    appSpecSettings: AppSpecSettings;
    sectionOrder: string[];
}

export const AppSpec = ({ id: _id, appSpecSettings, sectionOrder }: AppSpecProps) => {
    const { led405, led470, led560, camera } = appSpecSettings;

    const showLed405Section = led405.intensity || led405.frequency;
    const showLed470Section = led470.intensity || led470.frequency;
    const showLed560Section = led560.intensity || led560.frequency;
    const showCameraSection = camera.frameRate || camera.exposureTime;

    const renderSection = (sectionId: string) => {
        switch (sectionId) {
            case 'led405':
                return showLed405Section && (
                    <section key="led405" className="flex flex-col gap-2">
                        <div style={{ backgroundColor: led405.color }} className="text-white px-2 py-1 flex items-center justify-between rounded-sm">
                            <span className="font-bold text-sm">405nm LED</span>
                            <div className="flex items-center gap-1.5">
                                <div className="bg-white/90 rounded-full h-4 w-10 relative cursor-pointer">
                                    <div className="absolute left-0.5 top-0.5 h-3 w-3 bg-slate-400 rounded-full shadow-sm" />
                                    <span className="absolute right-1 text-[8px] font-bold text-slate-500 top-0.5">STANDBY</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 space-y-2">
                            {led405.intensity && <SettingRow label="Intensity (%):" value="0" />}
                            {led405.frequency && <SettingRow label="Frequency (Hz):" value="0" fading />}
                        </div>
                    </section>
                );
            case 'led470':
                return showLed470Section && (
                    <section key="led470" className="flex flex-col gap-2">
                        <div style={{ backgroundColor: led470.color }} className="text-white px-2 py-1 flex items-center justify-between rounded-sm">
                            <span className="font-bold text-sm">470nm LED</span>
                            <div className="flex items-center gap-1.5">
                                <div className="bg-white/90 rounded-full h-4 w-10 relative cursor-pointer">
                                    <div className="absolute left-0.5 top-0.5 h-3 w-3 bg-slate-400 rounded-full shadow-sm" />
                                    <span className="absolute right-1 text-[8px] font-bold text-slate-500 top-0.5">STANDBY</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 space-y-2">
                            {led470.intensity && <SettingRow label="Intensity (%):" value="0" />}
                            {led470.frequency && <SettingRow label="Frequency (Hz):" value="0" hasStepper />}
                        </div>
                    </section>
                );
            case 'led560':
                return showLed560Section && (
                    <section key="led560" className="flex flex-col gap-2">
                        <div style={{ backgroundColor: led560.color }} className="text-white px-2 py-1 flex items-center justify-between rounded-sm">
                            <span className="font-bold text-sm">560nm LED</span>
                            <div className="flex items-center gap-1.5">
                                <div className="bg-white/90 rounded-full h-4 w-10 relative cursor-pointer">
                                    <div className="absolute left-0.5 top-0.5 h-3 w-3 bg-slate-400 rounded-full shadow-sm" />
                                    <span className="absolute right-1 text-[8px] font-bold text-slate-500 top-0.5">STANDBY</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 space-y-2">
                            {led560.intensity && <SettingRow label="Intensity (%):" value="0" />}
                            {led560.frequency && <SettingRow label="Frequency (Hz):" value="0" hasStepper />}
                        </div>
                    </section>
                );
            case 'camera':
                return showCameraSection && (
                    <section key="camera" className="flex flex-col gap-2">
                        <div style={{ backgroundColor: camera.color }} className="text-white px-2 py-1 flex items-center rounded-sm">
                            <span className="font-bold text-sm">Camera</span>
                        </div>
                        <div className="px-4 space-y-2">
                            {camera.frameRate && (
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-slate-500 font-medium">Frame Rate (Hz):</span>
                                    <div className="w-[180px] h-5 border border-slate-200 bg-white" />
                                </div>
                            )}
                            {camera.exposureTime && (
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-slate-500 font-medium">Exposure Time (ms):</span>
                                    <div className="w-[180px] h-5 border border-slate-200 bg-white" />
                                </div>
                            )}
                        </div>
                    </section>
                );
            default:
                return null;
        }
    };

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
                {sectionOrder.map(sectionId => renderSection(sectionId))}
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
