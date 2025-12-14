import { JSDOM } from 'jsdom';

/**
 * Parses HTML product specifications into a structured object
 * @param {string} htmlString - The HTML string from product.shortDescription
 * @returns {Object} - Structured product specifications
 */
export const parseProductSpecs = (htmlString) => {
  if (!htmlString) return {};

  const dom = new JSDOM(htmlString);
  const document = dom.window.document;
  const specs = {};

  // Get all table rows
  const rows = document.querySelectorAll('tr');

  rows.forEach((row) => {
    const th = row.querySelector('th');
    const td = row.querySelector('td');

    if (th && td) {
      const key = th.textContent.trim();
      // Clean up the value by removing extra whitespace and newlines
      let value = td.textContent.replace(/\s+/g, ' ').trim();

      // Special handling for certain fields
      if (key.toLowerCase().includes('dimension')) {
        // Extract dimensions into an object if in W x D x H format
        const dimensions = value.match(
          /([\d.]+)\s*x\s*([\d.]+)\s*x\s*([\d.]+)/i
        );
        if (dimensions) {
          value = {
            width: parseFloat(dimensions[1]),
            depth: parseFloat(dimensions[2]),
            height: parseFloat(dimensions[3]),
            unit: value.match(/[a-zA-Z]+$/)?.[0] || 'cm', // Default to cm if no unit specified
          };
        }
      } else if (key.toLowerCase().includes('weight')) {
        // Extract weight and unit
        const weightMatch = value.match(/([\d.]+)\s*([a-zA-Z]+)/);
        if (weightMatch) {
          value = {
            value: parseFloat(weightMatch[1]),
            unit: weightMatch[2].toLowerCase(),
          };
        }
      } else if (
        key.toLowerCase().includes('memory') ||
        key.toLowerCase().includes('storage')
      ) {
        // Extract memory/storage size and unit
        const memoryMatch = value.match(/([\d.]+)\s*([GT]B)/i);
        if (memoryMatch) {
          value = {
            value: parseFloat(memoryMatch[1]),
            unit: memoryMatch[2].toUpperCase() + 'B',
          };
        }
      }

      // Convert to camelCase for JavaScript conventions
      const camelCaseKey = key
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(' ')
        .map((word, i) =>
          i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join('');

      specs[camelCaseKey] = value;
    }
  });

  return specs;
};

/**
 * Extracts key specifications for display in product cards or lists
 * @param {Object} specs - Full specifications from parseProductSpecs
 * @returns {Object} - Key specifications for quick display
 */
export const getKeySpecs = (specs) => {
  const keySpecs = {};

  // Look for common specification keys
  const keyMappings = {
    processor: 'processor',
    memory: ['memory', 'ram'],
    storage: ['storage', 'ssd', 'hdd'],
    display: ['display', 'screen'],
    os: ['operating system', 'os'],
    graphics: ['graphics', 'gpu'],
    battery: ['battery', 'battery life'],
  };

  // Find matching specs
  Object.entries(keyMappings).forEach(([outputKey, possibleKeys]) => {
    const key = Array.isArray(possibleKeys)
      ? Object.keys(specs).find((k) =>
          possibleKeys.some((pk) => k.toLowerCase().includes(pk))
        )
      : possibleKeys;

    if (key && specs[key]) {
      keySpecs[outputKey] = specs[key];
    }
  });

  return keySpecs;
};
