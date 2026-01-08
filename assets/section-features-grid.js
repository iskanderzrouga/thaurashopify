/**
 * Features Grid Section JavaScript
 * Handles dynamic behavior and animations for the features grid
 */

class FeaturesGrid {
  constructor(container) {
    this.container = container;
    this.features = container.querySelectorAll(".features-grid__feature");
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupAccessibility();
  }

  /**
   * Setup intersection observer for animation on scroll
   */
  setupIntersectionObserver() {
    if (!window.IntersectionObserver) return;

    const options = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    }, options);

    this.features.forEach((feature, index) => {
      // Add staggered animation delay
      feature.style.setProperty("--animation-delay", `${index * 0.1}s`);
      observer.observe(feature);
    });
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    this.features.forEach((feature) => {
      const icon = feature.querySelector(".features-grid__icon");
      const text = feature.querySelector(".features-grid__feature-text");

      if (icon && text) {
        // Ensure proper alt text for screen readers
        const textContent = text.textContent.trim();
        if (!icon.alt || icon.alt === textContent) {
          icon.alt = `Icon for: ${textContent}`;
        }
      }
    });
  }

  /**
   * Update grid layout based on feature count
   */
  updateLayout() {
    const featuresContainer = this.container.querySelector(
      ".features-grid__features"
    );
    if (!featuresContainer) return;

    const featureCount = this.features.length;
    featuresContainer.setAttribute("data-features-count", featureCount);
  }

  /**
   * Refresh the grid (useful for dynamic content updates)
   */
  refresh() {
    this.features = this.container.querySelectorAll(".features-grid__feature");
    this.updateLayout();
    this.setupAccessibility();
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const featuresGrids = document.querySelectorAll(".features-grid");

  featuresGrids.forEach((grid) => {
    new FeaturesGrid(grid);
  });
});

// Handle Shopify theme editor updates
if (window.Shopify && window.Shopify.designMode) {
  document.addEventListener("shopify:section:load", (event) => {
    const section = event.target;
    const featuresGrid = section.querySelector(".features-grid");

    if (featuresGrid) {
      new FeaturesGrid(featuresGrid);
    }
  });

  document.addEventListener("shopify:section:reorder", (event) => {
    const section = event.target;
    const featuresGrid = section.querySelector(".features-grid");

    if (featuresGrid) {
      const instance = new FeaturesGrid(featuresGrid);
      instance.refresh();
    }
  });
}

// Export for potential external use
if (typeof module !== "undefined" && module.exports) {
  module.exports = FeaturesGrid;
} else if (typeof window !== "undefined") {
  window.FeaturesGrid = FeaturesGrid;
}







