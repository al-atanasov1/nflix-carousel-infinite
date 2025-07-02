import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';

import CarouselSimple from "./CarouselSimple";
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

let mockPage = 1;
const mockSetPage = vi.fn((newValue) => {
    if (typeof newValue === 'function') {
        mockPage = newValue(mockPage);
    } else {
        mockPage = newValue;
    }
});

const DEFAULT_WIDTH = 600;

// eslint-disable-next-line
let mockObserverCallback: Function = () => {};

class MockIntersectionObserver {
    // eslint-disable-next-line
    constructor(callback: Function) {
        mockObserverCallback = callback;
    }

    observe = vi.fn((element) => {
        mockObserverCallback([{ isIntersecting: true, target: element }]);
    });

    root = null;
    rootMargin = '';
    thresholds = [];
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
}

global.IntersectionObserver = MockIntersectionObserver;

beforeEach(() => {
    render(<CarouselSimple images={mockData} page={mockPage} setPage={mockSetPage as React.Dispatch<React.SetStateAction<number>>} defaultImageWidth={DEFAULT_WIDTH}/>);
    mockSetPage.mockClear();
    mockPage = 1;
});

describe('Simple Carousel', () => {
    // it('render component', () => {
    //     screen.debug();
    // });

    it('renders image authors', () => {
        expect(screen.getByText('Pesho')).toBeInTheDocument();
        expect(screen.getByText('Minka')).toBeInTheDocument();
        expect(screen.getByText('Gosho')).toBeInTheDocument();
        expect(screen.getByText('Stancho')).toBeInTheDocument();
        expect(screen.getByText('Subka')).toBeInTheDocument();
        expect(screen.getByText('Bulgar')).toBeInTheDocument();
        expect(screen.getByText('Vanko')).toBeInTheDocument();
    });

    it('renders image titles', () => {
        expect(screen.getByText('Snimkata na pesho')).toBeInTheDocument();
        expect(screen.getByText('Snimkata na minka')).toBeInTheDocument();
        expect(screen.getByText('Snimkata na gosho')).toBeInTheDocument();
        expect(screen.getByText('Snimkata na stancho')).toBeInTheDocument();
        expect(screen.getByText('Snimkata na subka')).toBeInTheDocument();
        expect(screen.getByText('Snimkata na bulgar')).toBeInTheDocument();
        expect(screen.getByText('Snimkata na vanko')).toBeInTheDocument();
    });

    it('renders placeholder at the end of the carousel', () => {
        const scroller = screen.getByLabelText('scroller');
        const placeholder = scroller.lastElementChild?.lastElementChild;

        expect(placeholder).toBeInTheDocument();
        expect(placeholder).toBe(screen.getByLabelText('placeholder'));
    });

    it('scroller can be horizontally scrolled and calls setPage at the end of scrolling', () => {
        const fetcher = screen.getByTestId('fetcher');

        mockObserverCallback([{ isIntersecting: true, target: fetcher }]);
        mockObserverCallback([{ isIntersecting: true, target: fetcher }]);

        expect(mockSetPage).toHaveBeenCalledTimes(2);
        expect(mockPage).toBe(3);
    });
})