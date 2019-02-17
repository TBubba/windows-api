#include <cstdio>
#include <windows.h>
#include <vector>
#include "addon.h"

int getNumberOrDefault(Napi::Value val, int defVal = 0) {
  return val.IsNumber() ? val.As<Napi::Number>().Int32Value() : defVal;
}

struct EnumWindowsCallbackParam {
  Napi::Function callback;
  Napi::Env env;
};

BOOL CALLBACK EnumWindowsCallback(HWND hwnd, LPARAM lParam) {
  EnumWindowsCallbackParam *args = (EnumWindowsCallbackParam*)lParam;
  Napi::Value result = (*args).callback.MakeCallback(
    (*args).env.Global(),
    {
      Napi::Number::New((*args).env, (double)reinterpret_cast<int>(hwnd))
    }
  );
  return (bool)result.ToBoolean();
}

Napi::Boolean addon::Wrap_EnumWindows(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  Napi::Error error;
  if (info.Length() < 1) { error = Napi::Error::New(env, "Too few arguments."); }
  else if (!info[0].IsFunction()) { error = Napi::Error::New(env, "First argument must be a function."); }
  if (error) {
    error.ThrowAsJavaScriptException();
    return Napi::Boolean::New(env, false);
  }

  EnumWindowsCallbackParam args = {
    info[0].As<Napi::Function>(), // callback
    env // env
  };

  bool result = EnumWindows(EnumWindowsCallback, (LPARAM)&args);

  return Napi::Boolean::New(env, result);
}

Napi::Number addon::GetWindowProcessId(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  Napi::Error error;
  if (info.Length() < 1) { error = Napi::Error::New(env, "Too few arguments."); }
  else if (!info[0].IsNumber()) { error = Napi::Error::New(env, "First argument must be a number."); }
  if (error) {
    error.ThrowAsJavaScriptException();
    return Napi::Number::New(env, 0);
  }

  DWORD lpdwProcessId;
  DWORD threadId = GetWindowThreadProcessId((HWND)reinterpret_cast<void*>((int)info[0].As<Napi::Number>()), &lpdwProcessId);

  // 0 is not a valid thread id, it is returned when the window handle is not in use
  return Napi::Number::New(env, (threadId == 0) ? -1.0 : (int)lpdwProcessId);
}

Napi::Boolean addon::Wrap_MoveWindow(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  bool repaint = TRUE;

  Napi::Error error;
  if (info.Length() < 5) { error = Napi::Error::New(env, "Too few arguments."); }
  else if (!info[0].IsNumber()) { error = Napi::Error::New(env, "First argument must be a number."); }
  else if (!info[1].IsNumber()) { error = Napi::Error::New(env, "Second argument must be a number."); }
  else if (!info[2].IsNumber()) { error = Napi::Error::New(env, "Third argument must be a number."); }
  else if (!info[3].IsNumber()) { error = Napi::Error::New(env, "Fourth argument must be a number."); }
  else if (!info[4].IsNumber()) { error = Napi::Error::New(env, "Fifth argument must be a number."); }
  else if (!info[5].IsUndefined()) {
    if (info[5].IsBoolean()) { repaint = info[5].As<Napi::Boolean>(); }
    else { error = Napi::Error::New(env, "Sixth argument must be a boolean."); }
  }
  if (error) {
    error.ThrowAsJavaScriptException();
    return Napi::Boolean::New(env, false);
  }
  
  bool result = MoveWindow(
    (HWND)reinterpret_cast<int*>((int)info[0].As<Napi::Number>()),
    info[1].As<Napi::Number>(),
    info[2].As<Napi::Number>(),
    info[3].As<Napi::Number>(),
    info[4].As<Napi::Number>(),
    repaint
  );

  return Napi::Boolean::New(env, result);
}

Napi::Value addon::Wrap_GetWindowRect(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  Napi::Error error;
  if (info.Length() < 1) { error = Napi::Error::New(env, "Too few arguments."); }
  else if (!info[0].IsNumber()) { error = Napi::Error::New(env, "First argument must be a number."); }
  if (error) {
    error.ThrowAsJavaScriptException();
    return Napi::Object::New(env);
  }

  RECT rect;
  bool result = GetWindowRect(
    (HWND)reinterpret_cast<int*>((int)info[0].As<Napi::Number>()),
    &rect
  );

  if (!result) { return env.Undefined(); }
  
  Napi::Object object = Napi::Object::New(env);
  object["left"]   = Napi::Number::New(env, rect.left);
  object["top"]    = Napi::Number::New(env, rect.top);
  object["right"]  = Napi::Number::New(env, rect.right);
  object["bottom"] = Napi::Number::New(env, rect.bottom);    

  return object;
}

