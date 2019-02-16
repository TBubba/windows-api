export type EnumWindowsCallback = (windowHandle: number) => boolean;

export enum ShowWindowValue {
  /** Hides the window and activates another window. */
  SW_HIDE = 0,
  /** Activates and displays a window. If the window is minimized or maximized, the system restores it to its original size and position. An application should specify this flag when displaying the window for the first time. */
  SW_SHOWNORMAL = 1,
  /** Activates the window and displays it as a minimized window. */
  SW_SHOWMINIMIZED = 2,
  /** Activates the window and displays it as a maximized window. */
  SW_SHOWMAXIMIZED = 3,
  /** Maximizes the specified window. */
  SW_MAXIMIZE = 3,
  /** Displays a window in its most recent size and position. This value is similar to SW_SHOWNORMAL, except that the window is not activated. */
  SW_SHOWNOACTIVATE = 4,
  /** Activates the window and displays it in its current size and position. */
  SW_SHOW = 5,
  /** Minimizes the specified window and activates the next top-level window in the Z order. */
  SW_MINIMIZE = 6,
  /** Displays the window as a minimized window. This value is similar to SW_SHOWMINIMIZED, except the window is not activated. */
  SW_SHOWMINNOACTIVE = 7,
  /** Displays the window in its current size and position. This value is similar to SW_SHOW, except that the window is not activated. */
  SW_SHOWNA = 8,
  /** Activates and displays the window. If the window is minimized or maximized, the system restores it to its original size and position. An application should specify this flag when restoring a minimized window. */
  SW_RESTORE = 9,
  /** Sets the show state based on the SW_ value specified in the STARTUPINFO structure passed to the CreateProcess function by the program that started the application. */
  SW_SHOWDEFAULT = 10,
  /** Minimizes a window, even if the thread that owns the window is not responding. This flag should only be used when minimizing windows from a different thread. */
  SW_FORCEMINIMIZE = 11,
}

export type Rect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

/** Used by SendInput to store information for synthesizing input events such as keystrokes, mouse movement, and mouse clicks. */
export type Input = Partial<{
  type: InputType.INPUT_MOUSE;
  input: MOUSEINPUT;
} | {
  type: InputType.INPUT_KEYBOARD;
  input: KEYBDINPUT;
} | {
  type: InputType.INPUT_HARDWARE;
  input: HARDWAREINPUT;
}>;

export enum InputType {
  /** The event is a mouse event. */
  INPUT_MOUSE = 0,
  /** The event is a keyboard event. */
  INPUT_KEYBOARD = 1,
  /** The event is a hardware event. */
  INPUT_HARDWARE = 2,
}

/**
 * Contains information about a simulated mouse event.
 * 
 * If the mouse has moved, indicated by MOUSEEVENTF_MOVE, dxand dy specify information about that movement. The
 * information is specified as absolute or relative integer values.
 * 
 * If MOUSEEVENTF_ABSOLUTE value is specified, dx and dy contain normalized absolute coordinates between 0 and 65,535.
 * The event procedure maps these coordinates onto the display surface. Coordinate (0,0) maps onto the upper-left
 * corner of the display surface; coordinate (65535,65535) maps onto the lower-right corner. In a multimonitor system,
 * the coordinates map to the primary monitor.
 * 
 * If MOUSEEVENTF_VIRTUALDESK is specified, the coordinates map to the entire virtual desktop.
 * 
 * If the MOUSEEVENTF_ABSOLUTE value is not specified, dxand dy specify movement relative to the previous mouse event
 * (the last reported position). Positive values mean the mouse moved right (or down); negative values mean the mouse
 * moved left (or up).
 * 
 * Relative mouse motion is subject to the effects of the mouse speed and the two-mouse threshold values. A user sets
 * these three values with the Pointer Speed slider of the Control Panel's Mouse Properties sheet. You can obtain and
 * set these values using the SystemParametersInfo function.
 * 
 * The system applies two tests to the specified relative mouse movement. If the specified distance along either the
 * x or y axis is greater than the first mouse threshold value, and the mouse speed is not zero, the system doubles
 * the distance. If the specified distance along either the x or y axis is greater than the second mouse threshold
 * value, and the mouse speed is equal to two, the system doubles the distance that resulted from applying the first
 * threshold test. It is thus possible for the system to multiply specified relative mouse movement along the x or y
 * axis by up to four times.
 */
