"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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

export default function HotkeyConfigForm() {
    const [controllers, setControllers] = useState<Controller[]>([]);
    const [hotkeyConfig, setHotkeyConfig] = useState<HotkeyConfig>({
        enabled: false,
        keyboardKey: 'v',
    });
    const [isListening, setIsListening] = useState(false);
    const [listeningFor, setListeningFor] = useState<'keyboard' | 'controller' | null>(null);

    useEffect(() => {
        // Get initial state
        setControllers(controllerManager.getControllers());
        setHotkeyConfig(controllerManager.getHotkeyConfig());

        // Listen for controller changes
        const unsubscribeControllers = controllerManager.onControllersChange(setControllers);

        // Listen for voice chat triggers
        const unsubscribeVoiceChat = controllerManager.onVoiceChatTrigger(() => {
            console.log('Voice chat triggered via hotkey!');
            // TODO: Implement voice chat activation
        });

        return () => {
            unsubscribeControllers();
            unsubscribeVoiceChat();
        };
    }, []);

    const handleConfigChange = (updates: Partial<HotkeyConfig>) => {
        const newConfig = { ...hotkeyConfig, ...updates };
        setHotkeyConfig(newConfig);
        controllerManager.setHotkeyConfig(newConfig);
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

        const checkControllerInput = () => {
            if (!isListening || listeningFor !== 'controller') return;

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
    };

    const clearControllerHotkey = () => {
        handleConfigChange({ controllerId: undefined, buttonIndex: undefined });
    };

    const getCurrentHotkeyText = () => {
        if (hotkeyConfig.controllerId && hotkeyConfig.buttonIndex !== undefined) {
            const controller = controllers.find(c => c.id === hotkeyConfig.controllerId);
            const buttonName = getButtonName(hotkeyConfig.buttonIndex);
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
                {/* Enable/Disable */}
                <div className="flex items-center justify-between">
                    <Label htmlFor="enable-hotkey">Enable Voice Chat Hotkey</Label>
                    <Switch
                        id="enable-hotkey"
                        checked={hotkeyConfig.enabled}
                        onCheckedChange={(enabled) => handleConfigChange({ enabled })}
                    />
                </div>

                {hotkeyConfig.enabled && (
                    <>
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
                                    placeholder="Press a key..."
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
                                {hotkeyConfig.controllerId && hotkeyConfig.buttonIndex !== undefined && (
                                    <p className="text-sm text-muted-foreground">
                                        Button: {getButtonName(hotkeyConfig.buttonIndex)}
                                    </p>
                                )}
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
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-xs text-muted-foreground">Connected</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
} 