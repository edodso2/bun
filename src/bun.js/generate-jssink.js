const classes = ["ArrayBufferSink", "HTTPResponseSink", "HTTPSResponseSink"];
const SINK_COUNT = 5;

function names(name) {
  return {
    constructor: `JS${name}Constructor`,
    className: `JS${name}`,
    controller: `JSReadable${name}Controller`,
    controllerName: `Readable${name}Controller`,
    prototypeName: `JS${name}Prototype`,
    controllerPrototypeName: `JSReadable${name}ControllerPrototype`,
  };
}
function header() {
  function classTemplate(name) {
    const { constructor, className, controller } = names(name);

    return `class ${constructor} final : public JSC::InternalFunction {                                                                                                     
        public:                                                                                                                                                                     
            using Base = JSC::InternalFunction;                                                                                                                                     
            static ${constructor}* create(JSC::VM& vm, JSC::JSGlobalObject* globalObject, JSC::Structure* structure, JSC::JSObject* prototype); 
            static constexpr SinkID Sink = SinkID::${name};
                                                                                                                                                                                    
            static constexpr unsigned StructureFlags = Base::StructureFlags;                                                                                                        
            static constexpr bool needsDestruction = false;                                                                                                                         
                                                                                                                                                                                    
            DECLARE_EXPORT_INFO;                                                                                                                                                    
            template<typename, JSC::SubspaceAccess mode> static JSC::GCClient::IsoSubspace* subspaceFor(JSC::VM& vm)                                                                
            {                                                                                                                                                                       
                if constexpr (mode == JSC::SubspaceAccess::Concurrently)                                                                                                            
                    return nullptr;                                                                                                                                                 
                return WebCore::subspaceForImpl<${constructor}, WebCore::UseCustomHeapCellType::No>(                                                                    
                    vm,                                                                                                                                                             
                    [](auto& spaces) { return spaces.m_clientSubspaceForJSSinkConstructor.get(); },                                                                                 
                    [](auto& spaces, auto&& space) { spaces.m_clientSubspaceForJSSinkConstructor = WTFMove(space); },                                                               
                    [](auto& spaces) { return spaces.m_subspaceForJSSinkConstructor.get(); },                                                                                       
                    [](auto& spaces, auto&& space) { spaces.m_subspaceForJSSinkConstructor = WTFMove(space); });                                                                    
            }                                                                                                                                                                       
                                                                                                                                                                                    
            static JSC::Structure* createStructure(JSC::VM& vm, JSC::JSGlobalObject* globalObject, JSC::JSValue prototype)                                                          
            {                                                                                                                                                                       
                return JSC::Structure::create(vm, globalObject, prototype, JSC::TypeInfo(JSC::InternalFunctionType, StructureFlags), info());                                                 
            }                                                                                                                                                                       
            void initializeProperties(JSC::VM& vm, JSC::JSGlobalObject* globalObject, JSC::JSObject* prototype);   
            
            
            // Must be defined for each specialization class.
            static JSC::EncodedJSValue JSC_HOST_CALL_ATTRIBUTES construct(JSC::JSGlobalObject*, JSC::CallFrame*);
                                                                                                                                                               
        private:                                                                                                                                                                    
            ${constructor}(JSC::VM& vm, JSC::Structure* structure, JSC::NativeFunction nativeFunction)                                                                  
                : Base(vm, structure, nativeFunction, nativeFunction)                                                                                                               
                                                                                                                                                                                    
            {                                                                                                                                                                       
            }                                                                                                                                                                       
                                                                                                                                                                                    
            void finishCreation(JSC::VM&, JSC::JSGlobalObject* globalObject, JSC::JSObject* prototype);                                                     
        };                                                                                                                                                                          
                                                                                                                                                                                    
        class ${className} final : public JSC::JSDestructibleObject {                                                                                                              
        public:                                                                                                                                                                     
            using Base = JSC::JSDestructibleObject;                                                                                                                                 
            static ${className}* create(JSC::VM& vm, JSC::JSGlobalObject* globalObject, JSC::Structure* structure, void* sinkPtr);       
            static constexpr SinkID Sink = SinkID::${name};                                          
                                                                                                                                                                                    
            DECLARE_EXPORT_INFO;                                                                                                                                                    
            template<typename, JSC::SubspaceAccess mode> static JSC::GCClient::IsoSubspace* subspaceFor(JSC::VM& vm)                                                                
            {                                                                                                                                                                       
                if constexpr (mode == JSC::SubspaceAccess::Concurrently)                                                                                                            
                    return nullptr;                                                                                                                                                 
                return WebCore::subspaceForImpl<${className}, WebCore::UseCustomHeapCellType::No>(                                                                                 
                    vm,                                                                                                                                                             
                    [](auto& spaces) { return spaces.m_clientSubspaceForJSSink.get(); },                                                                                            
                    [](auto& spaces, auto&& space) { spaces.m_clientSubspaceForJSSink = WTFMove(space); },                                                                          
                    [](auto& spaces) { return spaces.m_subspaceForJSSink.get(); },                                                                                                  
                    [](auto& spaces, auto&& space) { spaces.m_subspaceForJSSink = WTFMove(space); });                                                                               
            }                                                                                                                                                                       
                                                                                                                                                                                    
            static void destroy(JSC::JSCell*);                                                                                                                                      
            static JSC::Structure* createStructure(JSC::VM& vm, JSC::JSGlobalObject* globalObject, JSC::JSValue prototype)                                                          
            {                                                                                                                                                                       
                return JSC::Structure::create(vm, globalObject, prototype, JSC::TypeInfo(JSC::ObjectType, StructureFlags), info());                                                 
            }                       
            
            static JSObject* createPrototype(VM& vm, JSDOMGlobalObject& globalObject);
                                                                                                                                                                                    
            ~${className}();                                                                                                                                                       
                                                                                                                                                                                    
            void* wrapped() const { return m_sinkPtr; }                                                                                                                             

            void detach() {
                m_sinkPtr = nullptr;

            }                       

            static void analyzeHeap(JSCell*, JSC::HeapAnalyzer&);                                                                                                                   
                                                                                                                                                                                    
            void* m_sinkPtr;
                                                                                                                                                                                    
            ${className}(JSC::VM& vm, JSC::Structure* structure, void* sinkPtr)                                                                                                    
                : Base(vm, structure)                                                                                                                                               
            {                                                                                                                                                                       
                m_sinkPtr = sinkPtr;
            }                                                                                                                                                                       
                                                                                                                                                                                    
            void finishCreation(JSC::VM&);
        };

        class ${controller} final : public JSC::JSDestructibleObject {                                                                                                              
            public:                                                                                                                                                                     
                using Base = JSC::JSDestructibleObject;                                                                                                                                 
                static ${controller}* create(JSC::VM& vm, JSC::JSGlobalObject* globalObject, JSC::Structure* structure, void* sinkPtr);       
                static constexpr SinkID Sink = SinkID::${name};                                          
                                                                                                                                                                                        
                DECLARE_EXPORT_INFO;                                                                                                                                                    
                template<typename, JSC::SubspaceAccess mode> static JSC::GCClient::IsoSubspace* subspaceFor(JSC::VM& vm)                                                                
                {                                                                                                                                                                       
                    if constexpr (mode == JSC::SubspaceAccess::Concurrently)                                                                                                            
                        return nullptr;                                                                                                                                                 
                    return WebCore::subspaceForImpl<${controller}, WebCore::UseCustomHeapCellType::No>(                                                                                 
                        vm,                                                                                                                                                             
                        [](auto& spaces) { return spaces.m_clientSubspaceForJSSinkController.get(); },                                                                                            
                        [](auto& spaces, auto&& space) { spaces.m_clientSubspaceForJSSinkController = WTFMove(space); },                                                                          
                        [](auto& spaces) { return spaces.m_subspaceForJSSinkController.get(); },                                                                                                  
                        [](auto& spaces, auto&& space) { spaces.m_subspaceForJSSinkController = WTFMove(space); });                                                                               
                }                                                                                                                                                                       
                                                                                                                                                                                        
                static void destroy(JSC::JSCell*);                                                                                                                                      
                static JSC::Structure* createStructure(JSC::VM& vm, JSC::JSGlobalObject* globalObject, JSC::JSValue prototype)                                                          
                {                                                                                                                                                                       
                    return JSC::Structure::create(vm, globalObject, prototype, JSC::TypeInfo(JSC::ObjectType, StructureFlags), info());                                                 
                }
                static JSObject* createPrototype(VM& vm, JSDOMGlobalObject& globalObject);
                                                                                                                                                                                        
                ~${controller}();                                                                                                                                                       


                void* wrapped() const { return m_sinkPtr; }    
                void detach();

                void start(JSC::JSGlobalObject *globalObject, JSC::JSValue readableStream, JSC::JSFunction *onPull, JSC::JSFunction *onClose);
                DECLARE_VISIT_CHILDREN;
                                                                                                                                                                                        
                static void analyzeHeap(JSCell*, JSC::HeapAnalyzer&);
                                                                 
                bool hasPendingActivity() { return m_hasPendingActivity; }

                void* m_sinkPtr;
                bool m_hasPendingActivity;
                mutable WriteBarrier<JSC::JSFunction> m_onPull;
                mutable WriteBarrier<JSC::JSFunction> m_onClose;
                mutable JSC::Weak<JSObject> m_weakReadableStream;
                JSC::Weak<${controller}> m_weakThis;
                                                                                                                                                                                        
                ${controller}(JSC::VM& vm, JSC::Structure* structure, void* sinkPtr)                                                                                                    
                    : Base(vm, structure)                                                                                                                                               
                {                                                                                                                                                                       
                    m_sinkPtr = sinkPtr;
                    m_hasPendingActivity = true;
                    m_weakThis = JSC::Weak<${controller}>(this, getOwner());
                }                                                                                                                                                                       
                                                                                                                                                                                        
                void finishCreation(JSC::VM&);

                class Owner final : public JSC::WeakHandleOwner {
                public:
                    bool isReachableFromOpaqueRoots(JSC::Handle<JSC::Unknown> handle, void* context, JSC::AbstractSlotVisitor&, const char**) final
                    {
                        auto* controller = JSC::jsCast<${controller}*>(handle.slot()->asCell());
                        return controller->hasPendingActivity();
                    }
                    void finalize(JSC::Handle<JSC::Unknown>, void* context) final {}
                };
            
                static JSC::WeakHandleOwner* getOwner()
                {
                    static NeverDestroyed<Owner> m_owner;
                    return &m_owner.get();
                }
            };

JSC_DECLARE_CUSTOM_GETTER(function${name}__getter);

        `;
  }

  const outer = `
// AUTO-GENERATED FILE. DO NOT EDIT.
// Generated by 'make generate-sink' at ${new Date().toISOString()}
//
#pragma once

#include "root.h"

#include "JSDOMWrapper.h"
#include "wtf/NeverDestroyed.h"

#include "Sink.h"

extern "C" bool JSSink_isSink(JSC::JSGlobalObject*, JSC::EncodedJSValue);

namespace WebCore {
using namespace JSC;

JSC_DECLARE_HOST_FUNCTION(functionStartDirectStream);
`;

  const bottom = `
JSObject* createJSSinkPrototype(JSC::VM& vm, JSC::JSGlobalObject* globalObject, WebCore::SinkID sinkID);
JSObject* createJSSinkControllerPrototype(JSC::VM& vm, JSC::JSGlobalObject* globalObject, WebCore::SinkID sinkID);
Structure* createJSSinkControllerStructure(JSC::VM& vm, JSC::JSGlobalObject* globalObject, WebCore::SinkID sinkID);
} // namespace WebCore
`;
  var templ = outer;
  for (let name of classes) {
    templ += classTemplate(name) + "\n";
  }
  templ += bottom;
  return templ;
}