Napi::String addon::Wrap_GetWindowText(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  Napi::Error error;
  if (info.Length() < 1) { error = Napi::Error::New(env, "Too few arguments."); }
  else if (!info[0].IsNumber()) { error = Napi::Error::New(env, "First argument must be a number."); }
  if (error) {
    error.ThrowAsJavaScriptException();
    return Napi::String::New(env, "");
  }

  TCHAR buff[512];
  int result = GetWindowTextA(
    (HWND)reinterpret_cast<int*>((int)info[0].As<Napi::Number>()),
    buff,
    512
  );

  return Napi::String::New(env, buff);
}

Napi::Boolean addon::Wrap_SetWindowText(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  Napi::Error error;
  if (info.Length() < 2) { error = Napi::Error::New(env, "Too few arguments."); }
  else if (!info[0].IsNumber()) { error = Napi::Error::New(env, "First argument must be a number."); }
  else if (!info[1].IsString()) { error = Napi::Error::New(env, "Second argument must be a string."); }
  if (error) {
    error.ThrowAsJavaScriptException();
    return Napi::Boolean::New(env, false);
  }

  int result = SetWindowTextA(
    (HWND)reinterpret_cast<int*>((int)info[0].As<Napi::Number>()),
    info[1].As<Napi::String>().Utf8Value().c_str()
  );

  return Napi::Boolean::New(env, result);
}

Napi::Boolean addon::Wrap_ShowWindow(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  Napi::Error error;
  if (info.Length() < 2) { error = Napi::Error::New(env, "Too few arguments."); }
  else if (!info[0].IsNumber()) { error = Napi::Error::New(env, "First argument must be a number."); }
  else if (!info[1].IsNumber()) { error = Napi::Error::New(env, "Second argument must be a number."); }
  if (error) {
    error.ThrowAsJavaScriptException();
    return Napi::Boolean::New(env, false);
  }

  bool result = ShowWindow(
    (HWND)reinterpret_cast<int*>((int)info[0].As<Napi::Number>()),
    (int)info[1].As<Napi::Number>()
  );

  return Napi::Boolean::New(env, result);
}

Napi::Number addon::Wrap_GetLastError(const Napi::CallbackInfo& info) {
  return Napi::Number::New(info.Env(), GetLastError());
}

Napi::Value addon::Wrap_SetLastError(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  Napi::Error error;
  if (info.Length() < 1) { error = Napi::Error::New(env, "Too few arguments."); }
  else if (!info[0].IsNumber()) { error = Napi::Error::New(env, "First argument must be a number."); }
  if (error) {
    error.ThrowAsJavaScriptException();
    return env.Undefined();
  }

  SetLastError(
    (int)info[0].As<Napi::Number>()
  );

  return env.Undefined();
}

