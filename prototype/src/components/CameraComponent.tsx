import { Camera, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface CameraComponentProps {
    id: string;
}

export const CameraComponent = ({ id }: CameraComponentProps) => {
    return (
        <div className="w-full h-full flex flex-col bg-slate-200 dark:bg-slate-800 overflow-hidden">
            {/* Top Row: Contrast Bar + Live View */}
            <div className="flex-1 flex min-h-0">
                {/* Left Sidebar: Contrast Enhancement Bar */}
                <div className="w-8 bg-slate-300 dark:bg-slate-700 border-r border-slate-400 dark:border-slate-600 flex flex-col items-center py-2 gap-0.5 shrink-0">
                    {/* Top Value */}
                    <div className="text-[8px] font-mono text-slate-600 dark:text-slate-400 mb-1">
                        65535
                    </div>

                    {/* Vertical Slider Track */}
                    <div className="flex-1 w-1.5 bg-slate-400 dark:bg-slate-600 rounded-full relative overflow-hidden">
                        {/* Gradient Fill */}
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-full"
                            style={{ height: '60%' }}
                        />
                    </div>

                    {/* Bottom Value */}
                    <div className="text-[8px] font-mono text-slate-600 dark:text-slate-400 mt-1">
                        0
                    </div>

                    {/* Separator */}
                    <div className="w-4 h-px bg-slate-400 dark:bg-slate-600 my-2" />

                    {/* Auto Button */}
                    <button className="w-6 h-6 rounded bg-blue-600 hover:bg-blue-500 text-white text-[8px] font-bold flex items-center justify-center transition-colors">
                        Auto
                    </button>
                </div>

                {/* Light Grey Container - Auto-fills available space, scrolls if black box > available space */}
                <div className="flex-1 bg-slate-200 dark:bg-slate-800 relative flex items-center justify-center min-w-0 p-4 overflow-auto">
                    {/* Live View Black Box - Fixed 5:4 aspect ratio, min 1280x1024, scales up */}
                    <div
                        className="bg-black relative flex items-center justify-center shadow-lg"
                        style={{
                            aspectRatio: '5 / 4',
                            minWidth: '400px',
                            minHeight: '320px',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        {/* Live Indicator & Stats */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                            <div className="text-emerald-400 text-lg font-semibold tracking-wide">
                                Live
                            </div>
                            <div className="text-slate-400 text-[10px] font-mono">
                                Frame Rate: 13.46 FPS
                            </div>
                            <div className="text-slate-400 text-[10px] font-mono">
                                Frame Processing Time: 0 ms
                            </div>
                        </div>

                        {/* Placeholder Camera Icon */}
                        <Camera className="text-slate-800 w-20 h-20 opacity-30" />

                        {/* Camera ID overlay */}
                        <div className="absolute bottom-3 right-3 text-[9px] font-mono text-slate-600">
                            CAM-{id.substring(0, 4).toUpperCase()} • 1280x1024
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Controls Row: Zoom/Pan */}
            <div className="h-10 bg-slate-300 dark:bg-slate-700 border-t border-slate-400 dark:border-slate-600 flex items-center px-2 gap-1.5">
                {/* Zoom In */}
                <button
                    className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-600 hover:bg-slate-100 dark:hover:bg-slate-500 border border-slate-400 dark:border-slate-500 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
                    title="Zoom In"
                >
                    <ZoomIn size={14} />
                </button>
                {/* Zoom Out */}
                <button
                    className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-600 hover:bg-slate-100 dark:hover:bg-slate-500 border border-slate-400 dark:border-slate-500 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
                    title="Zoom Out"
                >
                    <ZoomOut size={14} />
                </button>
                {/* Pan */}
                <button
                    className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-600 hover:bg-slate-100 dark:hover:bg-slate-500 border border-slate-400 dark:border-slate-500 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
                    title="Pan"
                >
                    <Move size={14} />
                </button>
            </div>
        </div>
    );
};
