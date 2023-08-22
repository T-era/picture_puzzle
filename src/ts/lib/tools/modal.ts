export async function withElement<T>(dom :HTMLElement, f :()=>Promise<T>) :Promise<T> {
    dom.style.visibility = 'visible';
    const ret = await f();
    dom.style.visibility = 'hidden'
    return ret;
} 