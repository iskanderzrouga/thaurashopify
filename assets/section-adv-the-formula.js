/**
 * Mobile Tabs/Pills System for Formula Section
 * Shows/hides ingredient cards with smooth animations
 */

class AdvFormulaSection {
  constructor() {
    this.initialized = new Set();
    this.isAnimating = false; // Prevent rapid clicks during animation
    this.init();
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }

    // Shopify theme editor support
    if (typeof Shopify !== "undefined" && Shopify.designMode) {
      document.addEventListener("shopify:section:load", (event) => {
        if (event.detail && event.detail.sectionId) {
          setTimeout(() => {
            this.initialized.clear();
            this.setup();
          }, 100);
        }
      });
    }
  }

  setup() {
    // Only on mobile
    if (window.innerWidth >= 750) {
      this.showAllCards(); // Desktop: show all cards
      return;
    }

    const sections = document.querySelectorAll(".adv-formula");

    sections.forEach((section) => {
      const sectionId = section.getAttribute("data-section-id");

      // Skip if already initialized
      if (this.initialized.has(sectionId)) {
        return;
      }

      this.setupMobileTabs(section);
      this.initialized.add(sectionId);
    });
  }

  setupMobileTabs(section) {
    const cardsContainer = section.querySelector(".adv-formula__cards");
    if (!cardsContainer) return;

    const cards = Array.from(
      cardsContainer.querySelectorAll(".adv-formula__card")
    );
    if (cards.length === 0) return;

    // Remove existing tabs if any
    const existingTabs = section.querySelector(".adv-formula__tabs");
    if (existingTabs) {
      existingTabs.remove();
    }

    // Create and insert tabs
    const tabsContainer = this.createTabsContainer(cards);
    cardsContainer.parentNode.insertBefore(tabsContainer, cardsContainer);

    // CRITICAL: Hide all cards except first
    cards.forEach((card, index) => {
      if (index === 0) {
        card.setAttribute("data-active", "true");
        card.style.display = "flex";
      } else {
        card.setAttribute("data-active", "false");
        card.style.display = "none";
      }
    });

    // Add click handlers with animation
    const tabs = tabsContainer.querySelectorAll(".adv-formula__tab");
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();

        // Prevent clicks during animation
        if (this.isAnimating) return;

        this.switchTabWithAnimation(tabs, cards, index);
      });
    });

    console.log(
      `[Formula Mobile] Initialized with ${cards.length} ingredients`
    );
  }

  createTabsContainer(cards) {
    const container = document.createElement("div");
    container.className = "adv-formula__tabs";

    cards.forEach((card, index) => {
      const tab = document.createElement("button");
      tab.className = `adv-formula__tab ${
        index === 0 ? "adv-formula__tab--active" : ""
      }`;
      tab.type = "button";
      tab.setAttribute("aria-label", `Show ingredient ${index + 1}`);
      tab.setAttribute("data-tab-index", index);

      // Extract button text from card title
      const titleEl = card.querySelector(".adv-formula__card-title");
      const fullTitle = titleEl
        ? titleEl.textContent.trim()
        : `Ingredient ${index + 1}`;

      let buttonText = fullTitle;

      // Extract short names for buttons
      if (fullTitle.includes("KSM-66")) {
        buttonText = "KSM-66® Ashwagandha";
      } else if (fullTitle.includes("GlucoVantage")) {
        buttonText = "GlucoVantage® Dihydroberberine";
      } else if (fullTitle.includes("L-Theanine")) {
        buttonText = "L-Theanine";
      }

      tab.textContent = buttonText;
      container.appendChild(tab);
    });

    return container;
  }

  switchTabWithAnimation(tabs, cards, activeIndex) {
    // Check if already active
    const currentActiveCard = cards.findIndex(
      (card) => card.getAttribute("data-active") === "true"
    );

    if (currentActiveCard === activeIndex) {
      return; // Already showing this card
    }

    console.log(
      `[Formula Mobile] Switching from ${currentActiveCard + 1} to ${
        activeIndex + 1
      }`
    );

    this.isAnimating = true;

    // Step 1: Update tabs immediately
    tabs.forEach((tab, index) => {
      if (index === activeIndex) {
        tab.classList.add("adv-formula__tab--active");
        tab.setAttribute("aria-selected", "true");
      } else {
        tab.classList.remove("adv-formula__tab--active");
        tab.setAttribute("aria-selected", "false");
      }
    });

    // Step 2: Fade out current card
    const currentCard = cards[currentActiveCard];
    if (currentCard) {
      currentCard.style.opacity = "0";
      currentCard.style.transform = "scale(0.95) translateY(10px)";
    }

    // Step 3: After fade out, switch cards
    setTimeout(() => {
      cards.forEach((card, index) => {
        if (index === activeIndex) {
          // Show new card
          card.setAttribute("data-active", "true");
          card.style.display = "flex";

          // Trigger reflow for animation
          card.offsetHeight;

          // Fade in
          card.style.opacity = "1";
          card.style.transform = "scale(1) translateY(0)";
        } else {
          // Hide others
          card.setAttribute("data-active", "false");
          card.style.display = "none";
          card.style.opacity = "0";
          card.style.transform = "scale(0.95) translateY(10px)";
        }
      });

      // Allow clicks again after animation completes
      setTimeout(() => {
        this.isAnimating = false;
      }, 400);
    }, 200); // Wait for fade out
  }

  showAllCards() {
    // Desktop: show all cards
    const allCards = document.querySelectorAll(".adv-formula__card");
    allCards.forEach((card) => {
      card.style.display = "flex";
      card.removeAttribute("data-active");
      card.style.opacity = "1";
      card.style.transform = "none";
    });
  }

  reset() {
    this.initialized.clear();

    // Remove all tabs
    const allTabs = document.querySelectorAll(".adv-formula__tabs");
    allTabs.forEach((tab) => tab.remove());

    // Show all cards
    this.showAllCards();
  }
}

// Initialize
const formulaSection = new AdvFormulaSection();

// Handle resize
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    formulaSection.reset();
    formulaSection.setup();
  }, 250);
});
