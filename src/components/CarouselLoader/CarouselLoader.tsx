import { motion } from 'framer-motion';

function CarouselLoader() {
    return (
        <motion.div 
            className="relative flex flex-col w-full h-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className='h-full w-full bg-gray-300 opacity-0 rounded-2xl animate-[PlaceholderPulse_2s_ease_infinite]'></div>
        </motion.div>
    );
}

export default CarouselLoader;