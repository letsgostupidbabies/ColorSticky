// background.js (MV3 service worker)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'color-sticky-add',
    title: 'Сохранить выделение как стикер',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'color-sticky-add' && info.selectionText) {
    // Save directly into storage and also ping popup (if open)
    const text = info.selectionText.trim();
    const { notes = [], options = { defaultColor: '#ffd6a5' } } = await chrome.storage.sync.get(['notes','options']);
    const note = {
      id: Math.random().toString(36).slice(2,10),
      text,
      color: options.defaultColor || '#ffd6a5',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await chrome.storage.sync.set({ notes: [...notes, note] });
    // Notify any popup
    chrome.runtime.sendMessage({ type:'add-note-from-selection', text });
  }
});
