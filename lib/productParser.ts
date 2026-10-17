import type { ProductInfo } from './types';

export function isSupportedProductPage(url: string = window.location.href): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname;

    // Amazon product page patterns: /dp/, /gp/product/
    if (host.includes('amazon.')) {
      return path.includes('/dp/') || path.includes('/gp/product/') || path.includes('/gp/aw/d/');
    }

    // Flipkart product page patterns: /p/itm... or contains pid=
    if (host.includes('flipkart.com')) {
      return path.includes('/p/') || parsed.searchParams.has('pid');
    }

    // Local test / generic dev page
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export function parseProductFromPage(): ProductInfo | null {
  const url = window.location.href;
  const host = window.location.hostname.toLowerCase();

  if (host.includes('amazon.')) {
    return parseAmazonProduct(url);
  } else if (host.includes('flipkart.com')) {
    return parseFlipkartProduct(url);
  } else {
    // Check if it's the demo page or generic page with data attributes
    return parseGenericOrDemoPage(url);
  }
}

function cleanPriceNumber(raw: string): number {
  if (!raw) return 0;
  // Remove currency symbols, commas, whitespace
  const sanitized = raw.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(sanitized);
  return isNaN(parsed) ? 0 : parsed;
}

function parseAmazonProduct(url: string): ProductInfo | null {
  const titleEl = document.querySelector<HTMLElement>('#productTitle, #title, h1#title');
  const title = titleEl?.innerText?.trim();
  if (!title) return null;

  // Price
  const priceEl = document.querySelector<HTMLElement>(
    '.priceToPay .a-offscreen, #corePriceDisplay_desktop_feature_div .a-price .a-offscreen, #corePrice_desktop .a-price .a-offscreen, #priceblock_ourprice, #priceblock_dealprice, .a-price .a-offscreen'
  );
  const rawPrice = priceEl?.innerText?.trim() || priceEl?.textContent?.trim() || '₹0';
  const price = cleanPriceNumber(rawPrice);

  // Image
  const imgEl = document.querySelector<HTMLImageElement>(
    '#landingImage, #imgTagWrapperId img, #main-image-container img, #imgBlkFront'
  );
  const imageUrl = imgEl?.src || imgEl?.dataset?.oldHires || imgEl?.dataset?.aDynamicImage;

  // Category breadcrumbs
  const breadcrumbs = Array.from(
    document.querySelectorAll('#wayfinding-breadcrumbs_container ul li a, .a-breadcrumb a')
  )
    .map((el) => (el as HTMLElement).innerText.trim())
    .filter(Boolean)
    .join(' > ');

  // Brand
  const brandEl = document.querySelector<HTMLElement>('#bylineInfo, #brand, .po-brand .a-span9');
  const brand = brandEl?.innerText?.replace(/^(Brand:|Visit the|Store)/i, '').trim();

  // Rating
  const ratingEl = document.querySelector<HTMLElement>('#acrPopover, span.a-icon-alt');
  const ratingText = ratingEl?.innerText || '';
  const ratingMatch = ratingText.match(/([0-9.]+)\s+out of/i);
  const rating = ratingMatch && ratingMatch[1] ? parseFloat(ratingMatch[1]) : 4.2;

  return {
    title,
    price: price || 2499,
    rawPrice: rawPrice || '₹2,499',
    currency: rawPrice.includes('$') ? '$' : '₹',
    brand,
    category: breadcrumbs || 'Amazon Item',
    imageUrl,
    url,
    rating,
    store: 'amazon',
  };
}

function parseFlipkartProduct(url: string): ProductInfo | null {
  const titleEl = document.querySelector<HTMLElement>('span.VU-ZEz, h1.B_NuCI, span.B_NuCI, h1');
  const title = titleEl?.innerText?.trim();
  if (!title) return null;

  // Price
  const priceEl = document.querySelector<HTMLElement>('div.Nx9bqj.CxhGGd, div._30jeq3._16J0hh, div._30jeq3');
  const rawPrice = priceEl?.innerText?.trim() || '₹0';
  const price = cleanPriceNumber(rawPrice);

  // Image
  const imgEl = document.querySelector<HTMLImageElement>('img._396cs4._2amPTt, img.DByuf4, img._2r_T1I, img._53J4C-');
  const imageUrl = imgEl?.src;

  // Category
  const breadcrumbs = Array.from(document.querySelectorAll('div._2whKao, a._2whKao, div.r2CdBx a'))
    .map((el) => (el as HTMLElement).innerText.trim())
    .filter(Boolean)
    .join(' > ');

  // Rating
  const ratingEl = document.querySelector<HTMLElement>('div.XQDdHH, div._3LWZlK');
  const rating = ratingEl ? parseFloat(ratingEl.innerText.trim()) : 4.0;

  return {
    title,
    price: price || 1999,
    rawPrice: rawPrice || '₹1,999',
    currency: '₹',
    category: breadcrumbs || 'Flipkart Item',
    imageUrl,
    url,
    rating,
    store: 'flipkart',
  };
}

function parseGenericOrDemoPage(url: string): ProductInfo {
  // Check for demo element or data attributes
  const demoCard = document.querySelector('[data-holdon-product]');
  if (demoCard) {
    const title = demoCard.querySelector('[data-product-title]')?.textContent?.trim() || 'Demo Product';
    const rawPrice = demoCard.querySelector('[data-product-price]')?.textContent?.trim() || '₹2,999';
    const category = demoCard.querySelector('[data-product-category]')?.textContent?.trim() || 'Electronics';
    const img = (demoCard.querySelector('img') as HTMLImageElement)?.src;
    return {
      title,
      price: cleanPriceNumber(rawPrice) || 2999,
      rawPrice,
      currency: '₹',
      category,
      imageUrl: img,
      url,
      rating: 4.5,
      store: 'demo',
    };
  }

  // Fallback default test product
  const h1 = document.querySelector('h1')?.innerText?.trim();
  return {
    title: h1 || 'Noise Cancelling Wireless Earbuds with Mic',
    price: 3499,
    rawPrice: '₹3,499',
    currency: '₹',
    category: 'Consumer Electronics > Audio > True Wireless Earbuds',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
    url,
    rating: 4.1,
    store: 'demo',
  };
}
