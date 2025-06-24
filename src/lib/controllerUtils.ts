export interface Controller {
    id: string;
    name: string;
    connected: boolean;
    buttons: GamepadButton[];
    axes: number[];
}

export interface HotkeyConfig {
    controllerId?: string;
    buttonIndex?: number;
    keyboardKey?: string;
}

class ControllerManager {
    private controllers: Map<string, Controller> = new Map();
    private hotkeyConfig: HotkeyConfig = {
        // No default hotkey
    };
    private listeners: Set<(controllers: Controller[]) => void> = new Set();
    private hotkeyListeners: Set<() => void> = new Set();
    private animationFrameId: number | null = null;
    private isInitialized = false;

    constructor() {
        // Only initialize on client-side
        if (typeof window !== 'undefined') {
            this.init();
        }
    }

    private init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        // Listen for controller connections/disconnections
        window.addEventListener('gamepadconnected', this.handleGamepadConnected.bind(this));
        window.addEventListener('gamepaddisconnected', this.handleGamepadDisconnected.bind(this));

        // Listen for keyboard events
        window.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Start polling for controller state
        this.startPolling();
    }

    private handleGamepadConnected(event: GamepadEvent) {
        const gamepad = event.gamepad;
        const controller: Controller = {
            id: gamepad.id,
            name: gamepad.id,
            connected: true,
            buttons: [...gamepad.buttons],
            axes: [...gamepad.axes],
        };

        this.controllers.set(gamepad.id, controller);
        this.notifyListeners();

        console.log(`Controller connected: ${gamepad.id}`);
    }

    private handleGamepadDisconnected(event: GamepadEvent) {
        const gamepad = event.gamepad;
        this.controllers.delete(gamepad.id);
        this.notifyListeners();

        console.log(`Controller disconnected: ${gamepad.id}`);
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (this.hotkeyConfig.keyboardKey === event.key.toLowerCase()) {
            event.preventDefault();
            this.triggerVoiceChat();
        }
    }

    private startPolling() {
        const pollControllers = () => {
            const gamepads = navigator.getGamepads();
            let hasChanges = false;

            for (const gamepad of gamepads) {
                if (!gamepad) continue;

                const existingController = this.controllers.get(gamepad.id);
                if (existingController) {
                    // Log all button presses for debugging
                    gamepad.buttons.forEach((button, index) => {
                        if (button.pressed) {
                            console.log(`Controller ${gamepad.id} - Button ${index} (${getButtonName(index)}) pressed`);
                        }
                    });

                    // Check if button states have changed
                    const buttonPressed = gamepad.buttons.some(button => button.pressed);
                    if (buttonPressed &&
                        this.hotkeyConfig.controllerId === gamepad.id &&
                        this.hotkeyConfig.buttonIndex !== undefined) {

                        const targetButton = gamepad.buttons[this.hotkeyConfig.buttonIndex];
                        if (targetButton && targetButton.pressed) {
                            console.log(`Hotkey triggered! Button ${this.hotkeyConfig.buttonIndex} pressed on controller ${gamepad.id}`);
                            this.triggerVoiceChat();
                        }
                    }

                    // Update controller state
                    existingController.buttons = [...gamepad.buttons];
                    existingController.axes = [...gamepad.axes];
                    hasChanges = true;
                }
            }

            if (hasChanges) {
                this.notifyListeners();
            }

            this.animationFrameId = requestAnimationFrame(pollControllers);
        };

        pollControllers();
    }

    private triggerVoiceChat() {
        console.log('Voice chat hotkey triggered!');
        this.hotkeyListeners.forEach(listener => listener());
    }

    private notifyListeners() {
        const controllers = Array.from(this.controllers.values());
        this.listeners.forEach(listener => listener(controllers));
    }

    // Public API
    public getControllers(): Controller[] {
        return Array.from(this.controllers.values());
    }

    public getHotkeyConfig(): HotkeyConfig {
        return { ...this.hotkeyConfig };
    }

    public setHotkeyConfig(config: Partial<HotkeyConfig>) {
        this.hotkeyConfig = { ...this.hotkeyConfig, ...config };
    }

    public onControllersChange(listener: (controllers: Controller[]) => void) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    public onVoiceChatTrigger(listener: () => void) {
        this.hotkeyListeners.add(listener);
        return () => this.hotkeyListeners.delete(listener);
    }

    public destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.listeners.clear();
        this.hotkeyListeners.clear();
    }
}

// Create singleton instance
export const controllerManager = new ControllerManager();

// Utility functions
export const getButtonName = (index: number): string => {
    return `Button ${index}`;
};

export const getControllerButtonState = (controller: Controller, buttonIndex: number): boolean => {
    return controller.buttons[buttonIndex]?.pressed || false;
}; 