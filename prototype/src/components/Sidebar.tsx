import { useDraggable, DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Camera, Activity, Lightbulb, Search, Sliders, GripVertical } from 'lucide-react';
import { useState } from 'react';

export interface CameraSettings {
    frameRate: boolean;
    exposureTime: boolean;
    color: string;
}

export interface LedSettings {
    intensity: boolean;
    frequency: boolean;
    color: string;
}

export interface AppSpecSettings {
    camera: CameraSettings;
    led405: LedSettings;
    led470: LedSettings;
    led560: LedSettings;
}

interface SidebarProps {
    usedTypes: string[];
    appSpecSettings: AppSpecSettings;
    onAppSpecSettingsChange: (settings: AppSpecSettings) => void;
    sectionOrder: string[];
    onSectionOrderChange: (order: string[]) => void;
    selectedId: string | null;
    onDelete: () => void;
}

export const Sidebar = ({
    usedTypes = [],
    appSpecSettings,
    onAppSpecSettingsChange,
    sectionOrder,
    onSectionOrderChange,
    selectedId,
    onDelete,
}: SidebarProps) => {
    const [search, setSearch] = useState('');

    // Check if AppSpec is on the canvas
    const isAppSpecOnCanvas = usedTypes.includes('Application Specific Settings');

    const components = [
        { id: 'camera', label: 'Camera', type: 'Camera', icon: Camera, desc: 'Device Feed' },
        { id: 'traces', label: 'Traces', type: 'Traces', icon: Activity, desc: 'Signal Graph' },
        { id: 'led405', label: '405nm LED', type: '405nm LED', icon: Lightbulb, desc: 'Light Source' },
        { id: 'led470', label: '470nm LED', type: '470nm LED', icon: Lightbulb, desc: 'Light Source' },
        { id: 'led560', label: '560nm LED', type: '560nm LED', icon: Lightbulb, desc: 'Light Source' },
        { id: 'app-spec', label: 'Application Specific Settings', type: 'Application Specific Settings', icon: Sliders, desc: 'Fiber Photometry Settings' },

    ];

    const filteredComponents = components.filter(c =>
        c.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full border-r border-border bg-card flex flex-col h-full shrink-0">
            {/* Header */}
            <div className="p-3 border-b border-border space-y-3">
                <div className="space-y-2">
                    <h2 className="text-sm font-semibold">Component Library</h2>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <input
                            className="w-full bg-muted/50 border border-input rounded-md py-1.5 pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-6">

                {/* Devices Section */}
                <div className="space-y-3">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Devices</div>
                    <div className="space-y-2">
                        {filteredComponents.filter(c => c.id !== 'app-spec').map((comp) => (
                            <DraggableItem
                                key={comp.id}
                                component={comp}
                                disabled={usedTypes.includes(comp.label)}
                            />
                        ))}
                    </div>
                </div>

                {/* Application Settings Section */}
                <div className="space-y-3">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Application Specific Settings</div>
                    <div className="space-y-2">
                        {filteredComponents.filter(c => c.id === 'app-spec').map((comp) => (
                            <DraggableItem
                                key={comp.id}
                                component={comp}
                                disabled={usedTypes.includes(comp.label)}
                            />
                        ))}
                    </div>

                    {/* Sortable Settings Sections */}
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={(event) => {
                            const { active, over } = event;
                            if (over && active.id !== over.id) {
                                const oldIndex = sectionOrder.indexOf(active.id as string);
                                const newIndex = sectionOrder.indexOf(over.id as string);
                                onSectionOrderChange(arrayMove(sectionOrder, oldIndex, newIndex));
                            }
                        }}
                    >
                        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                            {sectionOrder.map((sectionId, index) => (
                                <SortableSection
                                    key={sectionId}
                                    id={sectionId}
                                    isFirst={index === 0}
                                    disabled={!isAppSpecOnCanvas}
                                >
                                    {sectionId === 'led405' && (
                                        <SettingsSection
                                            id="led405"
                                            label="405nm LED"
                                            icon={<Lightbulb size={14} className={isAppSpecOnCanvas ? "text-[#1e74ad]" : "text-slate-400"} />}
                                            color={appSpecSettings.led405.color}
                                            onColorChange={(color) => onAppSpecSettingsChange({
                                                ...appSpecSettings,
                                                led405: { ...appSpecSettings.led405, color }
                                            })}
                                            isAllChecked={appSpecSettings.led405.intensity && appSpecSettings.led405.frequency}
                                            onSelectAll={(checked) => onAppSpecSettingsChange({
                                                ...appSpecSettings,
                                                led405: { ...appSpecSettings.led405, intensity: checked, frequency: checked }
                                            })}
                                            disabled={!isAppSpecOnCanvas}
                                        >
                                            <CheckboxRow
                                                label="Intensity (%)"
                                                checked={appSpecSettings.led405.intensity}
                                                disabled={!isAppSpecOnCanvas}
                                                onChange={(checked) => onAppSpecSettingsChange({
                                                    ...appSpecSettings,
                                                    led405: { ...appSpecSettings.led405, intensity: checked }
                                                })}
                                            />
                                            <CheckboxRow
                                                label="Frequency (Hz)"
                                                checked={appSpecSettings.led405.frequency}
                                                disabled={!isAppSpecOnCanvas}
                                                onChange={(checked) => onAppSpecSettingsChange({
                                                    ...appSpecSettings,
                                                    led405: { ...appSpecSettings.led405, frequency: checked }
                                                })}
                                            />
                                        </SettingsSection>
                                    )}

                                    {sectionId === 'led470' && (
                                        <SettingsSection
                                            id="led470"
                                            label="470nm LED"
                                            icon={<Lightbulb size={14} className={isAppSpecOnCanvas ? "text-[#439639]" : "text-slate-400"} />}
                                            color={appSpecSettings.led470.color}
                                            onColorChange={(color) => onAppSpecSettingsChange({
                                                ...appSpecSettings,
                                                led470: { ...appSpecSettings.led470, color }
                                            })}
                                            isAllChecked={appSpecSettings.led470.intensity && appSpecSettings.led470.frequency}
                                            onSelectAll={(checked) => onAppSpecSettingsChange({
                                                ...appSpecSettings,
                                                led470: { ...appSpecSettings.led470, intensity: checked, frequency: checked }
                                            })}
                                            disabled={!isAppSpecOnCanvas}
                                        >
                                            <CheckboxRow
                                                label="Intensity (%)"
                                                checked={appSpecSettings.led470.intensity}
                                                disabled={!isAppSpecOnCanvas}
                                                onChange={(checked) => onAppSpecSettingsChange({
                                                    ...appSpecSettings,
                                                    led470: { ...appSpecSettings.led470, intensity: checked }
                                                })}
                                            />
                                            <CheckboxRow
                                                label="Frequency (Hz)"
                                                checked={appSpecSettings.led470.frequency}
                                                disabled={!isAppSpecOnCanvas}
                                                onChange={(checked) => onAppSpecSettingsChange({
                                                    ...appSpecSettings,
                                                    led470: { ...appSpecSettings.led470, frequency: checked }
                                                })}
                                            />
                                        </SettingsSection>
                                    )}

                                    {sectionId === 'led560' && (
                                        <SettingsSection
                                            id="led560"
                                            label="560nm LED"
                                            icon={<Lightbulb size={14} className={isAppSpecOnCanvas ? "text-[#d12e1a]" : "text-slate-400"} />}
                                            color={appSpecSettings.led560.color}
                                            onColorChange={(color) => onAppSpecSettingsChange({
                                                ...appSpecSettings,
                                                led560: { ...appSpecSettings.led560, color }
                                            })}
                                            isAllChecked={appSpecSettings.led560.intensity && appSpecSettings.led560.frequency}
                                            onSelectAll={(checked) => onAppSpecSettingsChange({
                                                ...appSpecSettings,
                                                led560: { ...appSpecSettings.led560, intensity: checked, frequency: checked }
                                            })}
                                            disabled={!isAppSpecOnCanvas}
                                        >
                                            <CheckboxRow
                                                label="Intensity (%)"
                                                checked={appSpecSettings.led560.intensity}
                                                disabled={!isAppSpecOnCanvas}
                                                onChange={(checked) => onAppSpecSettingsChange({
                                                    ...appSpecSettings,
                                                    led560: { ...appSpecSettings.led560, intensity: checked }
                                                })}
                                            />
                                            <CheckboxRow
                                                label="Frequency (Hz)"
                                                checked={appSpecSettings.led560.frequency}
                                                disabled={!isAppSpecOnCanvas}
                                                onChange={(checked) => onAppSpecSettingsChange({
                                                    ...appSpecSettings,
                                                    led560: { ...appSpecSettings.led560, frequency: checked }
                                                })}
                                            />
                                        </SettingsSection>
                                    )}

                                    {sectionId === 'camera' && (
                                        <SettingsSection
                                            id="camera"
                                            label="Camera"
                                            icon={<Camera size={14} className={isAppSpecOnCanvas ? "text-slate-600" : "text-slate-400"} />}
                                            color={appSpecSettings.camera.color}
                                            onColorChange={(color) => onAppSpecSettingsChange({
                                                ...appSpecSettings,
                                                camera: { ...appSpecSettings.camera, color }
                                            })}
                                            isAllChecked={appSpecSettings.camera.frameRate && appSpecSettings.camera.exposureTime}
                                            onSelectAll={(checked) => onAppSpecSettingsChange({
                                                ...appSpecSettings,
                                                camera: { ...appSpecSettings.camera, frameRate: checked, exposureTime: checked }
                                            })}
                                            disabled={!isAppSpecOnCanvas}
                                        >
                                            <CheckboxRow
                                                label="Frame Rate (Hz)"
                                                checked={appSpecSettings.camera.frameRate}
                                                disabled={!isAppSpecOnCanvas}
                                                onChange={(checked) => onAppSpecSettingsChange({
                                                    ...appSpecSettings,
                                                    camera: { ...appSpecSettings.camera, frameRate: checked }
                                                })}
                                            />
                                            <CheckboxRow
                                                label="Exposure Time (ms)"
                                                checked={appSpecSettings.camera.exposureTime}
                                                disabled={!isAppSpecOnCanvas}
                                                onChange={(checked) => onAppSpecSettingsChange({
                                                    ...appSpecSettings,
                                                    camera: { ...appSpecSettings.camera, exposureTime: checked }
                                                })}
                                            />
                                        </SettingsSection>
                                    )}
                                </SortableSection>
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>

            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border bg-muted/20">
                <button
                    onClick={onDelete}
                    disabled={!selectedId}
                    className="w-full py-2 px-3 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:border-border rounded-md text-xs font-medium transition-colors"
                >
                    Remove Component
                </button>
            </div>
        </div>
    );
};

/* Draggable Item Component */
const DraggableItem = ({ component, disabled }: { component: any, disabled?: boolean }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `lib-${component.id}`,
        data: {
            label: component.type,
            type: component.type
        },
        disabled: disabled
    });

    const Icon = component.icon;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`
                flex items-center gap-3 p-3 rounded border border-border transition-all select-none
                ${disabled
                    ? 'opacity-50 cursor-not-allowed bg-muted/50'
                    : 'bg-white shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-md'
                }
                ${isDragging ? 'opacity-50 ring-2 ring-primary' : ''}
            `}
        >
            <div className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 ${disabled ? 'bg-transparent border-transparent text-muted-foreground' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                <Icon size={16} />
            </div>
            <div className="flex flex-col min-w-0">
                <span className={`text-sm font-medium truncate ${disabled ? 'text-muted-foreground' : 'text-slate-800'}`}>{component.label}</span>
                <span className="text-[10px] text-slate-500 truncate">{component.desc}</span>
            </div>
        </div>
    );
};

