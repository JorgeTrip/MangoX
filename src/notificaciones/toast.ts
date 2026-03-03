export function toast(mensaje: string) {
  try {
    window.dispatchEvent(new CustomEvent('mangox:toast', { detail: mensaje }));
  } catch {
    void 0;
  }
}
