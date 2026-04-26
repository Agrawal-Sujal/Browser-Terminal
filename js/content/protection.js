let beforeUnloadListener = (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  e.returnValue = '';
  return '';
};

function setupProtection(protectedSites) {
  const currentDomain = window.location.hostname;
  const isProtected = protectedSites.some(site => {
    const cleanSite = site.trim();
    return cleanSite.length > 0 && currentDomain.includes(cleanSite);
  });

  if (isProtected) {
    window.addEventListener('beforeunload', beforeUnloadListener);
  } else {
    window.removeEventListener('beforeunload', beforeUnloadListener);
  }
}
