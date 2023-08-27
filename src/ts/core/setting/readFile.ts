export async function readFileAsDataUrl(file :File) :Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) {
                resolve(reader.result as string);
            } else {
                reject();
            }
        };
        reader.readAsDataURL(file);
    });
}    
