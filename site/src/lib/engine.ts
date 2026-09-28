// O Firefox (Gecko) sofre com camadas 3D e sombras borradas transformadas.
// Nele as inclinações viram 2D; no Chromium/Safari o 3D continua.
export const isGecko = typeof document !== 'undefined' && 'MozAppearance' in document.documentElement.style