export type MOUSEINPUT = Partial<{
  /**
   * The absolute position of the mouse, or the amount of motion since the last mouse event was generated, depending
   * on the value of the dwFlags member. Absolute data is specified as the x coordinate of the mouse; relative data is
   * specified as the number of pixels moved.
   */
  dx: number;
  /** The absolute position of the mouse, or the amount of motion since the last mouse event was generated, depending
   * on the value of the dwFlags member. Absolute data is specified as the y coordinate of the mouse; relative data is
   * specified as the number of pixels moved.
   */
  dy: number;
  /**
   * If dwFlags contains MOUSEEVENTF_WHEEL, then mouseData specifies the amount of wheel movement. A positive
   * value indicates that the wheel was rotated forward, away from the user; a negative value indicates that the wheel
   * was rotated backward, toward the user. One wheel click is defined as WHEEL_DELTA, which is 120.
   * 
   * Windows Vista: If dwFlags contains MOUSEEVENTF_HWHEEL, then dwData specifies the amount of wheel movement. A positive
   * value indicates that the wheel was rotated to the right; a negative value indicates that the wheel was rotated to the
   * left. One wheel click is defined as WHEEL_DELTA, which is 120.
   * 
   * If dwFlags does not contain MOUSEEVENTF_WHEEL, MOUSEEVENTF_XDOWN, or MOUSEEVENTF_XUP, then mouseData should be zero.
   * If dwFlags contains MOUSEEVENTF_XDOWN or MOUSEEVENTF_XUP, then mouseData specifies which X buttons were pressed or
   * released. This value may be any combination of the following flags.
   */
  mouseData: number;
  /**
   * A set of bit flags that specify various aspects of mouse motion and button clicks. The bits in this member can be any
   * reasonable combination of the following values.
   * 
   * The bit flags that specify mouse button status are set to indicate changes in status, not ongoing conditions. For
   * example, if the left mouse button is pressed and held down, MOUSEEVENTF_LEFTDOWN is set when the left button
   * is first pressed, but not for subsequent motions. Similarly, MOUSEEVENTF_LEFTUP is set only when the button is first
   * released.
   * 
   * You cannot specify both the MOUSEEVENTF_WHEEL flag and either MOUSEEVENTF_XDOWN orMOUSEEVENTF_XUP flags simultaneously
   * in the dwFlags parameter, because they both require use of the mouseData field.
   */
  flags: number;
  /** The time stamp for the event, in milliseconds. If this parameter is 0, the system will provide its own time stamp. */
  time: number;
  /**
   * An additional value associated with the mouse event. An application calls GetMessageExtraInfo to obtain this extra
   * information.
   */
  extraInfo: number;
}>;

export enum MOUSEEVENTF {
  /**
   * The dx and dy members contain normalized absolute coordinates. If the flag is not set, dx and dy contain relative data
   * (the change in position since the last reported position). This flag can be set, or not set, regardless of what kind
   * of mouse or other pointing device, if any, is connected to the system. For further information about relative mouse
   * motion, see the following Remarks section.
   */
  ABSOLUTE = 0x8000,
  /**
   * The wheel was moved horizontally, if the mouse has a wheel. The amount of movement is specified in mouseData.
   * Windows XP/2000: This value is not supported.
   */
  HWHEEL = 0x01000,
  /** Movement occurred. */
  MOVE = 0x0001,
  /**
   * The WM_MOUSEMOVE messages will not be coalesced. The default behavior is to coalesce WM_MOUSEMOVE messages.
   * Windows XP/2000:  This value is not supported.
   */
  MOVE_NOCOALESCE = 0x2000,
  /** The left button was pressed. */
  LEFTDOWN = 0x0002,
  /** The left button was released. */
  LEFTUP = 0x0004,
  /** The right button was pressed. */
  RIGHTDOWN = 0x0008,
  /** The right button was released. */
  RIGHTUP = 0x0010,
  /** The middle button was pressed. */
  MIDDLEDOWN = 0x0020,
  /** The middle button was released. */
  MIDDLEUP = 0x0040,
  /** Maps coordinates to the entire desktop. Must be used with MOUSEEVENTF_ABSOLUTE. */
  VIRTUALDESK = 0x4000,
  /** The wheel was moved, if the mouse has a wheel. The amount of movement is specified in mouseData. */
  WHEEL = 0x0800,
  /** An X button was pressed. */
  XDOWN = 0x0080,
  /** An X button was released. */
  XUP = 0x0100,
}

