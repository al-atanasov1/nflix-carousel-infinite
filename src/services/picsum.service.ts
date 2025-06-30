export type PicsumImage = {
    id: string;
    author: string;
    width: number;
    height: number;
    url: string;
    download_url: string;
    title?: string;
}

export async function getImagesByPage(page: number, numberOfImages: number): Promise<PicsumImage[] | null> {
    try {
        const result = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${numberOfImages}`);
        const data: PicsumImage[] = await result.json();
        
        return data;
    }
    catch (error) {
        console.error('Failed pulling carousel data: ', error);
        return null;
    }
}