#include <nan.h>
#include <tree_sitter/parser.h>

extern "C" TSLanguage *tree_sitter_utl();

namespace {

using v8::FunctionTemplate;
using v8::Local;
using v8::Object;

NAN_METHOD(New) {}

void Init(Local<Object> exports, Local<Object> module) {
  Local<FunctionTemplate> tpl = Nan::New<FunctionTemplate>(New);
  tpl->SetClassName(Nan::New("Language").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  Local<Object> instance = Nan::NewInstance(tpl->GetFunction()).ToLocalChecked();
  Nan::SetInternalFieldPointer(instance, 0, tree_sitter_utl());

  Nan::Set(instance, Nan::New("name").ToLocalChecked(), Nan::New("utl").ToLocalChecked());
  Nan::Set(module, Nan::New("exports").ToLocalChecked(), instance);
}

NODE_MODULE(tree_sitter_utl_binding, Init)

}
