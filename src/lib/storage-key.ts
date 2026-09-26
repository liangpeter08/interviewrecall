export const STORAGE_KEY = "pyrecall:v1";

/** Inline script run before paint so the saved theme never flashes. */
export const themeBootScript = `try{var t=JSON.parse(localStorage.getItem("${STORAGE_KEY}")||"{}").theme;if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
