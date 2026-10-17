import React from 'react';
import ReactDOM from 'react-dom/client';
import { FloatingCard } from '../components/FloatingCard';
import { isSupportedProductPage, parseProductFromPage } from '../lib/productParser';
import '../assets/tailwind.css';

export default defineContentScript({
  matches: [
    '*://*.amazon.in/*',
    '*://*.amazon.com/*',
    '*://*.flipkart.com/*',
    'http://localhost/*',
    'http://127.0.0.1/*',
  ],
  cssInjectionMode: 'ui',

  async main(ctx) {
    let currentUi: any = null;
    let rootInstance: ReactDOM.Root | null = null;
    let isVisible = false;

    const mountHoldOnUi = async (force: boolean = false) => {
      // Check if this page is a product page
      const isProduct = isSupportedProductPage(window.location.href);
      if (!isProduct && !force) {
        return;
      }

      const product = parseProductFromPage();
      if (!product) {
        return;
      }

      if (currentUi) {
        // Already mounted, just re-render if needed
        return;
      }

      try {
        currentUi = await createShadowRootUi(ctx, {
          name: 'holdon-circular-lens',
          position: 'overlay',
          anchor: 'body',
          append: 'last',
          isolateEvents: true,
          onMount: (uiContainer) => {
            const root = ReactDOM.createRoot(uiContainer);
            rootInstance = root;
            isVisible = true;

            root.render(
              <FloatingCard
                product={product}
                onClose={() => {
                  if (currentUi) {
                    currentUi.remove();
                    currentUi = null;
                    isVisible = false;
                  }
                }}
              />
            );
            return root;
          },
          onRemove: () => {
            if (rootInstance) {
              rootInstance.unmount();
              rootInstance = null;
              isVisible = false;
            }
          },
        });

        currentUi.mount();
      } catch (e) {
        console.warn('[HoldOn] Error mounting ShadowRoot UI:', e);
      }
    };

    // Initial check after DOM loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => mountHoldOnUi(), 800);
      });
    } else {
      setTimeout(() => mountHoldOnUi(), 800);
    }

    // SPA URL change listener
    let lastUrl = window.location.href;
    const observer = new MutationObserver(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        setTimeout(() => {
          if (isSupportedProductPage(currentUrl)) {
            if (currentUi) {
              currentUi.remove();
              currentUi = null;
            }
            mountHoldOnUi();
          }
        }, 1000);
      }
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
    });

    // Listen for manual trigger from popup or shortcut
    if (typeof browser !== 'undefined' && browser.runtime?.onMessage) {
      browser.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: any) => {
        if (message?.type === 'TOGGLE_HOLDON') {
          if (currentUi && isVisible) {
            currentUi.remove();
            currentUi = null;
            isVisible = false;
            sendResponse({ status: 'hidden' });
          } else {
            mountHoldOnUi(true);
            sendResponse({ status: 'shown' });
          }
        } else if (message?.type === 'CHECK_STATUS') {
          const isProduct = isSupportedProductPage(window.location.href);
          const product = isProduct ? parseProductFromPage() : null;
          sendResponse({
            isProductPage: isProduct,
            product,
            isUiVisible: isVisible,
          });
        }
        return true;
      });
    }
  },
});
