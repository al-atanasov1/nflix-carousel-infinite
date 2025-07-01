import { useEffect, useRef, useState } from 'react';
import './App.css';
import CarouselSimple from './components/CarouselSimple/CarouselSimple';
import { getImagesByPage, type PicsumImage } from './services/picsum.service';
import getRandomTitle from './utils/randomTitle';
import { AnimatePresence } from 'framer-motion';
import CarouselLoader from './components/CarouselLoader/CarouselLoader';
import CarouselSet from './components/CarouselSet/CarouselSet';
import CarouselCentral from './components/CarouselCentral/CarouselCentral';

const NUMBER_OF_SET_IMAGES = 20;
const DEFAULT_WIDTH: number = 600;

function App() {

    const [imagesSimple, setImagesSimple] = useState<PicsumImage[]>([]);
    const [page, setPage] = useState<number>(1);
    const [simpleLoading, setSimpleLoading] = useState<boolean>(true);

    const [imagesSet, setImagesSet] = useState<PicsumImage[]>([]);
    const [setLoading, setSetLoading] = useState<boolean>(true);

    const ranOnceSimple = useRef(false);
    const ranOnceSet = useRef(false);

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
                } else {
                    return;
                }
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setSimpleLoading(false);
            }
        }
    
        getData();
    }, [page]);

    useEffect(() => {
        if (ranOnceSet.current) return;
        ranOnceSet.current = true;

        const getData = async () => {
            try {
                const allImages: PicsumImage[] = [];

                for (let page = 1; page <= 1; page++) {
                    const result = await getImagesByPage(page, NUMBER_OF_SET_IMAGES);
                    if (result) {
                        const imagesWithTitles = result.map(img => ({
                            ...img,
                            title: getRandomTitle(),
                        }));
                        allImages.push(...imagesWithTitles);
                    }
                }

                setImagesSet(allImages);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setSetLoading(false);
            }
        }

        getData();
    }, [])

    return (
        <>
            <div className='flex flex-col gap-4 justify-center items-center w-full max-w-[2000px] h-full justify-self-center'>
                <div className='flex flex-col w-full gap-2 items-start'>
                    <h1 className='w-full text-6xl font-bold'>Netflix-like infinite carousel</h1>
                    <p className='w-full text-3xl opacity-60'>A showcase of different styles of infinite scrolling carousels.</p>
                </div>
                <div className='flex flex-col w-full gap-4'>
                    <div className="flex w-full mb-8 mt-16 items-center gap-8 flex-wrap">
                        <p className="text-4xl">Simple Carousel</p>
                        <p className="text-2xl opacity-70">Elements are fetched by page as long as there are more, no scroll-snapping</p>
                    </div>
                    <AnimatePresence mode='wait'>
                        {simpleLoading
                            ? <CarouselLoader />
                            : <CarouselSimple images={imagesSimple} page={page} setPage={setPage} defaultImageWidth={DEFAULT_WIDTH} />
                        }
                    </AnimatePresence>
                    <div className="flex w-full mb-8 mt-16 items-center gap-8 flex-wrap">
                        <p className="text-4xl">Set Items Carousel</p>
                        <p className="text-2xl opacity-70">Element number is predefined by input data, carousel loops at the end, hidden scrollbar, with scroll-snapping</p>
                    </div>
                    <AnimatePresence mode='wait'>
                        {setLoading
                            ? <CarouselLoader />
                            : <CarouselSet images={imagesSet} defaultImageWidth={DEFAULT_WIDTH}/>
                        }
                    </AnimatePresence>
                    <div className="flex w-full mb-8 mt-16 items-center gap-8 flex-wrap">
                        <p className="text-4xl">Central Highlight Carousel</p>
                        <p className="text-2xl opacity-70">Dynamic styling when approaching center of container</p>
                    </div>
                    <AnimatePresence mode='wait'>
                        {setLoading
                            ? <CarouselLoader />
                            : <CarouselCentral images={imagesSet} defaultImageWidth={DEFAULT_WIDTH}/>
                        }
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}

export default App;
