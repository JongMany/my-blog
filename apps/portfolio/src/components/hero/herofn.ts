import type { SpringConfig, SggoiTransition } from "./types";
import { prepareOutgoing } from "./utils/prepare-outgoing";
import { getRect } from "./utils/get-rect";

interface HeroOptions {
  spring?: Partial<SpringConfig>;
  timeout?: number;
}

function getHeroEl(page: HTMLElement, key: string): HTMLElement | null {
  return page.querySelector(`[data-hero-key="${key}"]`);
}

export const hero = (options: HeroOptions = {}): SggoiTransition => {
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? 300,
    damping: options.spring?.damping ?? 30,
  };
  const timeout = options.timeout ?? 300;

  console.log("🎬 Hero transition initialized with options:", options);

  // Closure variables to share state between in/out
  let fromNode: HTMLElement | null = null;
  let resolver: ((value: boolean) => void) | null = null;

  return {
    in: async (element, context) => {
      const toNode = element;
      console.log("🎬 Hero IN transition started for element:", toNode);

      // Find all hero elements in the incoming page
      const heroEls = Array.from(toNode.querySelectorAll("[data-hero-key]"));
      console.log("🎬 Found hero elements:", heroEls.length, heroEls);

      if (heroEls.length === 0) {
        console.log("🎬 No hero elements found, skipping animation");
        return {
          spring,
          tick: () => {}, // No hero elements, skip animation
        };
      }

      // Wait for fromNode to be set by out transition
      console.log("🎬 Waiting for fromNode...");
      const hasFromNode = await new Promise<boolean>((resolve) => {
        if (fromNode) {
          // fromNode already set by out transition
          console.log("🎬 fromNode already available:", fromNode);
          resolve(true);
        } else {
          // Store resolver for out transition to call
          console.log("🎬 fromNode not available, waiting...");
          resolver = resolve;
          // Timeout fallback
          setTimeout(() => {
            console.log("🎬 Timeout waiting for fromNode");
            resolver = null;
            resolve(false);
          }, timeout);
        }
      });

      if (!hasFromNode || !fromNode) {
        console.log("🎬 No fromNode available, skipping animation");
        fromNode = null;
        return {
          spring,
          tick: () => {}, // No fromNode, skip animation
        };
      }

      // Calculate animations for matching hero elements
      console.log("🎬 Calculating hero animations...");
      const heroAnimations = heroEls
        .map((heroEl) => {
          const key = heroEl.getAttribute("data-hero-key");
          console.log("🎬 Processing hero element with key:", key);

          if (!key) return null;

          const fromEl = getHeroEl(fromNode!, key);
          console.log("🎬 Found matching fromEl:", fromEl);

          if (!fromEl) return null;

          const toEl = heroEl as HTMLElement;

          // Calculate animation parameters
          const fromRect = getRect(fromNode!, fromEl);
          const toRect = getRect(toNode, toEl);
          const dx = fromRect.left - toRect.left - context.scrollOffset.x;
          const dy = fromRect.top - toRect.top - context.scrollOffset.y;
          const dw = fromRect.width / toRect.width;
          const dh = fromRect.height / toRect.height;

          console.log("🎬 Animation params:", {
            dx,
            dy,
            dw,
            dh,
            fromRect,
            toRect,
          });

          // Store original styles
          const originalTransform = toEl.style.transform;
          const originalPosition = toEl.style.position;
          const originalTransformOrigin = toEl.style.transformOrigin;
          const originalZIndex = toEl.style.zIndex;

          return {
            toEl,
            dx,
            dy,
            dw,
            dh,
            originalTransform,
            originalPosition,
            originalTransformOrigin,
            originalZIndex,
          };
        })
        .filter(Boolean) as Array<{
        toEl: HTMLElement;
        dx: number;
        dy: number;
        dw: number;
        dh: number;
        originalTransform: string;
        originalPosition: string;
        originalTransformOrigin: string;
        originalZIndex: string;
      }>;

      // Reset fromNode for next transition
      fromNode = null;
      console.log("🎬 Hero animations calculated:", heroAnimations.length);

      if (heroAnimations.length === 0) {
        console.log("🎬 No matching hero elements, skipping animation");
        return {
          spring,
          tick: () => {}, // No matching hero elements
        };
      }

      console.log(
        "🎬 Returning hero animation with",
        heroAnimations.length,
        "elements",
      );

      return {
        spring,
        prepare: () => {
          console.log("🎬 Preparing hero animation...");
          heroAnimations.forEach(({ toEl }) => {
            toEl.style.position = "relative";
            toEl.style.transformOrigin = "top left";
            toEl.style.zIndex = "1000";
          });
        },
        tick: (progress) => {
          // Animate all hero elements
          heroAnimations.forEach(({ toEl, dx, dy, dw, dh }) => {
            toEl.style.transform = `translate(${(1 - progress) * dx}px,${(1 - progress) * dy}px) scale(${progress + (1 - progress) * dw}, ${progress + (1 - progress) * dh})`;
          });
        },
        onEnd: () => {
          console.log("🎬 Hero animation ended, resetting styles...");
          // Reset all hero elements
          heroAnimations.forEach(
            ({
              toEl,
              originalTransform,
              originalPosition,
              originalTransformOrigin,
              originalZIndex,
            }) => {
              toEl.style.transform = originalTransform;
              toEl.style.position = originalPosition;
              toEl.style.transformOrigin = originalTransformOrigin;
              toEl.style.zIndex = originalZIndex;
            },
          );
        },
      };
    },
    out: async (element) => {
      console.log("🎬 Hero OUT transition started for element:", element);

      return {
        onStart: () => {
          console.log("🎬 Hero OUT onStart - storing fromNode");
          // Store fromNode
          fromNode = element;

          // If there's a waiting resolver, resolve it
          if (resolver) {
            console.log("🎬 Resolving waiting promise");
            resolver(true);
            resolver = null;
          }
        },
        prepare: (element) => {
          console.log("🎬 Hero OUT prepare - preparing outgoing element");
          prepareOutgoing(element);
          element.style.opacity = "0";
        },
      };
    },
  };
};
