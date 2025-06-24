"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Gamepad2, Keyboard, Mic } from "lucide-react";
import {
    controllerManager,
    getButtonName,
    getControllerButtonState,
    type Controller,
    type HotkeyConfig
} from "@/lib/controllerUtils";
import { useAppStore } from "@/lib/store";

export default function HotkeyConfigForm() {
    const [controllers, setControllers] = useState<Controller[]>([]);
    const [hotkeyConfig, setHotkeyConfig] = useState<HotkeyConfig>({
        keyboardKey: '',
    });
    const [isListening, setIsListening] = useState(false);
    const [listeningFor, setListeningFor] = useState<'keyboard' | 'controller' | null>(null);
    const [flashButtonStates, setFlashButtonStates] = useState<{ [controllerId: string]: boolean }>({});
    const setVoiceChatHotkeySet = useAppStore((s) => s.setVoiceChatHotkeySet);

    useEffect(() => {
        // Get initial state
        setControllers(controllerManager.getControllers());
        setHotkeyConfig(controllerManager.getHotkeyConfig());

        // Listen for controller changes
        const unsubscribeControllers = controllerManager.onControllersChange((newControllers) => {
            setControllers(newControllers);
            // Auto-select the first controller if available and none is selected
            setHotkeyConfig((prevConfig) => {
                if (!prevConfig.controllerId && newControllers.length > 0) {
                    const newConfig = { ...prevConfig, controllerId: newControllers[0].id };
                    controllerManager.setHotkeyConfig(newConfig);
                    return newConfig;
                }
                return prevConfig;
            });
            // Check for button presses to trigger flash
            setFlashButtonStates((prev) => {
                const updated: { [controllerId: string]: boolean } = { ...prev };
                newControllers.forEach((controller) => {
                    // If any button is pressed, flash
                    const anyPressed = controller.buttons.some((btn) => btn.pressed);
                    if (anyPressed && !prev[controller.id]) {
                        updated[controller.id] = true;
                        // Remove flash after 200ms
                        setTimeout(() => {
                            setFlashButtonStates((current) => ({ ...current, [controller.id]: false }));
                        }, 200);
                    } else if (!anyPressed && prev[controller.id]) {
                        updated[controller.id] = false;
                    }
                });
                return updated;
            });
        });

        return () => {
            unsubscribeControllers();
        };
    }, []);

    const handleConfigChange = (updates: Partial<HotkeyConfig>) => {
        const newConfig = { ...hotkeyConfig, ...updates };
        setHotkeyConfig(newConfig);
        controllerManager.setHotkeyConfig(newConfig);
        // Update store state for hotkey presence
        const hotkeySet = (
            (newConfig.keyboardKey && newConfig.keyboardKey.trim() !== "") ||
            (newConfig.controllerId && newConfig.buttonIndex !== undefined)
        );
        setVoiceChatHotkeySet(!!hotkeySet);
    };

    const startListeningForKeyboard = () => {
        setIsListening(true);
        setListeningFor('keyboard');

        const handleKeyDown = (event: KeyboardEvent) => {
            event.preventDefault();
            const key = event.key.toLowerCase();
            handleConfigChange({ keyboardKey: key });
            setIsListening(false);
            setListeningFor(null);
            window.removeEventListener('keydown', handleKeyDown);
        };

        window.addEventListener('keydown', handleKeyDown);
    };

    const startListeningForController = () => {
        setIsListening(true);
        setListeningFor('controller');
    };

    useEffect(() => {
        if (!isListening || listeningFor !== 'controller') return;
        let stopped = false;
        const checkControllerInput = () => {
            if (stopped || !isListening || listeningFor !== 'controller') return;
            for (const controller of controllers) {
                for (let i = 0; i < controller.buttons.length; i++) {
                    if (getControllerButtonState(controller, i)) {
                        handleConfigChange({
                            controllerId: controller.id,
                            buttonIndex: i
                        });
                        setIsListening(false);
                        setListeningFor(null);
                        return;
                    }
                }
            }
            requestAnimationFrame(checkControllerInput);
        };
        checkControllerInput();
        return () => { stopped = true; };
    }, [isListening, listeningFor, controllers]);

    const clearControllerHotkey = () => {
        handleConfigChange({ controllerId: undefined, buttonIndex: undefined });
    };

    const getCurrentHotkeyText = () => {
        if (hotkeyConfig.controllerId && hotkeyConfig.buttonIndex !== undefined) {
            const controller = controllers.find(c => c.id === hotkeyConfig.controllerId);
            let buttonName = getButtonName(hotkeyConfig.buttonIndex);
            // If getButtonName returns a generic name, show the index explicitly
            if (buttonName.startsWith('Button ')) {
                buttonName = `Button ${hotkeyConfig.buttonIndex}`;
            }
            return `${controller?.name || 'Controller'} - ${buttonName}`;
        }
        if (hotkeyConfig.keyboardKey) {
            return `Keyboard - ${hotkeyConfig.keyboardKey.toUpperCase()}`;
        }
        return 'No hotkey set';
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mic className="w-5 h-5" />
                    Voice Chat Hotkey
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Current Hotkey Display */}
                <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm text-muted-foreground">Current Hotkey</Label>
                    <p className="font-mono text-sm mt-1">{getCurrentHotkeyText()}</p>
                </div>

                {/* Keyboard Hotkey */}
                <div className="space-y-3">
                    <Label>Keyboard Hotkey</Label>
                    <div className="flex gap-2">
                        <Input
                            value={hotkeyConfig.keyboardKey?.toUpperCase() || ''}
                            placeholder="No key set..."
                            readOnly
                            className="flex-1"
                        />
                        <Button
                            onClick={startListeningForKeyboard}
                            disabled={isListening && listeningFor === 'controller'}
                            variant="outline"
                            size="sm"
                        >
                            <Keyboard className="w-4 h-4 mr-2" />
                            {isListening && listeningFor === 'keyboard' ? 'Listening...' : 'Set'}
                        </Button>
                    </div>
                </div>

                {/* Controller Hotkey */}
                {controllers.length > 0 && (
                    <div className="space-y-3">
                        <Label>Controller Hotkey</Label>
                        <div className="flex gap-2">
                            <Select
                                value={hotkeyConfig.controllerId || "none"}
                                onValueChange={(controllerId) => {
                                    if (controllerId === "none") {
                                        clearControllerHotkey();
                                    } else {
                                        handleConfigChange({ controllerId });
                                    }
                                }}
                            >
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Select controller" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No controller</SelectItem>
                                    {controllers.map((controller) => (
                                        <SelectItem key={controller.id} value={controller.id}>
                                            {controller.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={startListeningForController}
                                disabled={isListening && listeningFor === 'keyboard' || !hotkeyConfig.controllerId}
                                variant="outline"
                                size="sm"
                            >
                                <Gamepad2 className="w-4 h-4 mr-2" />
                                {isListening && listeningFor === 'controller' ? 'Listening...' : 'Set'}
                            </Button>
                            {(hotkeyConfig.controllerId && hotkeyConfig.buttonIndex !== undefined) && (
                                <Button
                                    onClick={clearControllerHotkey}
                                    variant="outline"
                                    size="sm"
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Connected Controllers */}
                <div className="space-y-2">
                    <Label>Connected Controllers</Label>
                    {controllers.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No controllers detected</p>
                    ) : (
                        <div className="space-y-2">
                            {controllers.map((controller) => (
                                <div
                                    key={controller.id}
                                    className="flex items-center justify-between p-2 bg-muted/30 rounded"
                                >
                                    <span className="text-sm">{controller.name}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            {/* Button pressed indicator (left) */}
                                            <div
                                                className={
                                                    flashButtonStates[controller.id]
                                                        ? "w-2 h-2 bg-yellow-400 rounded-full border border-gray-300"
                                                        : "w-2 h-2 bg-gray-300 rounded-full border border-gray-300"
                                                }
                                                title={flashButtonStates[controller.id] ? "Button pressed" : "No button pressed"}
                                            ></div>
                                            {/* Connected indicator (right) */}
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">Connected</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 