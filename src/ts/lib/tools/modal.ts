export async function withElements<T>(f :()=>Promise<T>, ...doms :HTMLElement[]) :Promise<T> {
    for (let dom of doms) {
        dom.style.visibility = 'visible'
    };
    const ret = await f();
    for (let dom of doms) {
        dom.style.visibility = 'hidden'
    }
    return ret;
} 