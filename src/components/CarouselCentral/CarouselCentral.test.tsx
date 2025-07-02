import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';

import CarouselCentral from "./CarouselCentral";
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
    render(<CarouselCentral images={mockData} defaultImageWidth={DEFAULT_WIDTH} />);
});

describe('Central Carousel', () => {
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

    it('updates centerIndex when scrolled', async () => {
        const scroller = screen.getByLabelText('scroller'); // you may need to add aria-label
        const centerChecker = screen.getByTestId('center-checker'); // temporarily add data-testid for easier targeting

        Object.defineProperty(scroller, 'scrollLeft', {
            configurable: true,
            get: () => 300,
        });

        Object.defineProperty(scroller, 'offsetWidth', {
            configurable: true,
            get: () => 600,
        });

        Object.defineProperty(scroller, 'scrollWidth', {
            configurable: true,
            get: () => 2000,
        });

        vi.spyOn(centerChecker, 'getBoundingClientRect').mockReturnValue({
            left: 300,
            right: 500,
            top: 0,
            bottom: 0,
            width: 200,
            height: 0,
            x: 300,
            y: 0,
            toJSON: () => {},
        });

        const items: HTMLElement[] = [];
        for (let i = 0; i < 7; i++) {
            items.push(screen.getByLabelText(`carousel-item-${i}`))
        }
        items.forEach((el, i) => {
            vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
                left: i * 200,
                right: i * 200 + 200,
                top: 0,
                bottom: 0,
                width: 200,
                height: 0,
                x: i * 200,
                y: 0,
                toJSON: () => {},
            });
        });


        fireEvent.scroll(scroller);

        const imageToBeCentered = screen.getByTestId('center');
        expect(imageToBeCentered).toHaveStyle('opacity: 1');
    });
});