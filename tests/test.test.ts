import * as windowsAPI from '../src/index';

describe('Bindings', () => {
  test('enumWindows - enumerate all', () => {
    const result = windowsAPI.enumWindows((handle) => {
      expect(typeof handle).toStrictEqual('number');
      return true;
    });
    expect(result).toStrictEqual(true);
  });

  test('enumWindows - enumerate one', () => {
    const result = windowsAPI.enumWindows(() => {
      return false;
    });
    expect(result).toStrictEqual(false);
  });

  test('getWindowProcessId', () => {
    const handle = windowsAPI.getForegroundWindow();
    const id  = windowsAPI.getWindowProcessId(handle);
    const id2 = windowsAPI.getWindowProcessId(handle);
    expect(typeof id ).toStrictEqual('number');
    expect(typeof id2).toStrictEqual('number');
    expect(id).toStrictEqual(id2);
  });

  test('getForegroundWindow', () => {
    const handle  = windowsAPI.getForegroundWindow();
    const handle2 = windowsAPI.getForegroundWindow();
    expect(typeof handle ).toStrictEqual('number');
    expect(typeof handle2).toStrictEqual('number');
    expect(handle).toStrictEqual(handle2);
  });

  test('isWindow - valid handle', () => {
    // Get a valid window handle
    let handle: number = -1;
    windowsAPI.enumWindows((windowHandle) => {
      handle = windowHandle;
      return false;
    });
    expect(handle).not.toStrictEqual(-1);

    const result = windowsAPI.isWindow(handle);
    expect(result).toStrictEqual(true);
  });

  test('isWindow - invalid handle', () => {
    const result = windowsAPI.isWindow(-1);
    expect(result).toStrictEqual(false);
  });

  test('setLastError & getLastError', () => {
    for (let i = 0; i < 10; i++) {
      const code = 12345 + i;
      windowsAPI.setLastError(code);
      const result = windowsAPI.getLastError();
      expect(result).toStrictEqual(code);
    }
  });
});