Napi::Number addon::Wrap_SendInput(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  Napi::Error error;
  if (info.Length() < 1) { error = Napi::Error::New(env, "Too few arguments."); }
  else if (!info[0].IsArray()) { error = Napi::Error::New(env, "First argument must be an array."); }
  if (error) {
    error.ThrowAsJavaScriptException();
    return Napi::Number::New(env, 0);
  }

  Napi::Array args = info[0].As<Napi::Array>();
  std::vector<INPUT> inputQueue;

  int argsLength = args.Length();
  for (int i = 0; i < argsLength; i++) {
    Napi::Value argVal;
    argVal = args[i];
    if (!argVal.IsObject()) { error = Napi::Error::New(env, "All elements must be objects."); }
    else {
      Napi::Object arg = argVal.As<Napi::Object>();
      if (!arg.Get("type").IsNumber()) { error = Napi::Error::New(env, "Property \"type\" is missing from input object."); }
      else if (!arg.Get("input").IsObject()) { error = Napi::Error::New(env, "Property \"input\" is missing from input object."); }
      else {
        Napi::Object argInput = arg.Get("input").As<Napi::Object>();
        INPUT input = { 0 };
        Napi::Value val;
        switch (arg.Get("type").As<Napi::Number>().Int32Value()) {
          case INPUT_MOUSE:
            input.type = INPUT_MOUSE;
            input.mi.dx          = getNumberOrDefault(argInput["dx"]);
            input.mi.dy          = getNumberOrDefault(argInput["dy"]);
            input.mi.mouseData   = getNumberOrDefault(argInput["mouseData"]);
            input.mi.dwFlags     = getNumberOrDefault(argInput["flags"]);
            input.mi.time        = getNumberOrDefault(argInput["time"]);
            input.mi.dwExtraInfo = getNumberOrDefault(argInput["extraInfo"]);
            inputQueue.push_back(input);
            break;
          case INPUT_KEYBOARD:
            input.type = INPUT_KEYBOARD;
            input.ki.wVk         = getNumberOrDefault(argInput["vk"]);
            input.ki.wScan       = getNumberOrDefault(argInput["scan"]);
            input.ki.dwFlags     = getNumberOrDefault(argInput["flags"]);
            input.ki.time        = getNumberOrDefault(argInput["time"]);
            input.ki.dwExtraInfo = getNumberOrDefault(argInput["extraInfo"]);
            inputQueue.push_back(input);
            break;
          case INPUT_HARDWARE:
            input.type = INPUT_HARDWARE;
            input.hi.uMsg    = getNumberOrDefault(argInput["msg"]);
            input.hi.wParamL = getNumberOrDefault(argInput["paramL"]);
            input.hi.wParamH = getNumberOrDefault(argInput["paramH"]);
            inputQueue.push_back(input);
            break;
          default:
            error = Napi::Error::New(env, "\"type\" is not a valid input type.");
        }
      }      
    }
    if (error) {
      error.ThrowAsJavaScriptException();
      return Napi::Number::New(env, 0);
    }
  }
  
  UINT result = SendInput(inputQueue.size(), &inputQueue[0], sizeof(INPUT));

  return Napi::Number::New(env, result);
}

Napi::Number addon::Wrap_GetForegroundWindow(const Napi::CallbackInfo& info) {
  return Napi::Number::New(info.Env(), (int)GetForegroundWindow());
}

Napi::Boolean addon::Wrap_SetForegroundWindow(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  Napi::Error error;
  if (info.Length() < 1) { error = Napi::Error::New(env, "Too few arguments."); }
  else if (!info[0].IsNumber()) { error = Napi::Error::New(env, "First argument must be a number."); }
  if (error) {
    error.ThrowAsJavaScriptException();
    return Napi::Boolean::New(info.Env(), false);
  }

  bool result = SetForegroundWindow(
    (HWND)reinterpret_cast<int*>((int)info[0].As<Napi::Number>())
  );

  return Napi::Boolean::New(info.Env(), result);
}

Napi::Object addon::Init(Napi::Env env, Napi::Object exports) {
  exports.Set("EnumWindows", Napi::Function::New(env, addon::Wrap_EnumWindows));
  exports.Set("GetWindowProcessId", Napi::Function::New(env, addon::GetWindowProcessId));
  exports.Set("MoveWindow", Napi::Function::New(env, addon::Wrap_MoveWindow));
  exports.Set("GetWindowRect", Napi::Function::New(env, addon::Wrap_GetWindowRect));
  exports.Set("GetWindowText", Napi::Function::New(env, addon::Wrap_GetWindowText));
  exports.Set("SetWindowText", Napi::Function::New(env, addon::Wrap_SetWindowText));
  exports.Set("ShowWindow", Napi::Function::New(env, addon::Wrap_ShowWindow));
  exports.Set("GetLastError", Napi::Function::New(env, addon::Wrap_GetLastError));
  exports.Set("SetLastError", Napi::Function::New(env, addon::Wrap_SetLastError));
  exports.Set("SendInput", Napi::Function::New(env, addon::Wrap_SendInput));
  exports.Set("GetForegroundWindow", Napi::Function::New(env, addon::Wrap_GetForegroundWindow));
  exports.Set("SetForegroundWindow", Napi::Function::New(env, addon::Wrap_SetForegroundWindow));
  return exports;
}
