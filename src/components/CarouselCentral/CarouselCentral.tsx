import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import type { PicsumImage } from '../../services/picsum.service';

type CentralCarouselProps = {
    images: PicsumImage[];
    defaultImageWidth: number;
}

function getCloneCount():number {
    if (window.innerWidth >= 1024) return 5;
    if (window.innerWidth >= 768) return 2;
    return 1;
}

function CarouselCentral({ images, defaultImageWidth }: CentralCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const centerChecker = useRef<HTMLDivElement>(null);

    const [cloneCount, setCloneCount] = useState<number>(getCloneCount());
    const [centerIndex, setCenterIndex] = useState<number>(2);
    const [centerRect, setCenterRect] = useState<DOMRect | null>(null);
    const [carouselElements, setCarouselElements] = useState<NodeListOf<Element> | null>(null);

    useEffect(() => {
        function handleResize() {
            setCloneCount(getCloneCount());

            if (centerChecker.current) {
                setCenterRect(centerChecker.current.getBoundingClientRect());
            }

            if (containerRef.current) {
                const elements = containerRef.current.querySelectorAll('div[data-index]');
                setCarouselElements(elements);
            }
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!containerRef.current || !centerChecker.current) return;

        setCenterRect(centerChecker.current.getBoundingClientRect())

        const elements = containerRef.current.querySelectorAll('div[data-index]');
        setCarouselElements(elements);

    }, [])

    const extendedImages = [...images, ...images.slice(0, cloneCount)];

    const handleScroll = () => {
        const container = containerRef.current;
        if (!container || !centerRect || !carouselElements) return;

        if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
            container.scrollTo({ left: 0, behavior: 'instant' });
            return;
        }

        let minDistance = Infinity;
        let newCenterIndex = centerIndex;

        carouselElements.forEach(element => {
            const elementRect = element.getBoundingClientRect();
            const elementCenter = (elementRect.left + elementRect.right) / 2;
            const centerLine = (centerRect.left + centerRect.right) / 2;
            const distance = Math.abs(elementCenter - centerLine);

            if (distance < minDistance) {
                minDistance = distance;
                newCenterIndex = Number(element.getAttribute('data-index'));
            }
        });

        if (newCenterIndex !== centerIndex) {
            setCenterIndex(newCenterIndex);
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
                className="relative flex flex-row h-fit max-w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                onScroll={handleScroll}
                aria-label='scroller'
            >
                <div ref={centerChecker} data-testid='center-checker' className="absolute top-0 left-1/2 transform translate-x-[-50%] flex flex-row mr-4 lg:flex-none lg:basis-[calc(20%_-_16px)] md:flex-none md:basis-[calc(50%_-_15px)] md:w-1/2 sm:w-full h-40 shrink-0">
                            
                </div>
                {extendedImages.map((image, index) => {
                    const scaledHeight = Math.round((image.height / image.width) * defaultImageWidth);

                    const offset = index - centerIndex;
                    const absoluteOffset = Math.abs(offset);

                    const styles: CSSProperties = {
                        transform: `scale(${1 - 0.1 * absoluteOffset})`,
                        opacity: 1 - 0.4 * absoluteOffset,
                        zIndex: 5 - absoluteOffset,
                        transition: 'all 0.3s ease'
                    };

                    return (
                        <div key={`${image.id}-set-${index}`} data-testid={1 - 0.4 * absoluteOffset === 1 ? 'center' : 'side'} aria-label={`carousel-item-${index}`} style={styles} data-index={index} className="flex flex-row mr-4 lg:flex-none lg:basis-[calc(20%_-_16px)] md:flex-none md:basis-[calc(50%_-_15px)] md:w-1/2 sm:w-full h-50 shrink-0 snap-center">
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

export default CarouselCentral;