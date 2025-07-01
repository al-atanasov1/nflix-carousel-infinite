import { useEffect, useRef, useState } from "react";
import { type PicsumImage } from "../../services/picsum.service";
import { motion } from 'framer-motion';

type SimpleCarouselProps = {
    images: PicsumImage[];
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    defaultImageWidth: number;
}

function CarouselSimple({ images, page, setPage, defaultImageWidth }: SimpleCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const [targetNode, setTargetNode] = useState<HTMLDivElement | null>(null);

    const observeRef = (node: HTMLDivElement | null) => {
        setTargetNode(node);
    };

    useEffect(() => {
        if (!targetNode || !scrollRef.current) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                console.log("CarouselSimple: fetching page ", page + 1);
                setPage((prev) => prev + 1);
            }
        },
        {
            root: scrollRef.current,
            threshold: 0.8,
        });

        observerRef.current.observe(targetNode);

        return () => {
            if (observerRef.current && targetNode) {
                observerRef.current.unobserve(targetNode);
            }
        };

        // eslint-disable-next-line
    }, [targetNode, setPage]);

    return (
        <motion.div 
            className="flex flex-col w-full h-fit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <div
                className="flex flex-row h-fit w-full max-w-full overflow-x-auto"
                ref={scrollRef}
            >
                {images.map((image, index) => {
                    const scaledHeight = Math.round((image.height / image.width) * defaultImageWidth);
                    const fetcher = index === images.length - 3;
                    return (
                        <div key={`${image.id}-simple`} className="flex flex-row mr-4 lg:flex-none lg:basis-[calc(25%_-_16px)] md:flex-none md:basis-[calc(50%_-_15px)] md:w-1/2 sm:w-full h-50 shrink-0">
                            <div ref={fetcher ? observeRef : null} className="relative flex flex-col justify-end w-full h-full p-4 shrink-0 rounded-2xl bg-cover bg-center group" style={{backgroundImage: `url(https://picsum.photos/id/${image.id}/${defaultImageWidth}/${scaledHeight})`}}>
                                <div className="absolute inset-0 bg-black/50 rounded-2xl transition-all z-0 group-hover:bg-black/80" />
                                <p className="text-3xl transition-all z-1 group-hover:transform group-hover:translate-y-[-75%]">{image.title}</p>
                                <p className="absolute left-4 bottom-4 text-xl opacity-0 transition-all z-1 group-hover:opacity-70">{image.author}</p>
                            </div>
                            {index === images.length - 1 && <div className="flex flex-col justify-end w-full h-50 ml-4 bg-gray-300 opacity-0 shrink-0 rounded-2xl animate-[PlaceholderPulse_2s_ease_infinite]"></div>}
                        </div>  
                        );
                })}
            </div>
        </motion.div>
    );
}

export default CarouselSimple;