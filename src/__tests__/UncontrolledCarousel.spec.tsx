import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UncontrolledCarousel from '../UncontrolledCarousel';

const items = [
  {
    src: '',
    altText: 'a',
    caption: 'caption 1',
    key: '1',
  },
  {
    src: '',
    altText: 'b',
    caption: 'caption 2',
    key: '2',
  },
  {
    src: '',
    altText: 'c',
    caption: 'caption 3',
    key: '3',
  },
];

describe('UncontrolledCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  const setupUser = () =>
    userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  it('should have active element default to 0', () => {
    render(<UncontrolledCarousel items={items} />);
    expect(screen.getByAltText('a').parentElement).toHaveClass('active');
  });

  it('should autoplay by default', () => {
    render(<UncontrolledCarousel items={items} />);
    expect(screen.getByAltText('a').parentElement).toHaveClass('active');
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByAltText('b').parentElement).toHaveClass(
      'carousel-item carousel-item-start carousel-item-next',
    );
    act(() => vi.advanceTimersByTime(600));
    expect(screen.getByAltText('b').parentElement).toHaveClass('active');
  });

  it('should not play automatically when autoPlay is false', () => {
    render(<UncontrolledCarousel items={items} autoPlay={false} />);
    expect(screen.getByAltText('a').parentElement).toHaveClass('active');
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByAltText('b').parentElement).not.toHaveClass(
      'carousel-item carousel-item-start carousel-item-next',
    );
    act(() => vi.advanceTimersByTime(600));
    expect(screen.getByAltText('b').parentElement).not.toHaveClass('active');
  });

  it('should move to next slide when next button is clicked', async () => {
    const user = setupUser();
    render(<UncontrolledCarousel items={items} autoPlay={false} />);
    await user.click(screen.getByText(/next/i));
    act(() => vi.advanceTimersByTime(600));
    expect(screen.getByAltText('b').parentElement).toHaveClass(
      'carousel-item active',
    );
  });

  it('should not move to next slide while animating', async () => {
    const user = setupUser();
    render(<UncontrolledCarousel items={items} />);
    await user.click(screen.getByText(/next/i));
    expect(screen.getByAltText('b').parentElement).toHaveClass(
      'carousel-item carousel-item-start carousel-item-next',
    );
    await user.click(screen.getByText(/next/i));
    expect(screen.getByAltText('c').parentElement).not.toHaveClass(
      'carousel-item carousel-item-start carousel-item-next',
    );
  });

  it('should wrap to first slide on reaching the end', async () => {
    const user = setupUser();
    render(<UncontrolledCarousel items={items} autoPlay={false} />);
    await user.click(screen.getByText(/next/i));
    act(() => vi.advanceTimersByTime(600));
    expect(screen.getByAltText('b').parentElement).toHaveClass('active');

    await user.click(screen.getByText(/next/i));
    act(() => vi.advanceTimersByTime(600));
    expect(screen.getByAltText('c').parentElement).toHaveClass('active');

    await user.click(screen.getByText(/next/i));
    act(() => vi.advanceTimersByTime(600));
    expect(screen.getByAltText('a').parentElement).toHaveClass('active');
  });

  it('should move to previous slide when previous button is clicked', async () => {
    const user = setupUser();
    render(<UncontrolledCarousel items={items} autoPlay={false} />);
    await user.click(screen.getByText(/next/i));
    act(() => vi.advanceTimersByTime(600));
    expect(screen.getByAltText('b').parentElement).toHaveClass(
      'carousel-item active',
    );

    await user.click(screen.getByText(/previous/i));
    act(() => vi.advanceTimersByTime(600));
    expect(screen.getByAltText('a').parentElement).toHaveClass(
      'carousel-item active',
    );
  });

  it('should not move to previous slide while animating', async () => {
    const user = setupUser();
    render(<UncontrolledCarousel items={items} />);
    await user.click(screen.getByText(/next/i));
    expect(screen.getByAltText('b').parentElement).toHaveClass(
      'carousel-item carousel-item-start carousel-item-next',
    );
    await user.click(screen.getByText(/previous/i));
    expect(screen.getByAltText('a').parentElement).not.toHaveClass(
      'carousel-item carousel-item-start carousel-item-next',
    );
  });

  it('should wrap to last slide on reaching the beginning', async () => {
    const user = setupUser();
    render(<UncontrolledCarousel items={items} autoPlay={false} />);
    await user.click(screen.getByText(/previous/i));
    act(() => vi.advanceTimersByTime(600));
    expect(screen.getByAltText('c').parentElement).toHaveClass('active');
  });
});