/* Sortable Section Wrapper */
interface SortableSectionProps {
    id: string;
    children: React.ReactNode;
    isFirst: boolean;
    disabled: boolean;
}

const SortableSection = ({ id, children, isFirst, disabled }: SortableSectionProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id, disabled });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : undefined
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={isFirst ? 'mt-4' : 'mt-3'}
        >
            <div className="flex items-start gap-1">
                <div
                    {...attributes}
                    {...listeners}
                    className={`mt-3 shrink-0 ${disabled ? 'opacity-30 cursor-not-allowed' : 'opacity-40 hover:opacity-100 cursor-grab active:cursor-grabbing'} transition-opacity`}
                >
                    <GripVertical size={14} className="text-slate-400" />
                </div>
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

/* Settings Section Component */
interface SettingsSectionProps {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    onColorChange: (color: string) => void;
    isAllChecked: boolean;
    onSelectAll: (checked: boolean) => void;
    disabled: boolean;
    children: React.ReactNode;
}

const SettingsSection = ({
    label,
    icon,
    color,
    onColorChange,
    isAllChecked,
    onSelectAll,
    disabled,
    children
}: SettingsSectionProps) => {
    return (
        <div className={`p-3 border border-border rounded-md shadow-sm space-y-3 transition-opacity ${!disabled ? 'bg-white' : 'bg-slate-100 opacity-50'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isAllChecked}
                        disabled={disabled}
                        onChange={(e) => onSelectAll(e.target.checked)}
                        className={`w-3.5 h-3.5 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50 ${!disabled ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        title="Select All"
                    />
                    {icon}
                    <span className={`text-xs font-semibold ${!disabled ? 'text-slate-700' : 'text-slate-400'}`}>{label}</span>
                </div>
                <input
                    type="color"
                    value={color}
                    disabled={disabled}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Choose color"
                />
            </div>
            <div className="space-y-2 pl-5">
                {children}
            </div>
        </div>
    );
};

/* Checkbox Row Component */
interface CheckboxRowProps {
    label: string;
    checked: boolean;
    disabled: boolean;
    onChange: (checked: boolean) => void;
}

const CheckboxRow = ({ label, checked, disabled, onChange }: CheckboxRowProps) => {
    return (
        <label className={`flex items-center gap-2 ${!disabled ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={(e) => onChange(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50"
            />
            <span className={`text-xs ${!disabled ? 'text-slate-600' : 'text-slate-400'}`}>{label}</span>
        </label>
    );
};
