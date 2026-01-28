import { useState } from 'react';
import { Home, Maximize2, MousePointer2, HelpCircle, Eye, Database, Target, ChevronDown, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface TracesProps {
    id: string;
}

type SectionKey = 'settings' | 'display' | 'export';

export const Traces = ({ id: _id }: TracesProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sections, setSections] = useState<Record<SectionKey, boolean>>({
        settings: true,
        display: true,
        export: true
    });

    const toggleSection = (key: SectionKey) => {
        setSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const activateSection = (key: SectionKey) => {
        if (!sidebarOpen) setSidebarOpen(true);
        setSections(prev => ({ ...prev, [key]: true }));
    };

    return (
        <div className="w-full h-full flex flex-col bg-slate-50 text-slate-900 border border-slate-300 shadow-sm overflow-hidden select-none font-sans">
            {/* Toolbar */}
            <div className="h-10 border-b border-slate-200 bg-slate-100/50 flex items-center px-3 justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="text-[11px] font-medium text-slate-500 whitespace-nowrap">ROI Intensity Traces (Camera #1_View1)</div>
                    <div className="h-6 w-px bg-slate-300 mx-1" />
                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" className="w-3 h-3 rounded-sm border-slate-300" />
                            <span className="text-[10px] text-slate-600">Select all</span>
                        </label>
                        <div className="flex items-center gap-1 ml-2">
                            <button className="p-1 px-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-600 shadow-sm">
                                <Maximize2 size={12} />
                            </button>
                            <button className="p-1 px-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-600 shadow-sm">
                                <Home size={12} />
                            </button>
                            <button className="p-1 px-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-600 shadow-sm">
                                <MousePointer2 size={12} />
                            </button>
                        </div>
                    </div>
                </div>
                <HelpCircle size={18} className="text-blue-600 fill-blue-50 cursor-pointer" />
            </div>

            {/* Main Layout Container */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left Content: Graphs Area */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-8 border-r border-slate-200 bg-slate-50/50">
                    <GraphSection title="Graph#1 (ROI1) " label="Graph#1" />
                    <GraphSection title="Graph#2 (ROI2) " label="Graph#2" />
                </div>

                {/* Right Area: Panel + Strip */}
                <div className="flex h-full shrink-0">

                    {/* The Collapsible Content Panel */}
                    {sidebarOpen && (
                        <div className="w-[300px] bg-white overflow-y-auto border-l border-slate-100 flex flex-col p-4 gap-6 shrink-0 text-[11px] animate-in slide-in-from-right-5 duration-200">
                            {/* Trace Settings */}
                            <CollapsibleSection
                                title="Trace Settings"
                                icon={Target}
                                isOpen={sections.settings}
                                onToggle={() => toggleSection('settings')}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-slate-500">No. of Traces:</span>
                                    <div className="w-32 h-5 border border-slate-300 flex items-center px-1.5 justify-between">
                                        <span>2</span>
                                        <div className="flex flex-col border-l border-slate-200">
                                            <ChevronDown size={8} className="rotate-180" />
                                            <ChevronDown size={8} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-slate-500">Select Trace:</span>
                                    <div className="w-32 h-5 border border-slate-300 flex items-center px-1.5 justify-between">
                                        <span>Trace 1</span>
                                        <ChevronDown size={10} className="text-slate-400" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-slate-500">Set Nickname:</span>
                                    <div className="w-32 h-5 border border-slate-300 bg-white flex items-center px-1.5">
                                        405nm
                                    </div>
                                </div>
                                <div className="flex gap-1 pt-1">
                                    <button className="flex-1 h-5 bg-slate-400 text-white rounded-sm">Starting Frame</button>
                                    <button className="flex-1 h-5 bg-slate-300 text-slate-700 rounded-sm">Frame Interval</button>
                                </div>
                                <div className="text-[10px] text-slate-400 italic">Plot data from Frames: 1, 4, 7, 10, 13, etc.</div>
                                <div className="space-y-1 mt-2">
                                    <div className="text-slate-500 mb-1">Shows:</div>
                                    <TraceItem label="405nm (Trace 1)" color="#439639" checked />
                                    <TraceItem label="470nm (Trace 2)" color="#1e74ad" checked />
                                    <TraceItem label="560nm (Trace 3)" color="#d12e1a" checked />
                                </div>
                            </CollapsibleSection>

                            {/* Trace Display */}
                            <CollapsibleSection
                                title="Trace Display"
                                icon={Eye}
                                isOpen={sections.display}
                                onToggle={() => toggleSection('display')}
                            >
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <div className="w-3 h-3 rounded-full border border-blue-500 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    </div>
                                    <span>Display raw data</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <div className="w-3 h-3 rounded-full border border-slate-300" />
                                    <span>Display preprocessed data (missing frames inserted)</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" className="w-3 h-3" />
                                    <span>Show Trigger</span>
                                    <div className="ml-auto w-24 h-5 border border-slate-200 flex items-center px-1 justify-between bg-slate-50 text-slate-400">
                                        <span>Show All</span>
                                        <ChevronDown size={8} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" className="w-3 h-3" />
                                    <span>Intensity Reference (%)</span>
                                    <div className="ml-auto w-12 h-5 border border-slate-300 bg-white" />
                                </div>
                                <div className="pt-1 text-slate-400 text-center relative flex items-center gap-2">
                                    <div className="flex-1 h-[1px] bg-slate-100" />
                                    <span>Intensity Axis</span>
                                    <div className="flex-1 h-[1px] bg-slate-100" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-slate-500">Maximum Value (%)</span>
                                        <div className="h-5 border border-slate-300 bg-white px-1 flex items-center">100</div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-slate-500">Minimum Value (%)</span>
                                        <div className="h-5 border border-slate-300 bg-white px-1 flex items-center">0</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Show full range on all Y-Axis</span>
                                    <input type="checkbox" className="w-3 h-3" defaultChecked />
                                </div>
                            </CollapsibleSection>

                            {/* Export Settings */}
                            <div className="mt-auto">
                                <CollapsibleSection
                                    title="Export Settings"
                                    icon={Database}
                                    isOpen={sections.export}
                                    onToggle={() => toggleSection('export')}
                                >
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className="w-3 h-3 rounded-full border border-slate-300" />
                                        <span>Export raw data</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className="w-3 h-3 rounded-full border border-blue-500 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        </div>
                                        <span>Export preprocessed data (missing frames inserted)</span>
                                    </label>
                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-slate-500">Fix Missing Frames:</span>
                                        <div className="w-32 h-5 border border-slate-300 flex items-center px-1 justify-between">
                                            <span>Interpolation</span>
                                            <ChevronDown size={10} className="text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <button className="px-4 py-1 bg-slate-100 border border-slate-300 rounded hover:bg-white text-slate-700 shadow-sm font-medium">Export</button>
                                    </div>
                                </CollapsibleSection>
                            </div>
                        </div>
                    )}

                    {/* The Icon Strip */}
                    <div className="w-10 bg-slate-100 border-l border-slate-200 flex flex-col items-center py-2 gap-4 shrink-0 z-10">
                        {/* 1) Arrow Expand/Collapse */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1.5 rounded hover:bg-white hover:shadow-sm text-slate-500 hover:text-slate-800 transition-all"
                            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                        >
                            {sidebarOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </button>

                        <div className="w-6 h-px bg-slate-300" />

                        {/* 2) Trace Settings Icon */}
                        <div className="group/icon relative flex items-center justify-center">
                            <button
                                onClick={() => activateSection('settings')}
                                className={`p-1.5 rounded hover:bg-white hover:shadow-sm transition-all ${sections.settings && sidebarOpen ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-500'}`}
                            >
                                <Target size={16} />
                            </button>
                            {/* Tooltip */}
                            <div className="absolute right-full mr-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/icon:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                                Trace Settings
                            </div>
                        </div>

                        {/* 3) Trace Display Icon */}
                        <div className="group/icon relative flex items-center justify-center">
                            <button
                                onClick={() => activateSection('display')}
                                className={`p-1.5 rounded hover:bg-white hover:shadow-sm transition-all ${sections.display && sidebarOpen ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-500'}`}
                            >
                                <Eye size={16} />
                            </button>
                            <div className="absolute right-full mr-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/icon:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                                Trace Display
                            </div>
                        </div>

                        {/* 4) Export Icon */}
                        <div className="group/icon relative flex items-center justify-center">
                            <button
                                onClick={() => activateSection('export')}
                                className={`p-1.5 rounded hover:bg-white hover:shadow-sm transition-all ${sections.export && sidebarOpen ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-500'}`}
                            >
                                <Database size={16} />
                            </button>
                            <div className="absolute right-full mr-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/icon:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                                Export Settings
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const CollapsibleSection = ({ title, icon: Icon, children, isOpen, onToggle }: { title: string, icon: any, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => {
    return (
        <div className="space-y-3">
            <div
                className="flex items-center gap-2 text-slate-700 font-medium pb-1 border-b border-slate-100 cursor-pointer select-none hover:bg-slate-50 transition-colors group"
                onClick={onToggle}
            >
                <Icon size={14} className="text-blue-500" />
                <span className="text-sm flex-1">{title}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 group-hover:text-slate-600 ${isOpen ? '' : '-rotate-90'}`} />
            </div>
            {isOpen && (
                <div className="space-y-2 px-1 animate-in slide-in-from-top-1 fade-in duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};

const TraceItem = ({ label, color, checked }: { label: string, color: string, checked?: boolean }) => (
    <div className="flex items-center gap-2">
        <label className="flex items-center gap-1.5 cursor-pointer">
            <div className={`w-3 h-3 border border-slate-300 rounded-sm flex items-center justify-center ${checked ? 'bg-blue-600 border-blue-600' : ''}`}>
                {checked && <Check size={8} className="text-white" />}
            </div>
            <span className="text-blue-600">{label}</span>
        </label>
        <div className="ml-auto w-4 h-2 rounded-sm" style={{ backgroundColor: color }} />
    </div>
);

const GraphSection = ({ title, label }: { title: string; label: string }) => {
    return (
        <div className="flex flex-col gap-1 w-full max-w-[800px] mx-auto">
            <div className="flex items-center gap-2 mb-1">
                <input type="checkbox" className="w-3 h-3" />
                <span className="text-[10px] text-slate-500 font-medium">{label}</span>
                <div className="flex-1 text-center font-bold text-xs text-slate-800">{title}</div>
            </div>

            <div className="flex border-l border-b border-slate-400 h-48 relative ml-12 mb-10 w-full bg-white/30">
                {/* Y-Axis Labels */}
                <div className="absolute -left-10 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 h-full py-0">
                    <span>100.00%</span>
                    <span>90.00%</span>
                    <span>80.00%</span>
                    <span>70.00%</span>
                    <span>60.00%</span>
                    <span>50.00%</span>
                    <span>40.00%</span>
                    <span>30.00%</span>
                    <span>20.00%</span>
                    <span>10.00%</span>
                    <span>0.00%</span>
                </div>

                {/* Y-Axis Title */}
                <div className="absolute -left-14 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] italic text-slate-600 font-serif">
                    Intensity
                </div>

                {/* Grid Lines (Mock) */}
                <div className="absolute inset-0 grid grid-rows-10 pointer-events-none opacity-20">
                    {[...Array(11)].map((_, i) => (
                        <div key={i} className="border-t border-slate-300 w-full" />
                    ))}
                </div>

                {/* The Lines (SVG Mock) */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                    <path d="M0,150 L10,140 L20,160 L30,130 L40,145 L50,110 L60,135 L70,80 L80,120 L90,105 L100,140 L110,155 L120,130 L130,115 L140,150 L150,145 L160,110 L170,125 L180,150 L190,135 L200,80 L210,120" fill="none" stroke="#1e74ad" strokeWidth="1" />
                    <path d="M0,130 L10,135 L20,120 L30,140 L40,130 L50,125 L60,130 L70,100 L80,115 L90,140 L100,135 L110,145 L120,140 L130,138 L140,135 L150,140 L160,110 L170,130 L180,40 L190,80" fill="none" stroke="#439639" strokeWidth="1" />
                    <path d="M0,160 L10,165 L20,162 L30,160 L40,158 L50,155 L60,162 L70,165 L80,160 L90,163 L100,165 L110,160 L120,162 L130,165 L140,160 L150,162 L160,165 L170,160 L180,162" fill="none" stroke="#d12e1a" strokeWidth="0.8" />
                </svg>

                {/* X-Axis Labels */}
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[9px] text-slate-500">
                    <span>0:00:05.00</span>
                    <span>0:00:10.00</span>
                    <span>0:00:15.00</span>
                    <span>0:00:20.00</span>
                    <span>0:00:25.00</span>
                    <span>0:00:30.00</span>
                    <span>0:00:35.00</span>
                </div>

                {/* X-Axis Title */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] italic text-slate-600 font-serif whitespace-nowrap">
                    Time (h:mm:ss.ff)
                </div>
            </div>
        </div>
    );
};
