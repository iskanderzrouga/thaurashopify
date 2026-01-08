/**
 * Section: What If Your Body - Auto-styling Script
 * DISABLED - Let Shopify rich text editor handle styling
 */

class AdvWhatIfYourBody {
  constructor() {
    // Script disabled to allow Shopify editor control
    console.log(
      "[What If Your Body] Auto-styling disabled - using Shopify editor"
    );
  }

  init() {
    // Disabled
  }

  runStyling() {
    // Disabled
  }

  styleFeatureTexts() {
    // Disabled
  }

  processTextWithPatterns(text) {
    // Disabled
    return text;
  }

  processTextGeneric(text) {
    // Disabled
    return text;
  }

  wrapBold(text) {
    // Disabled
    return text;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize
console.log("[What If Your Body] Script loaded, initializing...");
const advWhatIfInstance = new AdvWhatIfYourBody();

// Shopify theme editor support
if (typeof Shopify !== "undefined" && Shopify.designMode) {
  console.log(
    "[What If Your Body] Theme editor detected, adding event listeners"
  );

  document.addEventListener("shopify:section:load", (event) => {
    console.log("[What If Your Body] Section loaded/reloaded");
    if (event.detail && event.detail.sectionId) {
      setTimeout(() => {
        new AdvWhatIfYourBody();
      }, 100);
    }
  });

  document.addEventListener("shopify:section:select", () => {
    console.log("[What If Your Body] Section selected");
    setTimeout(() => {
      new AdvWhatIfYourBody();
    }, 100);
  });
}
