export const shortenUrl = (url) => (url.length > 30 ? `${url.slice(0, 27)}...` : url);
export const shortenTxHash = (hash) => `${hash.slice(0, 6)}...${hash.slice(-4)}`;

export const parseAndDisplayWithShortLinks = (text) => {
  const regex = /((?:https?:\/\/starkscan\.co\/tx\/0x[a-fA-F0-9]{64})|(?:https?:\/\/voyager\.online\/tx\/0x[a-fA-F0-9]{64})|0x[a-fA-F0-9]{64}|https?:\/\/[^\s]+)/g;
  
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const found = match[0];
    const start = match.index;
    const end = regex.lastIndex;

    parts.push(text.slice(lastIndex, start));

    let modifiedUrl = found;
    if (process.env.NODE_ENV === 'development') {
      if (found.includes('starkscan.co')) {
        modifiedUrl = found.replace('starkscan.co', 'sepolia.starkscan.co');
      } else if (found.includes('voyager.online')) {
        modifiedUrl = found.replace('voyager.online', 'sepolia.voyager.online');
      }
    }

    if (found.startsWith('0x') && found.length === 66) {
      parts.push(`https://starkscan.co/tx/${found}`);
    } else if (found.includes('tx/0x')) {
      parts.push(`${modifiedUrl}`);
    } else if (found.startsWith('http')) {
      parts.push(`${modifiedUrl}`);
    } else {
      parts.push(found);
    }

    lastIndex = end;
  }

  parts.push(text.slice(lastIndex));
  return parts.join('');
};
