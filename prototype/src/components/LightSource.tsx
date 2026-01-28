import { X, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface LightSourceProps {
    id: string;
    name: string;
}

export const LightSource = ({ id: _id, name }: LightSourceProps) => {
    return (
        <div className="w-full h-full flex flex-col bg-[#f0f0f0] text-slate-900 border border-slate-300 shadow-sm overflow-hidden select-none font-sans text-[11px]">
            {/* Window Header Style */}
            <div className="h-7 flex items-center justify-between px-2 bg-gradient-to-b from-white to-[#e1e1e1] border-b border-slate-300 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm flex items-center justify-center text-[8px] text-white font-bold">L</div>
                    <span className="truncate max-w-[200px]">{name} (Mightex | BLS-GCS-0470-50-A0510 | NA-2)</span>
                </div>
                <div className="flex items-center gap-3">
                    <HelpCircle size={14} className="text-slate-600 cursor-help" />
                    <X size={14} className="text-slate-600 cursor-pointer" />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">

                {/* Top Section */}
                <div className="space-y-1.5 pb-2 border-b border-slate-300">
                    <div className="flex items-center gap-4">
                        <span className="w-24 text-slate-600">Light Source:</span>
                        <div className="flex-1 h-5 bg-white border border-slate-300 flex items-center px-1.5 justify-between">
                            <span>{name} (Current)</span>
                            <ChevronDown size={10} className="text-slate-400" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="w-24 text-slate-600">Work Mode:</span>
                        <div className="flex-1 h-5 bg-white border border-slate-300 flex items-center px-1.5 justify-between">
                            <span>Event Trigger Mode</span>
                            <ChevronDown size={10} className="text-slate-400" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                        <button className="px-6 h-5 bg-[#f5f5f5] border border-slate-300 rounded-sm hover:bg-white text-slate-400 shadow-sm transition-colors">On</button>
                        <button className="px-6 h-5 bg-[#f5f5f5] border border-slate-300 rounded-sm hover:bg-white text-slate-400 shadow-sm transition-colors">Off</button>
                    </div>
                </div>

                {/* Middle Section: Trigger Settings */}
                <div className="space-y-1.5 py-2 border-b border-slate-300/50">
                    <InputRow label="Trigger:" value="test" />
                    <InputRow label="Event Response:" value="1" />
                    <div className="flex items-center gap-4">
                        <span className="w-24 text-slate-600">Nickname:</span>
                        <div className="flex-1 h-5 bg-white border border-slate-300/50 italic text-slate-400 px-1.5 flex items-center">
                            Event Response #1
                        </div>
                    </div>
                    <InputRow label="Waveform Type:" value="Analog" />
                    <div className="flex items-center gap-4">
                        <span className="w-24 text-slate-600">Output Waveform:</span>
                        <div className="flex-1 h-5 bg-white border border-slate-300 flex items-center px-1.5 justify-between">
                            <span>CW</span>
                            <ChevronDown size={10} className="text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Controls */}
                <div className="space-y-2 py-2">
                    <div className="flex items-center gap-4">
                        <span className="w-24 text-slate-600">Amplitude:</span>
                        <div className="flex-1 flex items-center gap-2">
                            <div className="flex-1 h-4 relative flex items-center">
                                <div className="w-full h-[1px] bg-slate-300" />
                                <div className="absolute left-1/4 -translate-x-1/2 w-2 h-4 bg-blue-600 rounded-sm cursor-pointer shadow-sm" />
                            </div>
                            <div className="w-16 h-5 bg-white border border-slate-300 flex items-center px-1.5 justify-between relative">
                                <span>0.0</span>
                                <div className="flex flex-col border-l border-slate-200">
                                    <ChevronUp size={8} className="text-slate-400 hover:text-slate-600" />
                                    <ChevronDown size={8} className="text-slate-400 hover:text-slate-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-slate-600">Description:</span>
                        <div className="h-16 bg-white border border-slate-300 shadow-inner p-1" />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="w-24 text-slate-600 whitespace-nowrap">Waveform Nickname:</span>
                        <div className="flex-1 h-5 bg-white border border-slate-300" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex items-center gap-4">
        <span className="w-24 text-slate-600">{label}</span>
        <div className="flex-1 h-5 bg-white border border-slate-300 px-1.5 flex items-center">
            {value}
        </div>
    </div>
);