export enum KEYEVENTF {
  /** If specified, the scan code was preceded by a prefix byte that has the value 0xE0 (224). */
  EXTENDEDKEY = 0x0001,
  /** If specified, the key is being released. If not specified, the key is being pressed. */
  KEYUP = 0x0002,
  /** If specified, wScan identifies the key and wVk is ignored. */
  SCANCODE = 0x0008,
  /** If specified, the system synthesizes a VK_PACKET keystroke. The wVk parameter must be zero. This flag can only be combined with the KEYEVENTF_KEYUP flag. For more information, see the Remarks section. */
  UNICODE = 0x0004,
}

export enum MouseData {
  /** Set if the first X button is pressed or released. */
  XBUTTON1 = 1,
  /** Set if the second X button is pressed or released. */
  XBUTTON2 = 2,
}

/** Contains information about a simulated keyboard event. */
export type KEYBDINPUT = Partial<{
  /**
   * A virtual-key code. The code must be a value in the range 1 to 254. If the dwFlags member specifies KEYEVENTF_UNICODE,
   * wVk must be 0.
   */
  vk: number;
  /**
   * A hardware scan code for the key. If dwFlags specifies KEYEVENTF_UNICODE, wScan specifies a Unicode character which is
   * to be sent to the foreground application.
   */
  scan: number;
  /** Specifies various aspects of a keystroke. This member can be certain combinations of the following values. */
  flags: number;
  /** The time stamp for the event, in milliseconds. If this parameter is zero, the system will provide its own time stamp. */
  time: number;
  /** An additional value associated with the keystroke. Use the GetMessageExtraInfo function to obtain this information. */
  extraInfo: number;
}>;

/** Contains information about a simulated message generated by an input device other than a keyboard or mouse. */
export type HARDWAREINPUT = Partial<{
  /** The message generated by the input hardware. */
  msg: number;
  /** The low-order word of the lParam parameter for uMsg. */
  paramL: number;
  /** The high-order word of the lParam parameter for uMsg. */
  paramH: number;
}>;

