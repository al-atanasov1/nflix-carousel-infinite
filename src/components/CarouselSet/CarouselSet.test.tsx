import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';

import CarouselSet from "./CarouselSet";
import type { PicsumImage } from "../../services/picsum.service";

const mockData: PicsumImage[] = [
    { id: '2', author: 'Pesho', height: 300, width: 500, url: 'https://picsum.photos/id/2/600/400', download_url: 'https://picsum.photos/id/2/600/400', title: 'Snimkata na pesho' },
    { id: '4', author: 'Minka', height: 100, width: 600, url: 'https://picsum.photos/id/4/600/400', download_url: 'https://picsum.photos/id/4/600/400', title: 'Snimkata na minka' },
    { id: '6', author: 'Gosho', height: 200, width: 400, url: 'https://picsum.photos/id/6/600/400', download_url: 'https://picsum.photos/id/6/600/400', title: 'Snimkata na gosho' },
    { id: '8', author: 'Stancho', height: 200, width: 400, url: 'https://picsum.photos/id/8/600/400', download_url: 'https://picsum.photos/id/8/600/400', title: 'Snimkata na stancho' },
    { id: '10', author: 'Subka', height: 200, width: 400, url: 'https://picsum.photos/id/10/600/400', download_url: 'https://picsum.photos/id/10/600/400', title: 'Snimkata na subka' },
    { id: '12', author: 'Bulgar', height: 200, width: 400, url: 'https://picsum.photos/id/12/600/400', download_url: 'https://picsum.photos/id/12/600/400', title: 'Snimkata na bulgar' },
    { id: '14', author: 'Vanko', height: 200, width: 400, url: 'https://picsum.photos/id/14/600/400', download_url: 'https://picsum.photos/id/14/600/400', title: 'Snimkata na vanko' }
];

const DEFAULT_WIDTH = 600;

beforeEach(() => {
    render(<CarouselSet images={mockData} defaultImageWidth={DEFAULT_WIDTH} />);
});

describe('Set Carousel', () => {
    // it('render component', () => {
    //     screen.debug();
    // });

    it('renders image authors and duplicates the first ones', () => {
        expect(screen.getAllByText('Pesho')).toHaveLength(2);
        expect(screen.getAllByText('Minka')).toHaveLength(2);
        expect(screen.getAllByText('Gosho')).toHaveLength(2);
        expect(screen.getAllByText('Stancho')).toHaveLength(2);
        expect(screen.getAllByText('Subka')).toHaveLength(2);

        expect(screen.getByText('Bulgar')).toBeInTheDocument();
        expect(screen.getByText('Vanko')).toBeInTheDocument();
    });

    it('renders image titles and duplicates the first ones', () => {
        expect(screen.getAllByText('Snimkata na pesho')).toHaveLength(2);
        expect(screen.getAllByText('Snimkata na minka')).toHaveLength(2);
        expect(screen.getAllByText('Snimkata na gosho')).toHaveLength(2);
        expect(screen.getAllByText('Snimkata na stancho')).toHaveLength(2);
        expect(screen.getAllByText('Snimkata na subka')).toHaveLength(2);
        
        expect(screen.getByText('Snimkata na bulgar')).toBeInTheDocument();
        expect(screen.getByText('Snimkata na vanko')).toBeInTheDocument();
    });

    it('loops at the end', async () => {
        const scroller = screen.getByLabelText('scroller');

        let scrollLeftValue = 300;

        Object.defineProperty(scroller, 'scrollLeft', {
            configurable: true,
            get: () => scrollLeftValue,
            set: (value) => scrollLeftValue = value,
        });

        Object.defineProperty(scroller, 'offsetWidth', {
            configurable: true,
            get: () => 600,
        });

        Object.defineProperty(scroller, 'scrollWidth', {
            configurable: true,
            get: () => 2000,
        });

        expect(scroller.scrollLeft).toBe(300);

        scroller.scrollTo = vi.fn(({ left }) => {
            scrollLeftValue = left;
        });

        scroller.scrollLeft = 1400;
        expect(scroller.scrollLeft).toBe(1400);

        fireEvent.scroll(scroller);

        expect(scroller.scrollLeft).toBe(0);
    });
});