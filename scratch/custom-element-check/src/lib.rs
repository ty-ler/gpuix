use gpuix_native::gpui::{self, prelude::*};
use gpuix_native::{
    custom_surface, CustomElement, CustomElementFactory, CustomRenderContext, GpuixView,
};

struct Greeting {
    name: String,
}

impl CustomElement for Greeting {
    fn render(
        &mut self,
        ctx: CustomRenderContext,
        _window: &mut gpui::Window,
        _cx: &mut gpui::Context<GpuixView>,
    ) -> gpui::AnyElement {
        let label = ctx.text(0, format!("Hello, {}", self.name), None);
        let root = gpui::div().id(gpui::ElementId::Name(
            format!("__check_greeting_{}", ctx.id).into(),
        ));
        custom_surface(root, &ctx)
            .bg(gpui::rgb(0x2255aa))
            .p_2()
            .child(label)
            .into_any_element()
    }

    fn set_prop(&mut self, key: &str, value: serde_json::Value) {
        if key == "name" {
            self.name = value.as_str().unwrap_or_default().to_string();
        }
    }

    fn supported_props(&self) -> &'static [&'static str] {
        &["name"]
    }

    fn supported_events(&self) -> &'static [&'static str] {
        &["click"]
    }

    fn destroy(&mut self) {}
}

struct GreetingFactory;

impl CustomElementFactory for GreetingFactory {
    fn element_type(&self) -> &str {
        "my-greeting"
    }

    fn create(&self, _id: u64) -> Box<dyn CustomElement> {
        Box::new(Greeting {
            name: String::new(),
        })
    }
}

#[napi_derive::module_init]
fn init() {
    gpuix_native::register_custom_element(|| Box::new(GreetingFactory)).unwrap();
}
