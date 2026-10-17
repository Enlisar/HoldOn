export default defineBackground(() => {
  console.log('[HoldOn Background] Initializing background service worker...');

  // Setup initial defaults on install
  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      console.log('[HoldOn] Extension installed. Ready for Amazon and Flipkart.');
    }
  });

  // Handle messages across extension components
  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'PING') {
      sendResponse({ status: 'alive' });
      return true;
    }
  });
});