async function implementation() {
  const head = `
// AUTO-GENERATED FILE. DO NOT EDIT.
// Generated by 'make generate-sink' at ${new Date().toISOString()}
// To regenerate this file, run:
//
//   make generate-sink
//
#include "root.h"
#include "JSSink.h"

#include "ActiveDOMObject.h"
#include "ExtendedDOMClientIsoSubspaces.h"
#include "ExtendedDOMIsoSubspaces.h"
#include "IDLTypes.h"
// #include "JSBlob.h"
#include "JSDOMAttribute.h"
#include "JSDOMBinding.h"
#include "JSDOMConstructor.h"
#include "JSDOMConvertBase.h"
#include "JSDOMConvertInterface.h"
#include "JSDOMConvertStrings.h"
#include "JSDOMExceptionHandling.h"
#include "JSDOMGlobalObject.h"
#include "JSDOMGlobalObjectInlines.h"
#include "JSDOMOperation.h"
#include "JSDOMWrapperCache.h"
#include "ScriptExecutionContext.h"
#include "WebCoreJSClientData.h"
#include "JavaScriptCore/FunctionPrototype.h"
#include "JavaScriptCore/HeapAnalyzer.h"

#include "JavaScriptCore/JSDestructibleObjectHeapCellType.h"
#include "JavaScriptCore/SlotVisitorMacros.h"
#include "JavaScriptCore/SubspaceInlines.h"
#include "wtf/GetPtr.h"
#include "wtf/PointerPreparations.h"
#include "wtf/URL.h"
#include "JavaScriptCore/BuiltinNames.h"

#include "JSBufferEncodingType.h"
#include "JSBufferPrototypeBuiltins.h"
#include "JSBufferConstructorBuiltins.h"
#include "JavaScriptCore/JSBase.h"
#if ENABLE(MEDIA_SOURCE)
#include "BufferMediaSource.h"
#include "JSMediaSource.h"
#endif

// #include "JavaScriptCore/JSTypedArrayViewPrototype.h"
#include "JavaScriptCore/JSArrayBufferViewInlines.h"

#include "JSReadableStream.h"
#include "BunClientData.h"
#include "JavaScriptCore/Weak.h"
#include "JavaScriptCore/WeakInlines.h"



namespace WebCore {
using namespace JSC;





JSC_DEFINE_HOST_FUNCTION(functionStartDirectStream, (JSC::JSGlobalObject * lexicalGlobalObject, JSC::CallFrame *callFrame))
{
    
    auto& vm = lexicalGlobalObject->vm();
    auto scope = DECLARE_THROW_SCOPE(vm);
    Zig::GlobalObject* globalObject = reinterpret_cast<Zig::GlobalObject*>(lexicalGlobalObject);

    JSC::JSValue readableStream = callFrame->argument(0);
    JSC::JSValue onPull = callFrame->argument(1);
    JSC::JSValue onClose = callFrame->argument(2);
    if (!readableStream.isObject()) {
        scope.throwException(globalObject, JSC::createTypeError(globalObject, "Expected ReadableStream"_s));
        return JSC::JSValue::encode(JSC::jsUndefined());
    }

    if (!onPull.isObject() || !onPull.isCallable()) {
        onPull = JSC::jsUndefined();
    }

    if (!onClose.isObject() || !onClose.isCallable()) {
        onClose = JSC::jsUndefined();
    }

    JSC::JSFunction *onPullFunction = JSC::jsDynamicCast<JSC::JSFunction*>(onPull);
    JSC::JSFunction *onCloseFunction = JSC::jsDynamicCast<JSC::JSFunction*>(onClose);

`;
  var templ = head;

  var isFirst = true;
  for (let name of classes) {
    const {
      className,
      controller,
      prototypeName,
      controllerPrototypeName,
      constructor,
    } = names(name);

    templ += `

    ${
      isFirst ? "" : "else"
    } if (WebCore::${controller}* ${name}Controller = JSC::jsDynamicCast<WebCore::${controller}*>(callFrame->thisValue())) {
        if (${name}Controller->wrapped() == nullptr) {
            scope.throwException(globalObject, JSC::createTypeError(globalObject, "Cannot start stream with closed controller"_s));
            return JSC::JSValue::encode(JSC::jsUndefined());
        }

        ${name}Controller->start(globalObject, readableStream, onPullFunction, onCloseFunction);
    }
`;
    isFirst = false;
  }

  templ += `
    else {
        scope.throwException(globalObject, JSC::createTypeError(globalObject, "Unknown direct controller. This is a bug in Bun."_s));
        return JSC::JSValue::encode(JSC::jsUndefined());
    }

    RELEASE_AND_RETURN(scope, JSC::JSValue::encode(JSC::jsUndefined()));
}
`;

  for (let name of classes) {
    const {
      className,
      controller,
      prototypeName,
      controllerName,
      controllerPrototypeName,
      constructor,
    } = names(name);
    const protopad = `${controller}__close`.length;
    const padding = `${name}__doClose`.length;
    templ += `
JSC_DEFINE_CUSTOM_GETTER(function${name}__getter, (JSC::JSGlobalObject * lexicalGlobalObject, JSC::EncodedJSValue thisValue, JSC::PropertyName))
{
    auto& vm = lexicalGlobalObject->vm();
    Zig::GlobalObject* globalObject = reinterpret_cast<Zig::GlobalObject*>(lexicalGlobalObject);

    return JSC::JSValue::encode(globalObject->${name}());
}


JSC_DECLARE_HOST_FUNCTION(${controller}__close);
JSC_DEFINE_HOST_FUNCTION(${controller}__close, (JSC::JSGlobalObject * lexicalGlobalObject, JSC::CallFrame *callFrame))
{
    
    auto& vm = lexicalGlobalObject->vm();
    auto scope = DECLARE_THROW_SCOPE(vm);
    Zig::GlobalObject* globalObject = reinterpret_cast<Zig::GlobalObject*>(lexicalGlobalObject);
    WebCore::${controller}* controller = JSC::jsDynamicCast<WebCore::${controller}*>(callFrame->thisValue());
    if (!controller) {
        scope.throwException(globalObject, JSC::createTypeError(globalObject, "Expected ${controller}"_s));
        return JSC::JSValue::encode(JSC::jsUndefined());
    }

    void *ptr = controller->wrapped();
    if (ptr == nullptr) {
        return JSC::JSValue::encode(JSC::jsUndefined());
    }

    controller->detach();
    ${name}__close(lexicalGlobalObject, ptr);
    // Release the controller right before close.
    controller->m_hasPendingActivity = false;
    return JSC::JSValue::encode(JSC::jsUndefined());
}

JSC_DECLARE_HOST_FUNCTION(${controller}__end);
JSC_DEFINE_HOST_FUNCTION(${controller}__end, (JSC::JSGlobalObject * lexicalGlobalObject, JSC::CallFrame *callFrame))
{
    
    auto& vm = lexicalGlobalObject->vm();
    auto scope = DECLARE_THROW_SCOPE(vm);
    Zig::GlobalObject* globalObject = reinterpret_cast<Zig::GlobalObject*>(lexicalGlobalObject);
    WebCore::${controller}* controller = JSC::jsDynamicCast<WebCore::${controller}*>(callFrame->thisValue());
    if (!controller) {
        scope.throwException(globalObject, JSC::createTypeError(globalObject, "Expected ${controller}"_s));
        return JSC::JSValue::encode(JSC::jsUndefined());
    }

    void *ptr = controller->wrapped();
    if (ptr == nullptr) {
        return JSC::JSValue::encode(JSC::jsUndefined());
    }

    controller->detach();
    return ${name}__endWithSink(ptr, lexicalGlobalObject);
}


JSC_DECLARE_HOST_FUNCTION(${name}__doClose);
JSC_DEFINE_HOST_FUNCTION(${name}__doClose, (JSC::JSGlobalObject * lexicalGlobalObject, JSC::CallFrame *callFrame))
{
    
    auto& vm = lexicalGlobalObject->vm();
    auto scope = DECLARE_THROW_SCOPE(vm);
    Zig::GlobalObject* globalObject = reinterpret_cast<Zig::GlobalObject*>(lexicalGlobalObject);
    WebCore::${className}* sink = JSC::jsDynamicCast<WebCore::${className}*>(callFrame->thisValue());
    if (!sink) {
        scope.throwException(globalObject, JSC::createTypeError(globalObject, "Expected ${name}"_s));
        return JSC::JSValue::encode(JSC::jsUndefined());
    }

    void *ptr = sink->wrapped();
    if (ptr == nullptr) {
        return JSC::JSValue::encode(JSC::jsUndefined());
    }

    sink->detach();
    ${name}__close(lexicalGlobalObject, ptr);
    return JSC::JSValue::encode(JSC::jsUndefined());
}


`;
  }

  templ += `
#include "JSSinkLookupTable.h"
  `;

  for (let name of classes) {
    const {
      className,
      controller,
      prototypeName,
      controllerName,
      controllerPrototypeName,
      constructor,
    } = names(name);
    const protopad = `${controller}__close`.length;
    const padding = `${name}__doClose`.length;
    templ += `
/* Source for JS${name}PrototypeTableValues.lut.h
@begin JS${name}PrototypeTable
  close   ${`${name}__doClose`.padEnd(
    padding + 8
  )} ReadOnly|DontDelete|Function 0
  flush   ${`${name}__flush`.padEnd(padding + 8)} ReadOnly|DontDelete|Function 1
  end     ${`${name}__end`.padEnd(padding + 8)} ReadOnly|DontDelete|Function 0
  start   ${`${name}__start`.padEnd(padding + 8)} ReadOnly|DontDelete|Function 1
  write   ${`${name}__write`.padEnd(padding + 8)} ReadOnly|DontDelete|Function 1
  
@end
*/


/* Source for ${controllerPrototypeName}TableValues.lut.h
@begin ${controllerPrototypeName}Table
  close    ${`${controller}__close`.padEnd(
    protopad + 4
  )}  ReadOnly|DontDelete|Function 0
  flush    ${`${name}__flush`.padEnd(
    protopad + 4
  )}  ReadOnly|DontDelete|Function 1
  end      ${`${controller}__end`.padEnd(
    protopad + 4
  )}  ReadOnly|DontDelete|Function 0
  start    ${`${name}__start`.padEnd(
    protopad + 4
  )}  ReadOnly|DontDelete|Function 1
  write    ${`${name}__write`.padEnd(
    protopad + 4
  )}  ReadOnly|DontDelete|Function 1
@end
*/

  `;
  }

  templ += `
${(await Bun.file(import.meta.dir + "/bindings/JSSink+custom.h").text()).trim()}
`;
  const footer = `
} // namespace WebCore

`;

  for (let name of classes) {
    const {
      className,
      controller,
      prototypeName,
      controllerPrototypeName,
      constructor,
      controllerName,
    } = names(name);
    templ += `
#pragma mark - ${name}

class ${prototypeName} final : public JSC::JSNonFinalObject {
public:
    using Base = JSC::JSNonFinalObject;

    static ${prototypeName}* create(JSC::VM& vm, JSGlobalObject* globalObject, JSC::Structure* structure)
    {
        ${prototypeName}* ptr = new (NotNull, JSC::allocateCell<${prototypeName}>(vm)) ${prototypeName}(vm, globalObject, structure);
        ptr->finishCreation(vm, globalObject);
        return ptr;
    }

    DECLARE_INFO;
    template<typename CellType, JSC::SubspaceAccess>
    static JSC::GCClient::IsoSubspace* subspaceFor(JSC::VM& vm)
    {
        return &vm.plainObjectSpace();
    }
    static JSC::Structure* createStructure(JSC::VM& vm, JSC::JSGlobalObject* globalObject, JSC::JSValue prototype)
    {
        return JSC::Structure::create(vm, globalObject, prototype, JSC::TypeInfo(JSC::ObjectType, StructureFlags), info());
    }

private:
    ${prototypeName}(JSC::VM& vm, JSC::JSGlobalObject* globalObject, JSC::Structure* structure)
        : Base(vm, structure)
    {
    }

    void finishCreation(JSC::VM&, JSC::JSGlobalObject*);
};
STATIC_ASSERT_ISO_SUBSPACE_SHARABLE(${prototypeName}, ${prototypeName}::Base);

class ${controllerPrototypeName} final : public JSC::JSNonFinalObject {
    public:
        using Base = JSC::JSNonFinalObject;
    
        static ${controllerPrototypeName}* create(JSC::VM& vm, JSGlobalObject* globalObject, JSC::Structure* structure)
        {
            ${controllerPrototypeName}* ptr = new (NotNull, JSC::allocateCell<${controllerPrototypeName}>(vm)) ${controllerPrototypeName}(vm, globalObject, structure);
            ptr->finishCreation(vm, globalObject);
            return ptr;
        }
    
        DECLARE_INFO;
        template<typename CellType, JSC::SubspaceAccess>
        static JSC::GCClient::IsoSubspace* subspaceFor(JSC::VM& vm)
        {
            return &vm.plainObjectSpace();
        }
        static JSC::Structure* createStructure(JSC::VM& vm, JSC::JSGlobalObject* globalObject, JSC::JSValue prototype)
        {
            return JSC::Structure::create(vm, globalObject, prototype, JSC::TypeInfo(JSC::ObjectType, StructureFlags), info());
        }
    
    private:
        ${controllerPrototypeName}(JSC::VM& vm, JSC::JSGlobalObject* globalObject, JSC::Structure* structure)
            : Base(vm, structure)
        {
        }
    
        void finishCreation(JSC::VM&, JSC::JSGlobalObject*);
    };
    STATIC_ASSERT_ISO_SUBSPACE_SHARABLE(${controllerPrototypeName}, ${controllerPrototypeName}::Base);

const ClassInfo ${prototypeName}::s_info = { "${name}"_s, &Base::s_info, &JS${name}PrototypeTable, nullptr, CREATE_METHOD_TABLE(${prototypeName}) };
const ClassInfo ${className}::s_info = { "${name}"_s, &Base::s_info, nullptr, nullptr, CREATE_METHOD_TABLE(${className}) };
const ClassInfo ${constructor}::s_info = { "${name}"_s, &Base::s_info, nullptr, nullptr, CREATE_METHOD_TABLE(${constructor}) };


const ClassInfo ${controllerPrototypeName}::s_info = { "${controllerName}"_s, &Base::s_info, &${controllerPrototypeName}Table, nullptr, CREATE_METHOD_TABLE(${controllerPrototypeName}) };
const ClassInfo ${controller}::s_info = { "${controllerName}"_s, &Base::s_info, nullptr, nullptr, CREATE_METHOD_TABLE(${controller}) };

${className}::~${className}()
{
    if (m_sinkPtr) {
        ${name}__finalize(m_sinkPtr);
    }
}


${controller}::~${controller}()
{
    if (m_sinkPtr) {
        ${name}__finalize(m_sinkPtr);
    }
}

JSObject* ${className}::createPrototype(VM& vm, JSDOMGlobalObject& globalObject)
{
    return ${prototypeName}::create(vm, &globalObject, ${prototypeName}::createStructure(vm, &globalObject, globalObject.objectPrototype()));
}

JSObject* JS${controllerName}::createPrototype(VM& vm, JSDOMGlobalObject& globalObject)
{
    return ${controllerPrototypeName}::create(vm, &globalObject, ${controllerPrototypeName}::createStructure(vm, &globalObject, globalObject.objectPrototype()));
}

void JS${controllerName}::detach() {
    m_sinkPtr = nullptr;
    m_onPull.clear();

    auto readableStream = m_weakReadableStream.get();
    auto onClose = m_onClose.get();
    m_onClose.clear();

    if (readableStream && onClose) {
        JSC::JSGlobalObject *globalObject = this->globalObject();
        auto callData = JSC::getCallData(onClose);
        JSC::MarkedArgumentBuffer arguments;
        arguments.append(readableStream);
        arguments.append(jsUndefined());
        JSC::call(globalObject, onClose, callData, JSC::jsUndefined(), arguments);
    }
    
    m_weakReadableStream.clear();
}
`;

    templ += `

${constructor}* ${constructor}::create(JSC::VM& vm, JSC::JSGlobalObject* globalObject, JSC::Structure* structure, JSObject* prototype)
{
    ${constructor}* ptr = new (NotNull, JSC::allocateCell<${constructor}>(vm)) ${constructor}(vm, structure, ${name}__construct);
    ptr->finishCreation(vm, globalObject, prototype);
    return ptr;
}

${className}* ${className}::create(JSC::VM& vm, JSC::JSGlobalObject* globalObject, JSC::Structure* structure, void* sinkPtr)
{
    ${className}* ptr = new (NotNull, JSC::allocateCell<${className}>(vm)) ${className}(vm, structure, sinkPtr);
    ptr->finishCreation(vm);
    return ptr;
}

${controller}* ${controller}::create(JSC::VM& vm, JSC::JSGlobalObject* globalObject, JSC::Structure* structure, void* sinkPtr)
{
    ${controller}* ptr = new (NotNull, JSC::allocateCell<${controller}>(vm)) ${controller}(vm, structure, sinkPtr);
    ptr->finishCreation(vm);
    return ptr;
}

void ${constructor}::finishCreation(VM& vm, JSC::JSGlobalObject* globalObject, JSObject* prototype)
{
    Base::finishCreation(vm);
    ASSERT(inherits(info()));
    initializeProperties(vm, globalObject, prototype);
}

JSC::EncodedJSValue JSC_HOST_CALL_ATTRIBUTES ${constructor}::construct(JSC::JSGlobalObject* globalObject, JSC::CallFrame* callFrame) {
    return ${name}__construct(globalObject, callFrame);
}


void ${constructor}::initializeProperties(VM& vm, JSC::JSGlobalObject* globalObject, JSObject* prototype)
{
    putDirect(vm, vm.propertyNames->length, jsNumber(0), JSC::PropertyAttribute::ReadOnly | JSC::PropertyAttribute::DontEnum);
    JSString* nameString = jsNontrivialString(vm, "${name}"_s);
    m_originalName.set(vm, this, nameString);
    putDirect(vm, vm.propertyNames->name, nameString, JSC::PropertyAttribute::ReadOnly | JSC::PropertyAttribute::DontEnum);
}

void ${prototypeName}::finishCreation(JSC::VM& vm, JSC::JSGlobalObject* globalObject)
{
    Base::finishCreation(vm);
    reifyStaticProperties(vm, ${className}::info(), ${className}PrototypeTableValues, *this);
    putDirect(vm, JSC::Identifier::fromString(vm, "sinkId"_s), JSC::jsNumber(${className}::Sink), JSC::PropertyAttribute::ReadOnly | JSC::PropertyAttribute::DontEnum);
    JSC_TO_STRING_TAG_WITHOUT_TRANSITION();
}

void ${controllerPrototypeName}::finishCreation(JSC::VM& vm, JSC::JSGlobalObject* globalObject)
{
    Base::finishCreation(vm);
    reifyStaticProperties(vm, ${controller}::info(), ${controller}PrototypeTableValues, *this);
    putDirect(vm, JSC::Identifier::fromString(vm, "sinkId"_s), JSC::jsNumber(${className}::Sink), JSC::PropertyAttribute::ReadOnly | JSC::PropertyAttribute::DontEnum);
    JSC_TO_STRING_TAG_WITHOUT_TRANSITION();
}

void ${className}::finishCreation(VM& vm)
{
    Base::finishCreation(vm);
    ASSERT(inherits(info()));
}

void ${controller}::finishCreation(VM& vm)
{
    Base::finishCreation(vm);
    ASSERT(inherits(info()));
}


void ${className}::analyzeHeap(JSCell* cell, HeapAnalyzer& analyzer)
{
    auto* thisObject = jsCast<${className}*>(cell);
    if (void* wrapped = thisObject->wrapped()) {
        analyzer.setWrappedObjectForCell(cell, wrapped);
        // if (thisObject->scriptExecutionContext())
        //     analyzer.setLabelForCell(cell, "url " + thisObject->scriptExecutionContext()->url().string());
    }
    Base::analyzeHeap(cell, analyzer);
}

void ${controller}::analyzeHeap(JSCell* cell, HeapAnalyzer& analyzer)
{
    auto* thisObject = jsCast<${controller}*>(cell);
    if (void* wrapped = thisObject->wrapped()) {
        analyzer.setWrappedObjectForCell(cell, wrapped);
        // if (thisObject->scriptExecutionContext())
        //     analyzer.setLabelForCell(cell, "url " + thisObject->scriptExecutionContext()->url().string());
    }
    Base::analyzeHeap(cell, analyzer);
}


template<typename Visitor>
void ${controller}::visitChildrenImpl(JSCell* cell, Visitor& visitor)
{
    ${controller}* thisObject = jsCast<${controller}*>(cell);
    ASSERT_GC_OBJECT_INHERITS(thisObject, info());
    Base::visitChildren(thisObject, visitor);
    visitor.append(thisObject->m_onPull);
    visitor.append(thisObject->m_onClose);
    visitor.append(thisObject->m_weakReadableStream);
}

DEFINE_VISIT_CHILDREN(${controller});


void ${controller}::start(JSC::JSGlobalObject *globalObject, JSC::JSValue readableStream, JSC::JSFunction *onPull, JSC::JSFunction *onClose) {
    this->m_weakReadableStream = JSC::Weak<JSC::JSObject>(readableStream.getObject());
    this->m_onPull.set(globalObject->vm(), this, onPull);
    this->m_onClose.set(globalObject->vm(), this, onClose);
}

void ${className}::destroy(JSCell* cell)
{
    static_cast<${className}*>(cell)->${className}::~${className}();
}


void ${controller}::destroy(JSCell* cell)
{
    static_cast<${controller}*>(cell)->${controller}::~${controller}();
}


`;
  }

  templ += `
  JSObject* createJSSinkPrototype(JSC::VM& vm, JSC::JSGlobalObject* globalObject, SinkID sinkID)
  {
      switch (sinkID) {
    `;
  for (let name of classes) {
    templ += `
    case ${name}:
        return JS${name}Prototype::create(vm, globalObject, JS${name}Prototype::createStructure(vm, globalObject, globalObject->objectPrototype()));
`;
  }
  templ += `
default: 
    RELEASE_ASSERT_NOT_REACHED();
    }
}`;

  templ += `
JSObject* createJSSinkControllerPrototype(JSC::VM& vm, JSC::JSGlobalObject* globalObject, SinkID sinkID)
{
    switch (sinkID) {
  `;
  for (let name of classes) {
    const { controllerPrototypeName } = names(name);
    templ += `
  case ${name}:
      return ${controllerPrototypeName}::create(vm, globalObject, ${controllerPrototypeName}::createStructure(vm, globalObject, globalObject->objectPrototype()));
`;
  }
  templ += `
default: 
  RELEASE_ASSERT_NOT_REACHED();
  }
}`;

  templ += `
Structure* createJSSinkControllerStructure(JSC::VM& vm, JSC::JSGlobalObject* globalObject, SinkID sinkID)
{
    switch (sinkID) {
  `;
  for (let name of classes) {
    templ += `
  case ${name}: {
    auto* prototype = createJSSinkControllerPrototype(vm, globalObject, sinkID);
    return JSReadable${name}Controller::createStructure(vm, globalObject, prototype);
  }
`;
  }
  templ += `
default:
    RELEASE_ASSERT_NOT_REACHED();
  }
}`;

  templ += footer;

  for (let name of classes) {
    const {
      className,
      controller,
      prototypeName,
      controllerPrototypeName,
      constructor,
    } = names(name);

    templ += `
extern "C" JSC__JSValue ${name}__createObject(JSC__JSGlobalObject* arg0, void* sinkPtr)
{
    auto& vm = arg0->vm();
    Zig::GlobalObject* globalObject = reinterpret_cast<Zig::GlobalObject*>(arg0);
    JSC::JSValue prototype = globalObject->${name}Prototype();
    JSC::Structure* structure = WebCore::JS${name}::createStructure(vm, globalObject, prototype);
    return JSC::JSValue::encode(WebCore::JS${name}::create(vm, globalObject, structure, sinkPtr));
}

extern "C" void* ${name}__fromJS(JSC__JSGlobalObject* arg0, JSC__JSValue JSValue1)
{
    JSC::VM& vm = WebCore::getVM(arg0);
    if (auto* sink = JSC::jsDynamicCast<WebCore::JS${name}*>(JSC::JSValue::decode(JSValue1)))
        return sink->wrapped();

    if (auto* controller = JSC::jsDynamicCast<WebCore::${controller}*>(JSC::JSValue::decode(JSValue1)))
        return controller->wrapped();

    return nullptr;
}

extern "C" void ${name}__detachPtr(JSC__JSValue JSValue0)
{
    if (auto* sink = JSC::jsDynamicCast<WebCore::JS${name}*>(JSC::JSValue::decode(JSValue0))) {
        sink->detach();
        return;
    }
        

    if (auto* controller = JSC::jsDynamicCast<WebCore::${controller}*>(JSC::JSValue::decode(JSValue0))) {
        controller->detach();
        return;
    }
}

extern "C" JSC__JSValue ${name}__assignToStream(JSC__JSGlobalObject* arg0, JSC__JSValue stream, void* sinkPtr, void **controllerValue)
{
    auto& vm = arg0->vm();
    Zig::GlobalObject* globalObject = reinterpret_cast<Zig::GlobalObject*>(arg0);
    auto clientData = WebCore::clientData(vm);
    JSC::JSObject *readableStream = JSC::JSValue::decode(stream).getObject();
    auto scope = DECLARE_CATCH_SCOPE(vm);

    JSC::Structure* structure = WebCore::getDOMStructure<WebCore::${controller}>(vm, *globalObject);
    WebCore::${controller} *controller = WebCore::${controller}::create(vm, globalObject, structure, sinkPtr);
    *controllerValue = reinterpret_cast<void*>(JSC::JSValue::encode(controller));
    JSC::JSObject *function = globalObject->getDirect(vm, clientData->builtinNames().assignToStreamPrivateName()).getObject();
    auto callData = JSC::getCallData(function);
    JSC::MarkedArgumentBuffer arguments;
    arguments.append(JSC::JSValue::decode(stream));
    arguments.append(controller);

    auto result = JSC::call(arg0, function, callData, JSC::jsUndefined(), arguments);
    if (scope.exception())
        return JSC::JSValue::encode(scope.exception());

    return JSC::JSValue::encode(result);
}

extern "C" void ${name}__onReady(JSC__JSValue controllerValue, JSC__JSValue amt, JSC__JSValue offset)
{
    WebCore::${controller}* controller = JSC::jsCast<WebCore::${controller}*>(JSC::JSValue::decode(controllerValue).getObject());

    JSC::JSFunction *function = controller->m_onPull.get();
    if (function == nullptr)
        return;
    JSC::JSGlobalObject *globalObject = controller->globalObject();

    auto callData = JSC::getCallData(function);
    JSC::MarkedArgumentBuffer arguments;
    arguments.append(controller);
    arguments.append(JSC::JSValue::decode(amt));
    arguments.append(JSC::JSValue::decode(offset));

    JSC::call(globalObject, function, callData, JSC::jsUndefined(), arguments);
}

extern "C" void ${name}__onStart(JSC__JSValue controllerValue)
{

}

extern "C" void ${name}__onClose(JSC__JSValue controllerValue, JSC__JSValue reason)
{
    WebCore::${controller}* controller = JSC::jsCast<WebCore::${controller}*>(JSC::JSValue::decode(controllerValue).getObject());

    JSC::JSFunction *function = controller->m_onClose.get();
    if (function == nullptr)
        return;
    // only call close once
    controller->m_onClose.clear();
    JSC::JSGlobalObject *globalObject = controller->globalObject();

    auto callData = JSC::getCallData(function);
    JSC::MarkedArgumentBuffer arguments;
    auto readableStream = controller->m_weakReadableStream.get();
    arguments.append(readableStream ? readableStream : JSC::jsUndefined());

    arguments.append(JSC::JSValue::decode(reason));
    JSC::call(globalObject, function, callData, JSC::jsUndefined(), arguments);
}

`;
  }
  return templ;
}

await Bun.write(import.meta.dir + "/bindings/JSSink.h", header());
await Bun.write(
  import.meta.dir + "/bindings/JSSink.cpp",
  await implementation()
);
