import {
  cloneElement,
  Component,
  isValidElement,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type TouchEvent,
} from 'react';
import classNames from 'classnames';
import CarouselItem, { type CarouselItemProps } from './CarouselItem';
import type { CarouselIndicatorsProps } from './CarouselIndicators';
import { CarouselContext } from './CarouselContext';
import { mapToCssModules, omit, type CSSModule } from './utils';

const SWIPE_THRESHOLD = 40;

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  /** the current active slide of the carousel */
  activeIndex?: number;
  /** a function which should advance the carousel to the next slide (via activeIndex) */
  next: () => void;
  /** a function which should advance the carousel to the previous slide (via activeIndex) */
  previous: () => void;
  /** controls if the left and right arrow keys should control the carousel */
  keyboard?: boolean;
  /** If set to "hover", pauses the cycling of the carousel on mouseenter and resumes the cycling of the carousel on
   * mouseleave. If set to false, hovering over the carousel won't pause it.
   */
  pause?: 'hover' | false;
  /** Autoplays the carousel after the user manually cycles the first item. If "carousel", autoplays the carousel on load. */
  ride?: 'carousel';
  /** the interval at which the carousel automatically cycles */
  interval?: number | string | boolean;
  /**
   * Either `CarouselItem`s only, or `[items, prevControl, nextControl]`,
   * or `[indicators, items, prevControl, nextControl]`.
   */
  children?: ReactNode[];
  /** called when the mouse enters the Carousel */
  mouseEnter?: (e: MouseEvent<HTMLDivElement>) => void;
  /** called when the mouse exits the Carousel */
  mouseLeave?: (e: MouseEvent<HTMLDivElement>) => void;
  /** controls whether the slide animation on the Carousel works or not */
  slide?: boolean;
  /** make the controls, indicators and captions dark on the Carousel */
  dark?: boolean;
  /** crossfade slides instead of sliding */
  fade?: boolean;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  /** Add custom class */
  className?: string;
  /** Enable touch support */
  enableTouch?: boolean;
}

interface CarouselState {
  activeIndex?: number;
  direction: 'start' | 'end';
  indicatorClicked: boolean;
}

const propsToOmit = [
  'activeIndex',
  'next',
  'previous',
  'keyboard',
  'pause',
  'ride',
  'interval',
  'children',
  'mouseEnter',
  'mouseLeave',
  'slide',
  'dark',
  'fade',
  'cssModule',
  'className',
  'enableTouch',
] as const;

class Carousel extends Component<CarouselProps, CarouselState> {
  override state: CarouselState = {
    activeIndex: this.props.activeIndex,
    direction: 'end',
    indicatorClicked: false,
  };

  private touchStartX = 0;
  private touchStartY = 0;
  private cycleInterval?: ReturnType<typeof setInterval>;

  override componentDidMount() {
    // Set up the cycle
    if (this.props.ride === 'carousel') {
      this.setInterval();
    }

    // TODO: move this to the specific carousel like bootstrap. Currently it will trigger ALL carousels on the page.
    document.addEventListener('keyup', this.handleKeyPress);
  }

  static getDerivedStateFromProps(
    nextProps: CarouselProps,
    prevState: CarouselState,
  ): Partial<CarouselState> | null {
    const { activeIndex, indicatorClicked } = prevState;
    const next = nextProps.activeIndex;
    if (next === activeIndex) return null;

    // Calculate the direction to turn
    const prev = activeIndex as number;
    let direction: CarouselState['direction'];
    if (next === prev + 1) {
      direction = 'end';
    } else if (next === prev - 1) {
      direction = 'start';
    } else if ((next as number) < prev) {
      direction = indicatorClicked ? 'start' : 'end';
    } else {
      direction = indicatorClicked ? 'end' : 'start';
    }

    return { activeIndex: next, direction, indicatorClicked: false };
  }

  override componentDidUpdate(
    _prevProps: CarouselProps,
    prevState: CarouselState,
  ) {
    if (prevState.activeIndex === this.state.activeIndex) return;
    this.setInterval();
  }

  override componentWillUnmount() {
    this.clearInterval();
    document.removeEventListener('keyup', this.handleKeyPress);
  }

