#include <windows.h>
#include <napi.h>


namespace addon {
  Napi::Boolean Wrap_EnumWindows(const Napi::CallbackInfo& info);
  Napi::Number GetWindowProcessId(const Napi::CallbackInfo& info);
  Napi::Boolean Wrap_MoveWindow(const Napi::CallbackInfo& info);
  Napi::Number Wrap_System(const Napi::CallbackInfo& info);
  Napi::String Wrap_GetWindowText(const Napi::CallbackInfo& info);
  Napi::Boolean Wrap_SetWindowText(const Napi::CallbackInfo& info);
  Napi::Boolean Wrap_ShowWindow(const Napi::CallbackInfo& info);
  Napi::Number Wrap_GetLastError(const Napi::CallbackInfo& info);
  Napi::Value Wrap_SetLastError(const Napi::CallbackInfo& info);
  
  Napi::Object Init(Napi::Env env, Napi::Object exports);
}
