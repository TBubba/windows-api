#include <napi.h>
#include "sub/addon.cpp"

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  return addon::Init(env, exports);
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)
