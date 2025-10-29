import { ref, reactive, onMounted, type Ref, markRaw, type Component } from "vue";
import { getComponentById } from "@/config/apps-registry";
import useDesktop from "@/composables/useDesktop";
import { useWindowAnimations } from "@/composables/useWindowAnimations";
import type { WindowItem } from "@/types";

export type EmitFn = {
    (e: "close", id: number): void;
    (e: "focus", id: number): void;
};

export function useWindowInstance(window: WindowItem, emit: EmitFn) {
    const windowRef: Ref<HTMLElement | null> = ref(null);

    // Local (live) drag position (initial from persisted state)
    // Use reactive + field mutation to avoid creating a new object on each drag event
    const position = reactive({ x: window.position.x, y: window.position.y });

    const { updateWindowState } = useDesktop();
    const { openAnimation, closeAnimation } = useWindowAnimations(windowRef);

    const title = window.app.title || "Untitled Window";

    // Component is stable for the lifetime of the window; avoid reactive tracking/proxying
    const contentComponent = markRaw<Component>(getComponentById(window.app.id));

    // Drag handlers
    const onDrag = (x: number, y: number) => {
        position.x = x;
        position.y = y;
    };
    const onDragStop = () => {
        // Persist position to store
        updateWindowState(window.id, { x: position.x, y: position.y });
    };

    // Focus helpers
    const focus = () => emit("focus", window.id);
    const onMousedown = () => focus();

    // Close handler (animate then emit)
    const handleClose = async () => {
        await closeAnimation();
        emit("close", window.id);
    };

    onMounted(() => {
        openAnimation();
    });

    return {
        windowRef,
        position,
        title,
        contentComponent,
        onDrag,
        onDragStop,
        onMousedown,
        focus,
        handleClose
    };
}