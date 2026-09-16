import html2canvas, { Options } from "html2canvas";

// In-memory cache for fast color conversions
const colorCache = new Map<string, string>();

let colorHelperCanvas: HTMLCanvasElement | null = null;
let colorHelperCtx: CanvasRenderingContext2D | null = null;

/**
 * Universal color resolver: converts modern CSS color formats (oklch, color(srgb...), lab, lch)
 * into standard hex (#rrggbb) or rgba(r, g, b, a) which html2canvas parses seamlessly.
 */
export function convertModernColorToRgb(rawColor: string): string {
  if (!rawColor || typeof rawColor !== "string") return rawColor;
  const trimmed = rawColor.trim();

  // If already standard format or transparent, return immediately
  if (
    !trimmed.includes("oklch") &&
    !trimmed.includes("color(") &&
    !trimmed.includes("lab(") &&
    !trimmed.includes("lch(")
  ) {
    return trimmed;
  }

  if (colorCache.has(trimmed)) {
    return colorCache.get(trimmed)!;
  }

  try {
    if (typeof document !== "undefined") {
      if (!colorHelperCanvas) {
        colorHelperCanvas = document.createElement("canvas");
        colorHelperCanvas.width = 1;
        colorHelperCanvas.height = 1;
        colorHelperCtx = colorHelperCanvas.getContext("2d", { willReadFrequently: true });
      }

      if (colorHelperCtx) {
        colorHelperCtx.fillStyle = "rgba(0, 0, 0, 0)";
        colorHelperCtx.fillStyle = trimmed;
        const converted = colorHelperCtx.fillStyle;
        if (converted && converted !== "rgba(0, 0, 0, 0)") {
          colorCache.set(trimmed, converted);
          return converted;
        }
      }
    }
  } catch (err) {
    // If canvas context fails on edge syntax, fall back
  }

  // Fallback map for common Tailwind palette colors if parsing fails
  if (trimmed.includes("oklch")) {
    if (trimmed.includes("0.7") || trimmed.includes("0.8") || trimmed.includes("0.9")) {
      return "#f8fafc";
    }
    return "#1e293b";
  }

  return trimmed;
}

/**
 * Parses any string with arbitrary CSS and replaces all instances of
 * oklch(...), color(...), lab(...), and lch(...) with resolved standard RGB values.
 */
export function sanitizeCssColors(cssText: string): string {
  if (!cssText || typeof cssText !== "string") return cssText;
  if (
    !cssText.includes("oklch") &&
    !cssText.includes("color(") &&
    !cssText.includes("lab(") &&
    !cssText.includes("lch(")
  ) {
    return cssText;
  }

  return cssText.replace(/(?:oklch|lab|lch|color)\([^)]+\)/gi, (match) => {
    return convertModernColorToRgb(match);
  });
}

const COLOR_PROPERTIES_TO_CLEAN = [
  "color",
  "background-color",
  "border-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "outline-color",
  "text-decoration-color",
  "box-shadow",
  "text-shadow",
  "fill",
  "stroke",
  "background-image",
  "background",
  "border",
  "border-top",
  "border-right",
  "border-bottom",
  "border-left"
];

/**
 * Cleans the cloned document hierarchy before html2canvas begins rendering.
 * Replaces all computed and stylesheet oklch references with safe hex/rgba values.
 */
export function cleanClonedDocument(clonedDoc: Document, clonedRoot: HTMLElement): void {
  try {
    // 1. Sanitize all <style> tags inside the cloned document
    const styleNodes = clonedDoc.querySelectorAll("style");
    styleNodes.forEach((styleTag) => {
      try {
        if (styleTag.textContent) {
          styleTag.textContent = sanitizeCssColors(styleTag.textContent);
        }
      } catch {}
    });

    // 2. Inject standard fallback CSS variables to eliminate Tailwind v4 root oklch variables
    const safetyStyle = clonedDoc.createElement("style");
    safetyStyle.id = "safe-html2canvas-patch";
    safetyStyle.textContent = `
      :root {
        --tw-border-color: #cbd5e1 !important;
        --tw-ring-color: rgba(59, 130, 246, 0.5) !important;
        --tw-shadow-color: rgba(0, 0, 0, 0.1) !important;
      }
      * {
        box-sizing: border-box !important;
      }
    `;
    clonedDoc.head?.appendChild(safetyStyle);

    // 3. Traverse all DOM elements in the cloned tree
    const allNodes = [clonedRoot, ...Array.from(clonedRoot.querySelectorAll("*"))] as HTMLElement[];
    const win = clonedDoc.defaultView || window;

    allNodes.forEach((node) => {
      if (!node) return;

      // Handle images: ensure CORS
      if (node.tagName === "IMG") {
        const img = node as HTMLImageElement;
        if (!img.crossOrigin && img.src && !img.src.startsWith("data:")) {
          img.crossOrigin = "anonymous";
        }
      }

      // Check inline style attribute
      if (node.style) {
        for (let i = 0; i < node.style.length; i++) {
          const propName = node.style[i];
          const val = node.style.getPropertyValue(propName);
          if (val && (val.includes("oklch") || val.includes("color(") || val.includes("lab(") || val.includes("lch("))) {
            const sanitized = sanitizeCssColors(val);
            node.style.setProperty(propName, sanitized, node.style.getPropertyPriority(propName));
          }
        }
      }

      // Check computed styles and override problematic properties
      try {
        const computed = win.getComputedStyle(node);
        COLOR_PROPERTIES_TO_CLEAN.forEach((prop) => {
          const val = computed.getPropertyValue(prop);
          if (val && (val.includes("oklch") || val.includes("color(") || val.includes("lab(") || val.includes("lch("))) {
            const sanitized = sanitizeCssColors(val);
            node.style.setProperty(prop, sanitized, "important");
          }
        });
      } catch {}
    });
  } catch (err) {
    console.warn("safeHtml2canvas: Document cleanup encounter warning:", err);
  }
}

/**
 * Drop-in wrapper around html2canvas that automatically fixes the
 * 'Attempting to parse an unsupported color function "oklch"' error.
 */
export async function safeHtml2canvas(
  element: HTMLElement,
  options: Partial<Options> = {}
): Promise<HTMLCanvasElement> {
  const userOnClone = options.onclone;

  const mergedOptions: Partial<Options> = {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
    imageTimeout: 8000,
    ...options,
    onclone: (clonedDoc, clonedElement) => {
      // 1. Run our universal oklch & color sanitizer
      cleanClonedDocument(clonedDoc, clonedElement);

      // 2. Run user-defined onclone if provided
      if (userOnClone) {
        userOnClone(clonedDoc, clonedElement);
      }
    }
  };

  try {
    return await html2canvas(element, mergedOptions);
  } catch (primaryErr: any) {
    console.warn("Primary safeHtml2canvas attempt failed, retrying with fallback settings:", primaryErr);
    
    // Retry with basic scale & sanitized clone
    return await html2canvas(element, {
      ...mergedOptions,
      scale: 2,
      foreignObjectRendering: false
    });
  }
}

export default safeHtml2canvas;
