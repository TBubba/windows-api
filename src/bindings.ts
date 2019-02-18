import { EnumWindowsCallback, ShowWindowValue, Rect, Input } from './interfaces';

const addon = require('bindings')('addon');

/**
 * Enumerates all top-level windows on the screen and calls a callback function for each one.
 * EnumWindows continues until the last top-level window is enumerated or the callback function returns a falsy value.
 * (Wrapper of "EnumWindows" from "User32")
 * @param callback Called for each window.
 * @returns If the function succeeds, the return value is true.
 *          If the function fails, the return value is false. To get extended error information, call GetLastError.
 *          If the callback returns false, the return value is also false. In this case, the callback function should call SetLastError to obtain a meaningful error code to be returned to the caller of EnumWindows.
 */
export function enumWindows(callback: EnumWindowsCallback): boolean {
  return addon.EnumWindows(callback);
}

/**
 * Retrieves the identifier of the process that created the window.
 * @param windowHandle The handle to the window.
 * @returns The process id (-1 if the window handle is not in use).
 */
export function getWindowProcessId(windowHandle: number): number {
  return addon.GetWindowProcessId(windowHandle);
}

/**
 * Changes the position and dimensions of the specified window. For a top-level window, the position and dimensions are
 * relative to the upper-left corner of the screen. For a child window, they are relative to the upper-left corner of the parent
 * window's client area.
 * (Wrapper of "MoveWindow" from "User32")
 * @param windowHandle The handle to the window.
 * @param x The new position of the left side of the window.
 * @param y The new position of the top of the window.
 * @param width The new width of the window.
 * @param height The new height of the window.
 * @param repaint Indicates whether the window is to be repainted. If this parameter is TRUE, the window receives a message. If the
 *                parameter is FALSE, no repainting of any kind occurs. This applies to the client area, the nonclient area (including the
 *                title bar and scroll bars), and any part of the parent window uncovered as a result of moving a child window.
 * @returns If the function succeeded. To get extended error information, call GetLastError.
 */
export function moveWindow(windowHandle: number, x: number, y: number, width: number, height: number, repaint?: boolean): boolean {
  return addon.MoveWindow(windowHandle, x, y, width, height, repaint);
}

/**
 * Retrieves the dimensions of the bounding rectangle of the specified window.
 * The dimensions are given in screen coordinates that are relative to the upper-
 * left corner of the screen.
 * (Wrapper of "GetWindowRect" from "User32")
 * @param windowHandle A handle to the window.
 * @returns If the function succeeds, the return value is the bounding rectangle of the window.
 *          If the function fails, the return value is undefined. To get extended error information, call GetLastError.
 */
export function getWindowRect(windowHandle: number): Rect | undefined {
  return addon.GetWindowRect(windowHandle);
}

/**
 * Get the text of the specified window's title bar (if it has one). If the specified window is a control, the text
 * of the control is fetched. However, GetWindowText cannot retrieve the text of a control in another application.
 * (Wrapper of "GetWindowTextA" from "User32")
 * @param windowHandle A handle to the window or control containing the text.
 * @returns The window's or controls text.
 */
export function getWindowText(windowHandle: number): string {
  return addon.GetWindowText(windowHandle);
}

/**
 * Changes the text of the specified window's title bar (if it has one). If the specified window is a control, the text of the
 * control is changed. However, SetWindowText cannot change the text of a control in another application.
 * (Wrapper of "SetWindowTextA" from "User32")
 * @param windowHandle A handle to the window or control whose text is to be changed.
 * @param text The new title or control text.
 * @returns If the function succeeds, the return value is true.
 *          If the function fails, the return value false. To get extended error information, call GetLastError.
 */
export function setWindowText(windowHandle: number, text: string): boolean {
  return addon.SetWindowText(windowHandle, text);
}

/**
 * Sets the specified window's show state.
 * (Wrapper of "ShowWindow" from "User32")
 * @param windowHandle A handle to the window.
 * @param value Controls how the window is to be shown. This parameter is ignored the first time an application calls ShowWindow, if
 *              the program that launched the application provides a STARTUPINFO structure. Otherwise, the first time ShowWindow is
 *              called, the value should be the value obtained by the WinMain function in its nCmdShow parameter.
 * @returns If the window was previously visible.
 */
