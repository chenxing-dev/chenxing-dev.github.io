import { gsap } from "gsap";
import { type Ref } from "vue";

export function useWindowAnimations(windowRef: Ref<HTMLElement | null>) {
    const openAnimation = () => {
        const el = windowRef.value;
        if (!el) return;
        // Ensure any ongoing animations are killed before starting a new one
        gsap.killTweensOf(el);
        return gsap.from(el, {
            scale: 0.1,
            opacity: 0,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    };
    const closeAnimation = (): Promise<void> => {
        const el = windowRef.value;
        if (!el) return Promise.resolve();
        // Ensure any ongoing animations are killed before starting a new one
        gsap.killTweensOf(el);
        return new Promise((resolve) => {
            gsap.to(el, {
                scale: 0.1,
                opacity: 0,
                duration: 0.3,
                ease: "back.in(1.7)",
                onComplete: () => resolve()
            });
        })
    };

    return {
        openAnimation,
        closeAnimation,
    };
}