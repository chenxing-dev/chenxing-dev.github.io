import { ref, computed, onMounted, type Ref } from "vue";
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
    const position = ref({ x: window.position.x, y: window.position.y });

    const { updateWindowState } = useDesktop();
    const { openAnimation, closeAnimation } = useWindowAnimations(windowRef);

    const title = window.app.title || "Untitled Window";

    const contentComponent = computed(() => getComponentById(window.app.id) || null);

    // Drag handlers
    const onDrag = (x: number, y: number) => {
        position.value = { x, y };
    };
    const onDragStop = () => {
        updateWindowState(window.id, position.value);
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