export function showWindow(windowHandle: number, value: ShowWindowValue): boolean {
  return addon.ShowWindow(windowHandle, value);
}

/**
 * Retrieves the calling thread's last-error code value. The last-error code is maintained on a per-thread basis.
 * Multiple threads do not overwrite each other's last-error code.
 * (Wrapper of "GetLastError" from "Kernel32")
 * @returns The return value is the calling thread's last-error code.
 */
export function getLastError(): number {
  return addon.GetLastError();
}

/**
 * Sets the last-error code for the calling thread.
 * (Wrapper of "SetLastError" from "Kernel32")
 * @param errorCode The last-error code for the thread.
 */
export function setLastError(errorCode: number): void {
  return addon.SetLastError(errorCode);
}

/**
 * Synthesizes keystrokes, mouse motions, and button clicks.
 * (Wrapper of "SendInput" from "User32")
 * @param inputs Array of inputs. Each represents an event to be inserted into one of the input streams.
 * @returns The function returns the number of events that it successfully inserted into the keyboard or mouse input stream. If the
 *          function returns zero, the input was already blocked by another thread. To get extended error information, call GetLastError.
 *          This function fails when it is blocked by UIPI. Note that neither GetLastError nor the return value will indicate the failure
 *          was caused by UIPI blocking.
 */
export function sendInput(inputs: Input[]): number {
  return addon.SendInput(inputs);
}

/**
 * Retrieves a handle to the foreground window (the window with which the user is currently working). The system assigns a slightly
 * higher priority to the thread that creates the foreground window than it does to other threads.
 * (Wrapper of "GetForegroundWindow" from "User32")
 * @returns The return value is a handle to the foreground window. The foreground window can be NULL in certain circumstances, such
 *          as when a window is losing activation.
 */
export function getForegroundWindow(): number {
  return addon.GetForegroundWindow();
}

/**
 * Brings the thread that created the specified window into the foreground and activates the window. Keyboard input is directed to the
 * window, and various visual cues are changed for the user. The system assigns a slightly higher priority to the thread that created
 * the foreground window than it does to other threads.
 * (Wrapper of "SetForegroundWindow" from "User32")
 * @param windowHandle A handle to the window that should be activated and brought to the foreground.
 * @returns If the window was brought to the foreground, the return value is true.
 *          If the window was not brought to the foreground, the return value is false.
 */
export function setForegroundWindow(windowHandle: number): boolean {
  return addon.SetForegroundWindow(windowHandle);
}

/**
 * Determines whether the specified window handle identifies an existing window.
 * (Wrapper of "IsWindow" from "User32")
 * @param windowHandle A handle to the window to be tested.
 * @returns If the window handle identifies an existing window, the return value is true.
 *          If the window handle does not identify an existing window, the return value is false.
 */
export function isWindow(windowHandle: number): boolean {
  return addon.IsWindow(windowHandle);
}

/**
 * Destroys the specified window. The function sends WM_DESTROY and WM_NCDESTROY messages to the window to deactivate it and remove
 * the keyboard focus from it. The function also destroys the window's menu, flushes the thread message queue, destroys timers,
 * removes clipboard ownership, and breaks the clipboard viewer chain (if the window is at the top of the viewer chain).
 *
 * If the specified window is a parent or owner window, DestroyWindow automatically destroys the associated child or owned windows
 * when it destroys the parent or owner window. The function first destroys child or owned windows, and then it destroys the parent
 * or owner window.
 *
 * DestroyWindow also destroys modeless dialog boxes created by the CreateDialog function.
 * (Wrapper of "DestroyWindow" from "User32")
 * @param windowHandle A handle to the window to be destroyed.
 * @returns If the function succeeds, the return value is true.
 *          If the function fails, the return value is false. To get extended error information, call GetLastError.
 */
export function destroyWindow(windowHandle: number): boolean {
  return addon.DestroyWindow(windowHandle);
}
