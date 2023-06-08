export function lerpColor(color1, color2, progress) {
    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    };
    
    const color1Rgb = hexToRgb(color1);
    const color2Rgb = hexToRgb(color2);
    
    const r = Math.round(lerp(color1Rgb[0], color2Rgb[0], progress));
    const g = Math.round(lerp(color1Rgb[1], color2Rgb[1], progress));
    const b = Math.round(lerp(color1Rgb[2], color2Rgb[2], progress));
    
    return `rgb(${r}, ${g}, ${b})`;
}
  
  
function lerp(value1, value2, progress) {
    return value1 + (value2 - value1) * progress;
}