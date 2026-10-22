---
"@gpuix/native": minor
"@gpuix/solid": minor
---

Crates that link `gpuix-native` can add their own native elements with `register_custom_element`. The `CustomElement` and `CustomElementFactory` traits, `CustomRenderContext`, `custom_surface`, `emit_event_full` and `GpuixView` are now public, and `gpuix_native::gpui` re-exports the GPUI the renderer uses. Element names must contain a `-`; `@gpuix/solid` now accepts those tags instead of throwing.