/** This enum contains constant all virtual-key codes used by the system. */
export enum VK {
  /** Left mouse button */
  LBUTTON = 0x01,
  /** Right mouse button */
  RBUTTON = 0x02,
  /** Control-break processing */
  CANCEL = 0x03,
  /** Middle mouse button (three-button mouse) */
  MBUTTON = 0x04,
  /** X1 mouse button */
  XBUTTON1 = 0x05,
  /** X2 mouse button */
  XBUTTON2 = 0x06,
  /** BACKSPACE key */
  BACK = 0x08,
  /** TAB key */
  TAB = 0x09,
  /** CLEAR key */
  CLEAR = 0x0C,
  /** ENTER key */
  RETURN = 0x0D,
  /** SHIFT key */
  SHIFT = 0x10,
  /** CTRL key */
  CONTROL = 0x11,
  /** ALT key */
  MENU = 0x12,
  /** PAUSE key */
  PAUSE = 0x13,
  /** CAPS LOCK key */
  CAPITAL = 0x14,
  /** IME Kana mode */
  KANA = 0x15,
  /** IME Hanguel mode (maintained for compatibility; use HANGUL) */
  HANGUEL = 0x15,
  /** IME Hangul mode */
  HANGUL = 0x15,
  /** IME Junja mode */
  JUNJA = 0x17,
  /** IME final mode */
  FINAL = 0x18,
  /** IME Hanja mode */
  HANJA = 0x19,
  /** IME Kanji mode */
  KANJI = 0x19,
  /** ESC key */
  ESCAPE = 0x1B,
  /** IME convert */
  CONVERT = 0x1C,
  /** IME nonconvert */
  NONCONVERT = 0x1D,
  /** IME accept */
  ACCEPT = 0x1E,
  /** IME mode change request */
  MODECHANGE = 0x1F,
  /** SPACEBAR */
  SPACE = 0x20,
  /** PAGE UP key */
  PRIOR = 0x21,
  /** PAGE DOWN key */
  NEXT = 0x22,
  /** END key */
  END = 0x23,
  /** HOME key */
  HOME = 0x24,
  /** LEFT ARROW key */
  LEFT = 0x25,
  /** UP ARROW key */
  UP = 0x26,
  /** RIGHT ARROW key */
  RIGHT = 0x27,
  /** DOWN ARROW key */
  DOWN = 0x28,
  /** SELECT key */
  SELECT = 0x29,
  /** PRINT key */
  PRINT = 0x2A,
  /** EXECUTE key */
  EXECUTE = 0x2B,
  /** PRINT SCREEN key */
  SNAPSHOT = 0x2C,
  /** INS key */
  INSERT = 0x2D,
  /** DEL key */
  DELETE = 0x2E,
  /** HELP key */
  HELP = 0x2F,
  /** 0 key */
  ZERO = 0x30,
  /** 1 key */
  ONE = 0x31,
  /** 2 key */
  TWO = 0x32,
  /** 3 key */
  THREE = 0x33,
  /** 4 key */
  FOUR = 0x34,
  /** 5 key */
  FIVE = 0x35,
  /** 6 key */
  SIX = 0x36,
  /** 7 key */
  SEVEN = 0x37,
  /** 8 key */
  EIGHT = 0x38,
  /** 9 key */
  NINE = 0x39,
  /** A key */
  A = 0x41,
  /** B key */
  B = 0x42,
  /** C key */
  C = 0x43,
  /** D key */
  D = 0x44,
  /** E key */
  E = 0x45,
  /** F key */
  F = 0x46,
  /** G key */
  G = 0x47,
  /** H key */
  H = 0x48,
  /** I key */
  I = 0x49,
  /** J key */
  J = 0x4A,
  /** K key */
  K = 0x4B,
  /** L key */
  L = 0x4C,
  /** M key */
  M = 0x4D,
  /** N key */
  N = 0x4E,
  /** O key */
  O = 0x4F,
  /** P key */
  P = 0x50,
  /** Q key */
  Q = 0x51,
  /** R key */
  R = 0x52,
  /** S key */
  S = 0x53,
  /** T key */
  T = 0x54,
  /** U key */
  U = 0x55,
  /** V key */
  V = 0x56,
  /** W key */
  W = 0x57,
  /** X key */
  X = 0x58,
  /** Y key */
  Y = 0x59,
  /** Z key */
  Z = 0x5A,
  /** Left Windows key (Natural keyboard)  */
  LWIN = 0x5B,
  /** Right Windows key (Natural keyboard) */
  RWIN = 0x5C,
  /** Applications key (Natural keyboard) */
  APPS = 0x5D,
  /** Computer Sleep key */
  SLEEP = 0x5F,
  /** Numeric keypad 0 key */
  NUMPAD0 = 0x60,
  /** Numeric keypad 1 key */
  NUMPAD1 = 0x61,
  /** Numeric keypad 2 key */
  NUMPAD2 = 0x62,
  /** Numeric keypad 3 key */
  NUMPAD3 = 0x63,
  /** Numeric keypad 4 key */
  NUMPAD4 = 0x64,
  /** Numeric keypad 5 key */
  NUMPAD5 = 0x65,
  /** Numeric keypad 6 key */
  NUMPAD6 = 0x66,
  /** Numeric keypad 7 key */
  NUMPAD7 = 0x67,
  /** Numeric keypad 8 key */
  NUMPAD8 = 0x68,
  /** Numeric keypad 9 key */
  NUMPAD9 = 0x69,
  /** Multiply key */
  MULTIPLY = 0x6A,
  /** Add key */
  ADD = 0x6B,
  /** Separator key */
  SEPARATOR = 0x6C,
  /** Subtract key */
  SUBTRACT = 0x6D,
  /** Decimal key */
  DECIMAL = 0x6E,
  /** Divide key */
  DIVIDE = 0x6F,
  /** F1 key */
  F1 = 0x70,
  /** F2 key */
  F2 = 0x71,
  /** F3 key */
  F3 = 0x72,
  /** F4 key */
  F4 = 0x73,
  /** F5 key */
  F5 = 0x74,
  /** F6 key */
  F6 = 0x75,
  /** F7 key */
  F7 = 0x76,
  /** F8 key */
  F8 = 0x77,
  /** F9 key */
  F9 = 0x78,
  /** F10 key */
  F10 = 0x79,
  /** F11 key */
  F11 = 0x7A,
  /** F12 key */
  F12 = 0x7B,
  /** F13 key */
  F13 = 0x7C,
  /** F14 key */
  F14 = 0x7D,
  /** F15 key */
  F15 = 0x7E,
  /** F16 key */
  F16 = 0x7F,
  /** F17 key */
  F17 = 0x80,
  /** F18 key */
  F18 = 0x81,
  /** F19 key */
  F19 = 0x82,
  /** F20 key */
  F20 = 0x83,
  /** F21 key */
  F21 = 0x84,
  /** F22 key */
  F22 = 0x85,
  /** F23 key */
  F23 = 0x86,
  /** F24 key */
  F24 = 0x87,
  /** NUM LOCK key */
  NUMLOCK = 0x90,
  /** SCROLL LOCK key */
  SCROLL = 0x91,
  /** Left SHIFT key */
  LSHIFT = 0xA0,
  /** Right SHIFT key */
  RSHIFT = 0xA1,
  /** Left CONTROL key */
  LCONTROL = 0xA2,
  /** Right CONTROL key */
  RCONTROL = 0xA3,
  /** Left MENU key */
  LMENU = 0xA4,
  /** Right MENU key */
  RMENU = 0xA5,
  /** Browser Back key */
  BROWSER_BACK = 0xA6,
  /** Browser Forward key */
  BROWSER_FORWARD = 0xA7,
  /** Browser Refresh key */
  BROWSER_REFRESH = 0xA8,
  /** Browser Stop key */
  BROWSER_STOP = 0xA9,
  /** Browser Search key  */
  BROWSER_SEARCH = 0xAA,
  /** Browser Favorites key */
  BROWSER_FAVORITES = 0xAB,
  /** Browser Start and Home key */
  BROWSER_HOME = 0xAC,
  /** Volume Mute key */
  VOLUME_MUTE = 0xAD,
  /** Volume Down key */
  VOLUME_DOWN = 0xAE,
  /** Volume Up key */
  VOLUME_UP = 0xAF,
  /** Next Track key */
  MEDIA_NEXT_TRACK = 0xB0,
  /** Previous Track key */
  MEDIA_PREV_TRACK = 0xB1,
  /** Stop Media key */
  MEDIA_STOP = 0xB2,
  /** Play/Pause Media key */
  MEDIA_PLAY_PAUSE = 0xB3,
  /** Start Mail key */
  LAUNCH_MAIL = 0xB4,
  /** Select Media key */
  LAUNCH_MEDIA_SELECT = 0xB5,
  /** Start Application 1 key */
  LAUNCH_APP1 = 0xB6,
  /** Start Application 2 key */
  LAUNCH_APP2 = 0xB7,
  /** Used for miscellaneous characters; it can vary by keyboard. For the US standard keyboard, the ';:' key */
  OEM_1 = 0xBA,
  /** For any country/region, the '+' key */
  OEM_PLUS = 0xBB,
  /** For any country/region, the ',' key */
  OEM_COMMA = 0xBC,
  /** For any country/region, the '-' key */
  OEM_MINUS = 0xBD,
  /** For any country/region, the '.' key */
  OEM_PERIOD = 0xBE,
  /** Used for miscellaneous characters; it can vary by keyboard. For the US standard keyboard, the '/?' key */
  OEM_2 = 0xBF,
  /** Used for miscellaneous characters; it can vary by keyboard. For the US standard keyboard, the '`~' key */
  OEM_3 = 0xC0,
  /** Used for miscellaneous characters; it can vary by keyboard. For the US standard keyboard, the '[{' key */
  OEM_4 = 0xDB,
  /** Used for miscellaneous characters; it can vary by keyboard. For the US standard keyboard, the '\|' key */
  OEM_5 = 0xDC,
  /** Used for miscellaneous characters; it can vary by keyboard. For the US standard keyboard, the ']}' key */
  OEM_6 = 0xDD,
  /** Used for miscellaneous characters; it can vary by keyboard. For the US standard keyboard, the 'single-quote/double-quote' key */
  OEM_7 = 0xDE,
  /** Used for miscellaneous characters; it can vary by keyboard. */
  OEM_8 = 0xDF,
  /** Either the angle bracket key or the backslash key on the RT 102-key keyboard */
  OEM_102 = 0xE2,
  /** IME PROCESS key */
  PROCESSKEY = 0xE5,
  /** Used to pass Unicode characters as if they were keystrokes. The PACKET key is the low word of a 32-bit Virtual Key value used for non-keyboard input methods. For more information, see Remark in KEYBDINPUT, SendInput, WM_KEYDOWN, and WM_KEYUP */
  PACKET = 0xE7,
  /** Attn key */
  ATTN = 0xF6,
  /** CrSel key */
  CRSEL = 0xF7,
  /** ExSel key */
  EXSEL = 0xF8,
  /** Erase EOF key */
  EREOF = 0xF9,
  /** Play key */
  PLAY = 0xFA,
  /** Zoom key */
  ZOOM = 0xFB,
  /** Reserved  */
  NONAME = 0xFC,
  /** PA1 key */
  PA1 = 0xFD,
  /** Clear key */
  OEM_CLEAR = 0xFE,
}