  handleKeyPress = (evt: KeyboardEvent) => {
    const { keyboard = true } = this.props;
    if (!keyboard) return;
    if (evt.keyCode === 37) {
      this.props.previous();
    } else if (evt.keyCode === 39) {
      this.props.next();
    }
  };

  handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const { enableTouch = true } = this.props;
    if (!enableTouch) return;
    this.touchStartX = e.changedTouches[0].screenX;
    this.touchStartY = e.changedTouches[0].screenY;
  };

  handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const { enableTouch = true } = this.props;
    if (!enableTouch) return;

    const currentX = e.changedTouches[0].screenX;
    const currentY = e.changedTouches[0].screenY;
    const diffX = Math.abs(this.touchStartX - currentX);
    const diffY = Math.abs(this.touchStartY - currentY);

    // Don't swipe if Y-movement is bigger than X-movement
    if (diffX < diffY || diffX < SWIPE_THRESHOLD) return;

    if (currentX < this.touchStartX) {
      this.props.next();
    } else {
      this.props.previous();
    }
  };

  getContextValue() {
    return { direction: this.state.direction };
  }

  setInterval() {
    // make sure not to have multiple intervals going...
    this.clearInterval();
    const { interval = 5000 } = this.props;
    if (interval) {
      this.cycleInterval = setInterval(
        () => this.props.next(),
        parseInt(String(interval), 10),
      );
    }
  }

  clearInterval() {
    clearInterval(this.cycleInterval);
  }

  hoverStart = (e: MouseEvent<HTMLDivElement>) => {
    const { pause = 'hover', mouseEnter } = this.props;
    if (pause === 'hover') this.clearInterval();
    mouseEnter?.(e);
  };

  hoverEnd = (e: MouseEvent<HTMLDivElement>) => {
    const { pause = 'hover', mouseLeave } = this.props;
    if (pause === 'hover') this.setInterval();
    mouseLeave?.(e);
  };

  renderItems(carouselItems: ReactNode, className: string) {
    const { slide = true } = this.props;
    return (
      <div className={className}>
        {(carouselItems as ReactElement<CarouselItemProps>[]).map(
          (item, index) =>
            cloneElement(item, {
              in: index === this.state.activeIndex,
              slide,
            }),
        )}
      </div>
    );
  }

  override render() {
    const {
      cssModule,
      slide = true,
      className,
      dark,
      fade = false,
    } = this.props;
    const attributes = omit(this.props, propsToOmit);
    const outerClasses = mapToCssModules(
      classNames(
        className,
        'carousel',
        fade && 'carousel-fade',
        slide && 'slide',
        dark && 'carousel-dark',
      ),
      cssModule,
    );
    const innerClasses = mapToCssModules('carousel-inner', cssModule);

    // filter out booleans, null, or undefined
    const children = (this.props.children ?? []).filter(
      (child) =>
        child !== null && child !== undefined && typeof child !== 'boolean',
    );

    const slidesOnly = children.every(
      (child) => isValidElement(child) && child.type === CarouselItem,
    );
    // Children are either `[items, prev, next]` or `[indicators, items, prev, next]`
    const withIndicators = !slidesOnly && !Array.isArray(children[0]);

    let indicators: ReactNode = null;
    if (withIndicators) {
      const el = children[0] as ReactElement<CarouselIndicatorsProps>;
      indicators = cloneElement(el, {
        onClickHandler: (idx: number) => {
          if (typeof el.props.onClickHandler === 'function') {
            this.setState({ indicatorClicked: true }, () =>
              el.props.onClickHandler(idx),
            );
          }
        },
      });
    }

    const [carouselItems, controlLeft, controlRight] = slidesOnly
      ? [children]
      : children.slice(withIndicators ? 1 : 0);

    return (
      <div
        {...attributes}
        className={outerClasses}
        onMouseEnter={this.hoverStart}
        onMouseLeave={this.hoverEnd}
        {...(withIndicators && {
          onTouchStart: this.handleTouchStart,
          onTouchEnd: this.handleTouchEnd,
        })}
      >
        <CarouselContext.Provider value={this.getContextValue()}>
          {indicators}
          {this.renderItems(carouselItems, innerClasses)}
          {controlLeft}
          {controlRight}
        </CarouselContext.Provider>
      </div>
    );
  }
}

export default Carousel;
