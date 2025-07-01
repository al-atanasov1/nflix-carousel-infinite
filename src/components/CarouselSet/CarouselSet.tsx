import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { PicsumImage } from '../../services/picsum.service';

type SetCarouselProps = {
    images: PicsumImage[];
    defaultImageWidth: number;
}

function getCloneCount() {
    if (window.innerWidth >= 1024) return 5;
    if (window.innerWidth >= 768) return 2;
    return 1;
}

function CarouselSet({ images, defaultImageWidth }: SetCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [cloneCount, setCloneCount] = useState(getCloneCount());

    useEffect(() => {
        function handleResize() {
            setCloneCount(getCloneCount());
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const extendedImages = [...images, ...images.slice(0, cloneCount)];

    const handleScroll = () => {
        const container = containerRef.current;
        if (!container) return;

        if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
            container.scrollTo({ left: 0, behavior: 'instant' });
        }
    };

    return (
        <motion.div 
            className="flex flex-col w-full h-fit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <div
                ref={containerRef}
                className="flex flex-row h-fit max-w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                onScroll={handleScroll}
            >
                {extendedImages.map((image, index) => {
                    const scaledHeight = Math.round((image.height / image.width) * defaultImageWidth);
                    return (
                        <div key={`${image.id}-set-${index}`} className="flex flex-row mr-4 lg:flex-none lg:basis-[calc(20%_-_16px)] md:flex-none md:basis-[calc(50%_-_15px)] md:w-1/2 sm:w-full h-50 shrink-0 snap-start">
                            <div className="relative flex flex-col justify-end w-full h-full p-4 shrink-0 rounded-2xl bg-cover bg-center group" style={{backgroundImage: `url(https://picsum.photos/id/${image.id}/${defaultImageWidth}/${scaledHeight})`}}>
                                <div className="absolute inset-0 bg-black/50 rounded-2xl transition-all z-0 group-hover:bg-black/80" />
                                <p className="text-3xl transition-all z-1 group-hover:transform group-hover:translate-y-[-75%]">{image.title}</p>
                                <p className="absolute left-4 bottom-4 text-xl opacity-0 transition-all z-1 group-hover:opacity-70">{image.author}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default CarouselSet;