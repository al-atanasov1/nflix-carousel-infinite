import { useEffect, useRef, useState } from 'react';
import './App.css';
import CarouselSimple from './components/CarouselSimple/CarouselSimple';
import { getImagesByPage, type PicsumImage } from './services/picsum.service';
import getRandomTitle from './utils/randomTitle';
import { AnimatePresence } from 'framer-motion';
import CarouselLoader from './components/CarouselLoader/CarouselLoader';

const DEFAULT_WIDTH: number = 600;

function App() {

    const [initialLoading, setInitialLoading] = useState<boolean>(true);

    const [page, setPage] = useState<number>(1);
    const [imagesSimple, setImagesSimple] = useState<PicsumImage[]>([]);

    const ranOnceSimple = useRef(false);

    useEffect(() => {
        if (page === 1) {
            if (ranOnceSimple.current) return;
            ranOnceSimple.current = true;
        }
    
        const getData = async () => {
            try {
                const result = await getImagesByPage(page, 5);
                if (result) {
                    const imagesWithTitles = result.map(img => ({
                        ...img,
                        title: getRandomTitle(),
                    }))
                    setImagesSimple(prev => (prev.concat(imagesWithTitles)));
                }
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setInitialLoading(false);
            }
        }
    
        getData();
    }, [page]);

    return (
        <>
            <div className='flex flex-col gap-4 justify-center items-center w-full max-w-[2000px] h-full justify-self-center'>
                <div className='flex flex-col w-full gap-2 items-start mb-8'>
                    <h1 className='w-full text-6xl font-bold'>Netflix-like infinite carousel</h1>
                    <p className='w-full text-3xl opacity-60'>A showcase of different styles of infinite scrolling carousels.</p>
                </div>
                <div className='flex flex-col w-full gap-4'>
                    <div className="flex w-full mb-8 items-center gap-8 flex-wrap">
                        <p className="text-4xl">Simple Carousel</p>
                        <p className="text-2xl opacity-70">Images are fetched by page as long as there are more, no scroll-snapping</p>
                    </div>
                    <AnimatePresence mode='wait'>
                        {initialLoading
                            ? <CarouselLoader />
                            : <CarouselSimple images={imagesSimple} page={page} setPage={setPage} defaultImageWidth={DEFAULT_WIDTH} />
                        }
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}

export default App;
