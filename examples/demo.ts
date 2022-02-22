import { spawn } from 'child_process';
import * as windowsAPI from '../dist';

runDemo();

async function runDemo() {
  // Run MS-Paint, wait for it's window to appear, then move and resize it and log its new position and size
  await (async () => {
    const proc = spawn('C:/Windows/System32/mspaint.exe');
    const window = await waitForWindow(() => findWindowHandle(createPIDAndTextPredicate(proc.pid!, 'Paint')));
    console.log(`Paint | Handle : ${window} | Text: "${windowsAPI.getWindowText(window)}"\n`);
    windowsAPI.moveWindow(
      window,
      500, 500,
      800, 600
    );
    console.log('Paint window\'s bounding rectangle:\n  ', windowsAPI.getWindowRect(window), '\n');
  })();
  
  // Run Notepad, Wait for it's window to appear, Set the windows text and maximize the window,
  // Send key presses to the current window (hopefully the notepad window)
  await (async () => {
    const proc = spawn('C:/Windows/System32/notepad.exe');
    const window = await waitForWindow(() => findWindowHandle(createPIDAndTextPredicate(proc.pid!)));
    console.log(`Notepad | Handle : ${window} | Text: "${windowsAPI.getWindowText(window)}"\n`);
    windowsAPI.setWindowText(window, 'Not Notepad');
    windowsAPI.showWindow(window, windowsAPI.ShowWindowValue.SW_SHOWMAXIMIZED);
    await wait(500);
    await sendKeyPresses([
      windowsAPI.VK.T,
      windowsAPI.VK.E,
      windowsAPI.VK.S,
      windowsAPI.VK.T,
      windowsAPI.VK.SPACE,
      windowsAPI.VK.O,
      windowsAPI.VK.U,
      windowsAPI.VK.T,
      windowsAPI.VK.P,
      windowsAPI.VK.U,
      windowsAPI.VK.T,
    ], 30);
  })();

  // Set the last error code, then retrieve it
  await (async () => {
    const errorCode = 123;
    console.log(`Setting last error code to: ${errorCode}`);
    windowsAPI.setLastError(errorCode);
    console.log(`Last error code is: ${windowsAPI.getLastError()}\n`);
  })();

  // Count all windows and list some of their texts in the console
  await (async () => {
    const handles: number[] = [];
    windowsAPI.enumWindows(handle => {
      handles.push(handle);
      return true;
    });
    const texts = (
      handles
      .map(handle => `  "${windowsAPI.getWindowText(handle)}"`)
      .sort(Intl.Collator().compare) // (sorts alphabetically case-insensitive)
      .reverse()
      .slice(0, 10)
      .join(',\n')
    );
    console.log(
      `Number of windows: ${handles.length}\n`+
      `Some Window Texts: [\n${texts}\n]\n`
    );
  })();
};

/**
 * Returns a predicate function that returns true if the windows PID and text is
 * identical to targetPID and targetText (it will skip checking the window text if
 * targetText is undefined).
 * @param targetPID Process ID of window handle
 * @param targetText Exact text of window handle (optional)
 * @returns Predicate function
 */
function createPIDAndTextPredicate(targetPID: number, targetText?: string) {
  return (windowHandle: number): boolean => {
    const pid = windowsAPI.getWindowProcessId(windowHandle);
    const text = windowsAPI.getWindowText(windowHandle);
    return (
      pid === targetPID &&
      (targetText === text || targetText == undefined)
    );
  };
}

/**
 * Returns the value of the first window handle where predicate is true (returns 0 otherwise).
 * (This is similar to "Array.find()" but for window handles)
 * @param predicate Called once per window handle.
 * @return Window handle that the predicate function returned true for (or 0 if it didn't return true). 
 */
function findWindowHandle(predicate: (windowHandle: number) => boolean): number {
  let result = 0;
  windowsAPI.enumWindows(handle => {
    if (predicate(handle)) {
      result = handle;
      return false;
    }
    return true;
  });
  return result;
}

/**
 * Try getting a window handle for a period of time.
 * @param getWindowHandle Function that fetches the window. It is called on an interval until it returns a non-negative number.
 * @param interval Interval between calling the getWindowHandle function (in milliseconds).
 * @param timeout How long it takes to time out (in milliseconds - negative values means no timeout)
 */
function waitForWindow(getWindowHandle: () => number, interval: number = 50, timeout: number = -1): Promise<number> {
  return new Promise((resolve, reject) => {
    let hasResponded = false;
    let timeoutId: NodeJS.Timeout|undefined = undefined;
    // Get Window Handle Interval
    let intervalId = setInterval(() => {
      if (!hasResponded) {
        const handle = getWindowHandle();
        if (handle > 0) {
          hasResponded = true;
          clearInterval(intervalId);
          if (timeoutId !== undefined) { clearTimeout(timeoutId); }
          resolve(handle);
        }   
      }
    }, interval);
    // Timeout
    if (timeout >= 0) {
      timeoutId = setTimeout(() => {
        if (!hasResponded) {
          hasResponded = true;
          clearInterval(intervalId);
          reject(new Error(`waitForWindow timed out after ${timeout}ms.`));
        }
      }, timeout);
    }
  });
}

/**
 * Wait for an amount of time.
 * @param time Time to wait (in milliseconds).
 */
function wait(time: number = 0): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, time);
  });
}

/**
 * Send "key presses" with a small delay in-between each press.
 * @param keys Keys to "press" and "release" (in order).
 * @param delay Delay between each press and release (in milliseconds).
 */
async function sendKeyPresses(keys: windowsAPI.VK[], delay: number = 1) {
  const last = keys.length - 1;
  for (let i = 0; i <= last; i++) {
    const key = keys[i];
    windowsAPI.sendInput([{
      type: windowsAPI.InputType.INPUT_KEYBOARD,
      input: { vk: key }
    }]);
    await wait(delay);
    windowsAPI.sendInput([{
      type: windowsAPI.InputType.INPUT_KEYBOARD,
      input: {
        vk: key,
        flags: windowsAPI.KEYEVENTF.KEYUP
      }
    }]);
    if (i !== last) { await wait(delay); }
  }
}
