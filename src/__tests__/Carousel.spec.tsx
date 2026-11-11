import { StrictMode, type ReactNode } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Carousel from '../Carousel';
import CarouselItem from '../CarouselItem';
import CarouselIndicators from '../CarouselIndicators';
import CarouselControl from '../CarouselControl';
import CarouselCaption from '../CarouselCaption';
import { CarouselContext } from '../CarouselContext';

const DEFAULT_TIMER_TIME = 600;

describe('Carousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  const setupUser = () =>
    userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  const items = [
    { src: '', altText: 'a', caption: 'caption 1' },
    { src: '', altText: 'b', caption: 'caption 2' },
    { src: '', altText: 'c', caption: 'caption 3' },
  ];

  const slides = items.map((item, idx) => {
    return (
      <CarouselItem key={idx}>
        <CarouselCaption
          captionText={item.caption}
          captionHeader={item.caption}
        />
      </CarouselItem>
    );
  });

  describe('captions', () => {
    it('should render a header and a caption', () => {
      render(<CarouselCaption captionHeader="abc" captionText="def" />);
      expect(screen.getByText('abc').tagName.toLowerCase()).toBe('h3');
      expect(screen.getByText('def').tagName.toLowerCase()).toBe('p');
    });
  });

  describe('items', () => {
    it('should render custom tag', () => {
      render(<CarouselItem tag="main">Hello</CarouselItem>);
      expect(screen.getByText(/hello/i).tagName.toLowerCase()).toBe('main');
    });

    it('should render an image if one is passed in', () => {
      render(
        <CarouselItem>
          <img src={items[0].src} alt={items[0].altText} />
        </CarouselItem>,
      );
      expect(screen.getByAltText(items[0].altText)).toBeInTheDocument();
    });

    it('should render a caption if one is passed in', () => {
      render(
        <CarouselItem>
          <CarouselCaption captionHeader="header" captionText="text" />
        </CarouselItem>,
      );
      expect(screen.getByText('header')).toBeInTheDocument();
      expect(screen.getByText('text')).toBeInTheDocument();
    });

    describe('transitions', () => {
      it('should add the appropriate classes when entering right', () => {
        const wrapper = ({ children }: { children: ReactNode }) => (
          <CarouselContext.Provider value={{ direction: 'end' }}>
            {children}
          </CarouselContext.Provider>
        );

        const { rerender } = render(
          <CarouselItem in={false}>the mandalorian</CarouselItem>,
          { wrapper },
        );
        rerender(<CarouselItem in>the mandalorian</CarouselItem>);
        expect(screen.getByText(/the mandalorian/i)).toHaveClass(
          'carousel-item carousel-item-start carousel-item-next',
        );
        act(() => vi.advanceTimersByTime(DEFAULT_TIMER_TIME));
        expect(screen.getByText(/the mandalorian/i)).toHaveClass(
          'carousel-item active',
        );
        rerender(<CarouselItem in={false}>the mandalorian</CarouselItem>);
        expect(screen.getByText(/the mandalorian/i)).toHaveClass(
          'carousel-item active carousel-item-start',
        );
        act(() => vi.advanceTimersByTime(DEFAULT_TIMER_TIME));
        expect(screen.getByText(/the mandalorian/i)).toHaveClass(
          'carousel-item',
        );
      });

      it('should add the appropriate classes when entering left', () => {
        const wrapper = ({ children }: { children: ReactNode }) => (
          <CarouselContext.Provider value={{ direction: 'start' }}>
            {children}
          </CarouselContext.Provider>
        );

        const { rerender } = render(
          <CarouselItem in={false}>the mandalorian</CarouselItem>,
          { wrapper },
        );
        rerender(<CarouselItem in>the mandalorian</CarouselItem>);
        expect(screen.getByText(/the mandalorian/i)).toHaveClass(
          'carousel-item carousel-item-end carousel-item-prev',
        );
        act(() => vi.advanceTimersByTime(DEFAULT_TIMER_TIME));
        expect(screen.getByText(/the mandalorian/i)).toHaveClass(
          'carousel-item active',
        );
        rerender(<CarouselItem in={false}>the mandalorian</CarouselItem>);
        expect(screen.getByText(/the mandalorian/i)).toHaveClass(
          'carousel-item active carousel-item-end',
        );
        act(() => vi.advanceTimersByTime(DEFAULT_TIMER_TIME));
        expect(screen.getByText(/the mandalorian/i)).toHaveClass(
          'carousel-item',
        );
      });

      it('should call all callbacks when transitioning in and out', () => {
        const callbacks = {
          onEnter: vi.fn(),
          onEntering: vi.fn(),
          onEntered: vi.fn(),
          onExit: vi.fn(),
          onExiting: vi.fn(),
          onExited: vi.fn(),
        };
        const { rerender } = render(<CarouselItem in={false} {...callbacks} />);
        rerender(<CarouselItem in {...callbacks} />);
        expect(callbacks.onEnter).toHaveBeenCalled();
        expect(callbacks.onEntering).toHaveBeenCalled();
        expect(callbacks.onEntered).not.toHaveBeenCalled();
        act(() => vi.advanceTimersByTime(DEFAULT_TIMER_TIME));
        expect(callbacks.onEntered).toHaveBeenCalled();
        expect(callbacks.onExit).not.toHaveBeenCalled();

        rerender(<CarouselItem in={false} {...callbacks} />);
        expect(callbacks.onExit).toHaveBeenCalled();
        expect(callbacks.onExiting).toHaveBeenCalled();
        expect(callbacks.onExited).not.toHaveBeenCalled();
        act(() => vi.advanceTimersByTime(DEFAULT_TIMER_TIME));
        expect(callbacks.onExiting).toHaveBeenCalled();
        expect(callbacks.onExited).toHaveBeenCalled();
      });

      it('should transition on React 19 without findDOMNode', () => {
        const spy = vi.spyOn(console, 'error');
        const onEntered = vi.fn();
        const onExited = vi.fn();
        const ui = (isIn: boolean) => (
          <StrictMode>
            <CarouselItem in={isIn} onEntered={onEntered} onExited={onExited}>
              grogu
            </CarouselItem>
          </StrictMode>
        );
        const { rerender } = render(ui(false));
        const node = screen.getByText('grogu');
        const slide = vi.fn();
        const slid = vi.fn();
        node.addEventListener('slide.bs.carousel', slide);
        node.addEventListener('slid.bs.carousel', slid);

        rerender(ui(true));
        act(() => vi.advanceTimersByTime(DEFAULT_TIMER_TIME));
        expect(onEntered).toHaveBeenCalledWith(node, false);
        expect(node).toHaveClass('carousel-item active');

        rerender(ui(false));
        expect(slide).toHaveBeenCalledTimes(1);
        act(() => vi.advanceTimersByTime(DEFAULT_TIMER_TIME));
        expect(onExited).toHaveBeenCalledWith(node);
        expect(slid).toHaveBeenCalledTimes(1);
        expect(node).not.toHaveClass('active');
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
      });
    });
  });

  describe('indicators', () => {
    it('should render a list with the right number of items', () => {
      render(
        <CarouselIndicators
          items={items}
          activeIndex={0}
          onClickHandler={() => {}}
        />,
      );
      expect(screen.getAllByLabelText(/caption/i).length).toBe(3);
    });

    it('should append the correct active class', () => {
      render(
        <CarouselIndicators
          items={items}
          activeIndex={0}
          onClickHandler={() => {}}
        />,
      );
      expect(screen.getByLabelText(/caption 1/i)).toHaveClass('active');
    });

    it('should call the click hanlder', async () => {
      const user = setupUser();
      const onClick = vi.fn();
      render(
        <CarouselIndicators
          items={items}
          activeIndex={0}
          onClickHandler={onClick}
        />,
      );
      await user.click(screen.getByLabelText(/caption 1/i));
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('controls', () => {
    it('should render an anchor tag', () => {
      render(<CarouselControl direction="next" onClickHandler={() => {}} />);
      expect(screen.getByRole('button').tagName.toLowerCase()).toBe('a');
    });

    it('should call the onClickHandler', async () => {
      const user = setupUser();
      const onClick = vi.fn();
      render(<CarouselControl direction="next" onClickHandler={onClick} />);
      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('rendering', () => {
    it('should show the carousel indicators', () => {
      render(
        <Carousel activeIndex={0} next={() => {}} previous={() => {}}>
          <CarouselIndicators
            items={items}
            data-testid="c3po"
            activeIndex={0}
            onClickHandler={() => {}}
          />
          {slides}
        </Carousel>,
      );
      expect(screen.getByTestId('c3po')).toHaveClass('carousel-indicators');
    });

    it('should show controls', () => {
      render(
        <Carousel activeIndex={0} next={() => {}} previous={() => {}}>
          {slides}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={() => {}}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={() => {}}
          />
        </Carousel>,
      );
      screen.getAllByRole('button').forEach((element) => {
        expect(element.className).toMatch(/carousel-control/i);
      });
    });

    it('should show a single slide', () => {
      render(
        <Carousel
          activeIndex={0}
          next={() => {}}
          previous={() => {}}
          data-testid="carousel"
        >
          {slides}
        </Carousel>,
      );
      expect(
        screen.getByTestId('carousel').getElementsByClassName('active').length,
      ).toBe(1);
    });

    it('should show indicators and controls', () => {
      render(
        <Carousel activeIndex={0} next={() => {}} previous={() => {}}>
          <CarouselIndicators
            items={items}
            data-testid="carousel-indicator"
            activeIndex={0}
            onClickHandler={() => {}}
          />
          {slides}
          <CarouselControl
            direction="prev"
            data-testid="prev"
            directionText="Previous"
            onClickHandler={() => {}}
          />
          <CarouselControl
            direction="next"
            data-testid="next"
            directionText="Next"
            onClickHandler={() => {}}
          />
        </Carousel>,
      );

      expect(screen.getByTestId('carousel-indicator')).toBeInTheDocument();
      expect(screen.getByTestId('prev')).toBeInTheDocument();
      expect(screen.getByTestId('next')).toBeInTheDocument();
    });

    it('should tolerate booleans, null and undefined values rendered as children of Carousel', () => {
      render(
        <Carousel activeIndex={0} next={() => {}} previous={() => {}}>
          {null}
          {true}
          {false}
          {undefined}
          {(() => {})()}
          <CarouselIndicators
            items={items}
            data-testid="carousel-indicator"
            activeIndex={0}
            onClickHandler={() => {}}
          />
          {slides}
          <CarouselControl
            direction="prev"
            data-testid="prev"
            directionText="Previous"
            onClickHandler={() => {}}
          />
          <CarouselControl
            direction="next"
            data-testid="next"
            directionText="Next"
            onClickHandler={() => {}}
          />
        </Carousel>,
      );

      expect(screen.getByTestId('carousel-indicator')).toBeInTheDocument();
      expect(screen.getByTestId('prev')).toBeInTheDocument();
      expect(screen.getByTestId('next')).toBeInTheDocument();
    });

    it('should not have the class "carousel-dark" by default', () => {
      render(
        <Carousel
          data-testid="star-wars"
          activeIndex={0}
          next={() => {}}
          previous={() => {}}
        >
          {slides}
        </Carousel>,
      );

      expect(screen.getByTestId('star-wars')).not.toHaveClass('carousel-dark');
    });

    it('should have the class "carousel-dark" when dark prop is true', () => {
      render(
        <Carousel
          data-testid="star-wars"
          dark
          activeIndex={0}
          next={() => {}}
          previous={() => {}}
        >
          {slides}
        </Carousel>,
      );

      expect(screen.getByTestId('star-wars')).toHaveClass('carousel-dark');
    });
  });

  describe('carouseling', () => {
    const carouselItems = [
      { src: '', altText: 'a', caption: 'Grogu' },
      { src: '', altText: 'b', caption: 'Boba Fett' },
      { src: '', altText: 'c', caption: 'The Mandalorian' },
    ];

    const carouselSlides = carouselItems.map((item, idx) => {
      return <CarouselItem key={idx}>{item.caption}</CarouselItem>;
    });

    it('should set second slide to active if second indicator clicked', async () => {
      const user = setupUser();
      const { rerender } = render(
        <Carousel activeIndex={0} next={() => {}} previous={() => {}}>
          <CarouselIndicators
            items={carouselItems}
            data-testid="boba-fett"
            activeIndex={0}
            onClickHandler={() => function () {}}
          />
          {carouselSlides}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={() => {}}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={() => {}}
          />
        </Carousel>,
      );

      await user.click(screen.getByLabelText(/boba fett/i));

      rerender(
        <Carousel activeIndex={1} next={() => {}} previous={() => {}}>
          <CarouselIndicators
            items={carouselItems}
            data-testid="boba-fett"
            activeIndex={1}
            onClickHandler={() => function () {}}
          />
          {carouselSlides}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={() => {}}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={() => {}}
          />
        </Carousel>,
      );

      expect(screen.getByText(/boba fett/i)).toHaveClass(
        'carousel-item carousel-item-start carousel-item-next',
      );
      act(() => vi.advanceTimersByTime(DEFAULT_TIMER_TIME));
      expect(screen.getByText(/boba fett/i)).toHaveClass(
        'carousel-item active',
      );
    });

    it('should go right when the index increases', () => {
      const { rerender } = render(
        <Carousel
          interval={1000}
          activeIndex={0}
          next={() => {}}
          previous={() => {}}
        >
          {carouselSlides}
        </Carousel>,
      );

      rerender(
        <Carousel
          interval={1000}
          activeIndex={1}
          next={() => {}}
          previous={() => {}}
        >
          {carouselSlides}
        </Carousel>,
      );
      expect(screen.getByText(/boba fett/i)).toHaveClass(
        'carousel-item carousel-item-start carousel-item-next',
      );
      act(() => vi.advanceTimersByTime(DEFAULT_TIMER_TIME));
      expect(screen.getByText(/boba fett/i)).toHaveClass('active');
    });

    it('should go left when the index decreases', () => {
      const { rerender } = render(
        <Carousel
          interval={1000}
          activeIndex={1}
          next={() => {}}
          previous={() => {}}
        >
          {carouselSlides}
        </Carousel>,
      );

      rerender(
        <Carousel
          interval={1000}
          activeIndex={0}
          next={() => {}}
          previous={() => {}}
        >
          {carouselSlides}
        </Carousel>,
      );
      expect(screen.getByText(/grogu/i)).toHaveClass(
        'carousel-item carousel-item-prev carousel-item-end',
      );
      act(() => vi.advanceTimersByTime(DEFAULT_TIMER_TIME));
      expect(screen.getByText(/grogu/i)).toHaveClass('active');
    });

    it('should go right if transitioning from the last to first slide by non-indicator', () => {
      const { rerender } = render(
        <Carousel
          interval={1000}
          activeIndex={2}
          next={() => {}}
          previous={() => {}}
        >
          {carouselSlides}
        </Carousel>,
      );

      rerender(
        <Carousel
          interval={1000}
          activeIndex={0}
          next={() => {}}
          previous={() => {}}
        >
          {carouselSlides}
        </Carousel>,
      );
      expect(screen.getByText(/grogu/i)).toHaveClass(
        'carousel-item carousel-item-start carousel-item-next',
      );
      act(() => vi.advanceTimersByTime(DEFAULT_TIMER_TIME));
      expect(screen.getByText(/grogu/i)).toHaveClass('active');
    });

    it('should go left if transitioning from the last to first slide by indicator', async () => {
      const user = setupUser();
      const { rerender } = render(
        <Carousel
          interval={1000}
          activeIndex={2}
          next={() => {}}
          previous={() => {}}
        >
          <CarouselIndicators
            items={carouselItems}
            activeIndex={2}
            onClickHandler={() => {}}
          />
          {carouselSlides}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={() => {}}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={() => {}}
          />
        </Carousel>,
      );

      await user.click(screen.getByLabelText(/grogu/i));

      rerender(
        <Carousel
          interval={1000}
          activeIndex={0}
          next={() => {}}
          previous={() => {}}
        >
          <CarouselIndicators
            items={carouselItems}
            activeIndex={0}
            onClickHandler={() => {}}
          />
          {carouselSlides}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={() => {}}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={() => {}}
          />
        </Carousel>,
      );

      expect(screen.getByText(/grogu/i)).toHaveClass(
        'carousel-item carousel-item-end carousel-item-prev',
      );
    });

    it('should go left if transitioning from the first to last slide by non-indicator', () => {
      const { rerender } = render(
        <Carousel
          interval={1000}
          activeIndex={0}
          next={() => {}}
          previous={() => {}}
        >
          {carouselSlides}
        </Carousel>,
      );

      rerender(
        <Carousel
          interval={1000}
          activeIndex={2}
          next={() => {}}
          previous={() => {}}
        >
          {carouselSlides}
        </Carousel>,
      );

      expect(screen.getByText(/the mandalorian/i)).toHaveClass(
        'carousel-item carousel-item-end carousel-item-prev',
      );
      act(() => vi.advanceTimersByTime(DEFAULT_TIMER_TIME));
      expect(screen.getByText(/the mandalorian/i)).toHaveClass('active');
    });

    it('should go right if transitioning from the first to last slide by indicator', async () => {
      const user = setupUser();
      const { rerender } = render(
        <Carousel
          interval={1000}
          activeIndex={0}
          next={() => {}}
          previous={() => {}}
        >
          <CarouselIndicators
            items={carouselItems}
            activeIndex={0}
            onClickHandler={() => {}}
          />
          {carouselSlides}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={() => {}}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={() => {}}
          />
        </Carousel>,
      );

      await user.click(screen.getByLabelText(/the mandalorian/i));

      rerender(
        <Carousel
          interval={1000}
          activeIndex={2}
          next={() => {}}
          previous={() => {}}
        >
          <CarouselIndicators
            items={carouselItems}
            activeIndex={2}
            onClickHandler={() => {}}
          />
          {carouselSlides}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={() => {}}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={() => {}}
          />
        </Carousel>,
      );

      expect(screen.getByText(/the mandalorian/i)).toHaveClass(
        'carousel-item carousel-item-start carousel-item-next',
      );
      act(() => vi.advanceTimersByTime(DEFAULT_TIMER_TIME));
      expect(screen.getByText(/the mandalorian/i)).toHaveClass('active');
    });
  });

  describe('interval', () => {
    it('should not autoplay by default', () => {
      const next = vi.fn();
      render(
        <Carousel
          next={next}
          previous={() => {}}
          interval={1000}
          activeIndex={0}
        >
          {slides}
        </Carousel>,
      );
      act(() => vi.advanceTimersByTime(1000));
      expect(next).not.toHaveBeenCalled();
    });

    it('should autoplay when ride is carousel', () => {
      const next = vi.fn();
      render(
        <Carousel
          next={next}
          previous={() => {}}
          interval={1000}
          activeIndex={0}
          ride="carousel"
        >
          {slides}
        </Carousel>,
      );
      act(() => vi.advanceTimersByTime(1000));
      expect(next).toHaveBeenCalled();
    });

    it('should accept a number', () => {
      const next = vi.fn();
      render(
        <Carousel
          next={next}
          previous={() => {}}
          interval={1000}
          activeIndex={0}
          ride="carousel"
        >
          {slides}
        </Carousel>,
      );
      act(() => vi.advanceTimersByTime(1000));
      expect(next).toHaveBeenCalled();
    });

    it('should accept a boolean', () => {
      const next = vi.fn();
      render(
        <Carousel
          next={next}
          previous={() => {}}
          activeIndex={0}
          interval={false}
        >
          {slides}
        </Carousel>,
      );
      act(() => vi.advanceTimersByTime(5000));
      expect(next).not.toHaveBeenCalled();
    });

    it('should default to 5000', () => {
      const next = vi.fn();
      render(
        <Carousel
          next={next}
          previous={() => {}}
          activeIndex={0}
          ride="carousel"
        >
          {slides}
        </Carousel>,
      );
      act(() => vi.advanceTimersByTime(5000));
      expect(next).toHaveBeenCalled();
    });

    it('should accept a string', () => {
      const next = vi.fn();
      render(
        <Carousel
          next={next}
          previous={() => {}}
          interval="1000"
          activeIndex={0}
          ride="carousel"
        >
          {slides}
        </Carousel>,
      );
      act(() => vi.advanceTimersByTime(1000));
      expect(next).toHaveBeenCalled();
    });
  });
});
