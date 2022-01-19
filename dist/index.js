"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _OverlayWindow_electronWindow, _OverlayWindow_isFocused, _OverlayWindow_willBeFocused, _OverlayWindow_macTitleBarHeight, _OverlayWindow_attachToOptions, _OverlayWindow_handleFullscreen, _OverlayWindow_updateOverlayBounds, _OverlayWindow_handler, _OverlayWindow_calculateMacTitleBarHeight, _OverlayWindow_adjustBoundsForMacTitleBar;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverlayWindow = void 0;
const events_1 = require("events");
const path_1 = require("path");
const throttle_debounce_1 = require("throttle-debounce");
const electron_1 = require("electron");
const electron_2 = require("electron");
const lib = require('node-gyp-build')((0, path_1.join)(__dirname, '..'));
var EventType;
(function (EventType) {
    EventType[EventType["EVENT_ATTACH"] = 1] = "EVENT_ATTACH";
    EventType[EventType["EVENT_FOCUS"] = 2] = "EVENT_FOCUS";
    EventType[EventType["EVENT_BLUR"] = 3] = "EVENT_BLUR";
    EventType[EventType["EVENT_DETACH"] = 4] = "EVENT_DETACH";
    EventType[EventType["EVENT_FULLSCREEN"] = 5] = "EVENT_FULLSCREEN";
    EventType[EventType["EVENT_MOVERESIZE"] = 6] = "EVENT_MOVERESIZE";
})(EventType || (EventType = {}));
const isMac = process.platform === 'darwin';
class OverlayWindow extends events_1.EventEmitter {
    static activateOverlay() {
        __classPrivateFieldSet(OverlayWindow, _a, 'overlay', "f", _OverlayWindow_willBeFocused);
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setIgnoreMouseEvents(false);
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).focus();
    }
    static focusTarget() {
        __classPrivateFieldSet(OverlayWindow, _a, 'target', "f", _OverlayWindow_willBeFocused);
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setIgnoreMouseEvents(true);
        lib.focusTarget();
    }
    static attachTo(overlayWindow, targetWindowTitle, options = {}) {
        if (__classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow)) {
            throw new Error('Library can be initialized only once.');
        }
        else {
            __classPrivateFieldSet(OverlayWindow, _a, overlayWindow, "f", _OverlayWindow_electronWindow);
        }
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).on('blur', () => {
            if (!__classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_isFocused) &&
                __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_willBeFocused) !== 'target') {
                __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).hide();
            }
        });
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).on('focus', () => {
            __classPrivateFieldSet(OverlayWindow, _a, undefined, "f", _OverlayWindow_willBeFocused);
        });
        __classPrivateFieldSet(OverlayWindow, _a, options, "f", _OverlayWindow_attachToOptions);
        if (isMac) {
            __classPrivateFieldGet(OverlayWindow, _a, "m", _OverlayWindow_calculateMacTitleBarHeight).call(OverlayWindow);
        }
        lib.start(__classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).getNativeWindowHandle(), targetWindowTitle, __classPrivateFieldGet(OverlayWindow, _a, "m", _OverlayWindow_handler));
    }
}
exports.OverlayWindow = OverlayWindow;
_a = OverlayWindow, _OverlayWindow_handleFullscreen = async function _OverlayWindow_handleFullscreen(isFullscreen) {
    if (isMac) {
        // On Mac, only a single app can be fullscreen, so we can't go
        // fullscreen. We get around it by making it display on all workspaces,
        // based on code from:
        // https://github.com/electron/electron/issues/10078#issuecomment-754105005
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setVisibleOnAllWorkspaces(isFullscreen, { visibleOnFullScreen: true });
        if (isFullscreen) {
            const display = electron_1.screen.getPrimaryDisplay();
            __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setBounds(display.bounds);
        }
        else {
            // Set it back to `lastBounds` as set before fullscreen
            __classPrivateFieldGet(OverlayWindow, _a, "m", _OverlayWindow_updateOverlayBounds).call(OverlayWindow);
        }
    }
    else {
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setFullScreen(isFullscreen);
    }
}, _OverlayWindow_updateOverlayBounds = function _OverlayWindow_updateOverlayBounds() {
    let lastBounds = __classPrivateFieldGet(OverlayWindow, _a, "m", _OverlayWindow_adjustBoundsForMacTitleBar).call(OverlayWindow, OverlayWindow.bounds);
    if (lastBounds.width != 0 && lastBounds.height != 0) {
        if (process.platform === 'win32') {
            lastBounds = electron_1.screen.screenToDipRect(__classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow), OverlayWindow.bounds);
        }
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setBounds(lastBounds);
        if (process.platform === 'win32') {
            // if moved to screen with different DPI, 2nd call to setBounds will correctly resize window
            // dipRect must be recalculated as well
            lastBounds = electron_1.screen.screenToDipRect(__classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow), OverlayWindow.bounds);
            __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setBounds(lastBounds);
        }
    }
}, _OverlayWindow_handler = function _OverlayWindow_handler(e) {
    switch (e.type) {
        case EventType.EVENT_ATTACH:
            OverlayWindow.events.emit('attach', e);
            break;
        case EventType.EVENT_FOCUS:
            OverlayWindow.events.emit('focus', e);
            break;
        case EventType.EVENT_BLUR:
            OverlayWindow.events.emit('blur', e);
            break;
        case EventType.EVENT_DETACH:
            OverlayWindow.events.emit('detach', e);
            break;
        case EventType.EVENT_FULLSCREEN:
            OverlayWindow.events.emit('fullscreen', e);
            break;
        case EventType.EVENT_MOVERESIZE:
            OverlayWindow.events.emit('moveresize', e);
            break;
    }
}, _OverlayWindow_calculateMacTitleBarHeight = function _OverlayWindow_calculateMacTitleBarHeight() {
    const testWindow = new electron_2.BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            nodeIntegration: true
        },
        show: false,
    });
    const fullHeight = testWindow.getSize()[1];
    const contentHeight = testWindow.getContentSize()[1];
    __classPrivateFieldSet(OverlayWindow, _a, fullHeight - contentHeight, "f", _OverlayWindow_macTitleBarHeight);
    testWindow.close();
}, _OverlayWindow_adjustBoundsForMacTitleBar = function _OverlayWindow_adjustBoundsForMacTitleBar(bounds) {
    if (!isMac || !__classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_attachToOptions).hasTitleBarOnMac) {
        return bounds;
    }
    const newBounds = {
        ...bounds,
        y: bounds.y + __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_macTitleBarHeight),
        height: bounds.height - __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_macTitleBarHeight)
    };
    return newBounds;
};
_OverlayWindow_electronWindow = { value: void 0 };
/** Exposed so that apps can get the current bounds of the target */
OverlayWindow.bounds = { x: 0, y: 0, width: 0, height: 0 };
_OverlayWindow_isFocused = { value: false };
_OverlayWindow_willBeFocused = { value: void 0 };
/** The height of a title bar on a standard window. Only measured on Mac */
_OverlayWindow_macTitleBarHeight = { value: 0 };
_OverlayWindow_attachToOptions = { value: {} };
OverlayWindow.events = new events_1.EventEmitter();
OverlayWindow.WINDOW_OPTS = {
    fullscreenable: true,
    skipTaskbar: true,
    frame: false,
    show: false,
    transparent: true,
    // let Chromium to accept any size changes from OS
    resizable: true,
    // disable shadow for Mac OS
    hasShadow: false,
    // float above all windows on Mac OS
    alwaysOnTop: isMac
};
(() => {
    OverlayWindow.events.on('attach', (e) => {
        __classPrivateFieldSet(OverlayWindow, _a, true, "f", _OverlayWindow_isFocused);
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setIgnoreMouseEvents(true);
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).showInactive();
        if (process.platform === 'linux') {
            __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setSkipTaskbar(true);
        }
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setAlwaysOnTop(true, 'screen-saver');
        if (e.isFullscreen !== undefined) {
            __classPrivateFieldGet(OverlayWindow, _a, "m", _OverlayWindow_handleFullscreen).call(OverlayWindow, e.isFullscreen);
        }
        OverlayWindow.bounds = e;
        __classPrivateFieldGet(OverlayWindow, _a, "m", _OverlayWindow_updateOverlayBounds).call(OverlayWindow);
    });
    OverlayWindow.events.on('fullscreen', (e) => {
        __classPrivateFieldGet(OverlayWindow, _a, "m", _OverlayWindow_handleFullscreen).call(OverlayWindow, e.isFullscreen);
    });
    OverlayWindow.events.on('detach', () => {
        __classPrivateFieldSet(OverlayWindow, _a, false, "f", _OverlayWindow_isFocused);
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).hide();
    });
    const dispatchMoveresize = (0, throttle_debounce_1.throttle)(34 /* 30fps */, __classPrivateFieldGet(OverlayWindow, _a, "m", _OverlayWindow_updateOverlayBounds));
    OverlayWindow.events.on('moveresize', (e) => {
        OverlayWindow.bounds = e;
        dispatchMoveresize();
    });
    OverlayWindow.events.on('blur', () => {
        __classPrivateFieldSet(OverlayWindow, _a, false, "f", _OverlayWindow_isFocused);
        if (isMac || __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_willBeFocused) !== 'overlay' && !__classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).isFocused()) {
            __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).hide();
        }
    });
    OverlayWindow.events.on('focus', () => {
        __classPrivateFieldSet(OverlayWindow, _a, undefined, "f", _OverlayWindow_willBeFocused);
        __classPrivateFieldSet(OverlayWindow, _a, true, "f", _OverlayWindow_isFocused);
        __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setIgnoreMouseEvents(true);
        if (!__classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).isVisible()) {
            __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).showInactive();
            if (process.platform === 'linux') {
                __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setSkipTaskbar(true);
            }
            __classPrivateFieldGet(OverlayWindow, _a, "f", _OverlayWindow_electronWindow).setAlwaysOnTop(true, 'screen-saver');
        }
    });
})();
//# sourceMappingURL=index.js.map