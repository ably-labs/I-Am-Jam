export class ImageHelpers {
    public static cache = new Map<string, HTMLImageElement>();

    public static async load(url: string) {
        url = url.trim();

        if (ImageHelpers.cache.has(url)) {
            return ImageHelpers.cache.get(url);
        }

        return await new Promise<HTMLImageElement>((resolve, reject) => {
            const i = new Image();
            i.onload = (loadEvent: any) => {
                console.log(loadEvent);
                const loadedImg = loadEvent.path ? loadEvent.path[0] : loadEvent.target;
                ImageHelpers.cache.set(url, loadedImg);

                console.log("ImageHelpers: loaded", url);
                resolve(loadedImg);
            };

            i.onerror = (errorEvent: any) => {
                console.log("ImageHelpers: Error loading", url);
                reject(errorEvent);
            };

            i.src = url;
        });
    }

    public static clone(source: HTMLImageElement) {
        const canvas = document.createElement("canvas");
        canvas.width = source.width;
        canvas.height = source.height;

        const context = canvas.getContext("2d");
        context.drawImage(source, 0, 0);
        return canvas;
    }

    public static mirror(source: HTMLImageElement) {
        const canvas = document.createElement("canvas");
        canvas.width = source.width;
        canvas.height = source.height;

        const context = canvas.getContext("2d");
        context.translate(source.width, 0);
        context.scale(-1, 1);
        context.drawImage(source, 0, 0);
        return canvas;
    }
}
