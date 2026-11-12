import { act, render, screen } from '@testing-library/react';
import { offset } from '@floating-ui/react-dom';
import { FloatingContent } from '..';
import { lastFloating, middleware } from '../testUtils';

describe('FloatingContent', () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement('div');
    element.innerHTML =
      '<p id="outerTarget">This is the popover <span id="target">target</span>.</p>';
    document.body.appendChild(element);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    document.body.removeChild(element);
  });

  it('should NOT render children when isOpen is false', () => {
    render(<FloatingContent target="target">Yo!</FloatingContent>);

    expect(screen.queryByText('Yo!')).not.toBeInTheDocument();
  });

  it('should render children when isOpen is true and container is inline', () => {
    render(
      <FloatingContent target="target" isOpen>
        Yo!
      </FloatingContent>,
    );

    expect(screen.queryByText('Yo!')).toBeInTheDocument();
  });

  it('should render children when isOpen is true and container is inline and DOM node passed directly for target', () => {
    const targetElement = element.querySelector('#target')!;

    render(
      <FloatingContent target={targetElement} isOpen container="inline">
        Yo!
      </FloatingContent>,
    );

    expect(screen.queryByText('Yo!')).toBeInTheDocument();
  });

  it('should render an arrow when isOpen is true and container is inline', () => {
    const { container } = render(
      <FloatingContent
        target="target"
        isOpen
        container="inline"
        arrowClassName="custom-arrow"
      >
        Yo!
      </FloatingContent>,
    );

    expect(container.querySelector('.arrow.custom-arrow')).toBeInTheDocument();
  });

  it('should NOT render an arrow when "hideArrow" is truthy', () => {
    const { container } = render(
      <FloatingContent
        target="target"
        isOpen
        container="inline"
        arrowClassName="custom-arrow"
        hideArrow
      >
        Yo!
      </FloatingContent>,
    );

    expect(
      container.querySelector('.arrow.custom-arrow'),
    ).not.toBeInTheDocument();
  });

  it('should pass additional classNames to the wrapper', () => {
    render(
      <FloatingContent
        className="extra"
        target="target"
        isOpen
        container="inline"
        data-testid="rick"
      >
        Yo!
      </FloatingContent>,
    );

    expect(screen.getByTestId('rick')).toHaveClass('extra');
  });

  it('should allow custom middleware and let it replace same-named defaults', () => {
    const shift = { name: 'shift', fn: (st: { x: number; y: number }) => st };
    const custom = { name: 'custom', fn: (st: { x: number; y: number }) => st };
    render(
      <FloatingContent
        target="target"
        isOpen
        container="inline"
        placement="top"
        middleware={[shift, custom]}
      >
        Yo!
      </FloatingContent>,
    );

    expect(lastFloating().middleware?.map((m) => m && m.name)).toEqual([
      'offset',
      'flip',
      'shift',
      'arrow',
      'custom',
    ]);
    expect(lastFloating().middleware).toContain(shift);
  });

  it('should run a custom offset in the default slot, before flip and shift', () => {
    const custom = offset(4);
    render(
      <FloatingContent
        target="target"
        isOpen
        container="inline"
        placement="top"
        middleware={[custom, false, null, undefined]}
      >
        Yo!
      </FloatingContent>,
    );

    const mw = lastFloating().middleware!;
    expect(mw.map((m) => m && m.name)).toEqual([
      'offset',
      'flip',
      'shift',
      'arrow',
    ]);
    expect(mw[0]).toBe(custom);
  });

  it('should tether shift to the target', () => {
    render(
      <FloatingContent target="target" isOpen container="inline">
        Yo!
      </FloatingContent>,
    );

    expect(middleware('shift')?.options).toMatchObject({
      limiter: { fn: expect.any(Function) },
    });
  });

  it('should position the arrow and report the computed placement', async () => {
    vi.useRealTimers();
    const { container } = render(
      <FloatingContent target="target" isOpen container="inline">
        Yo!
      </FloatingContent>,
    );

    const floating = container.querySelector('[data-popper-placement]')!;
    expect(floating).toHaveAttribute('data-popper-placement', 'auto');
    await act(async () => {});

    expect(floating.getAttribute('data-popper-placement')).toMatch(
      /^(top|right|bottom|left)$/,
    );
    const arrowStyle = (container.querySelector('.arrow') as HTMLElement).style;
    expect(arrowStyle.position).toBe('absolute');
    expect(arrowStyle.left || arrowStyle.top).toMatch(/px$/);
  });

  it('should use autoPlacement instead of flip for auto placements', () => {
    render(
      <FloatingContent
        placement="auto-start"
        target="target"
        isOpen
        container="inline"
      >
        Yo!
      </FloatingContent>,
    );

    expect(lastFloating().placement).toBeUndefined();
    expect(middleware('autoPlacement')?.options).toEqual({
      alignment: 'start',
      autoAlignment: false,
    });
    expect(middleware('flip')).toBeUndefined();
  });

  it('should not flip when flip is false', () => {
    render(
      <FloatingContent
        placement="top"
        flip={false}
        fallbackPlacements={['bottom']}
        target="target"
        isOpen
        container="inline"
      >
        Yo!
      </FloatingContent>,
    );

    expect(middleware('flip')).toBeUndefined();
  });

  it('should pass fallbackPlacements, boundary and strategy', () => {
    const boundary = document.createElement('div');
    render(
      <FloatingContent
        placement="top"
        fallbackPlacements={['bottom']}
        boundary={boundary}
        strategy="fixed"
        target="target"
        isOpen
        container="inline"
      >
        Yo!
      </FloatingContent>,
    );

    expect(middleware('flip')?.options).toEqual({
      fallbackPlacements: ['bottom'],
    });
    expect(middleware('shift')?.options).toMatchObject({ boundary });
    expect(lastFloating().strategy).toBe('fixed');
  });

  it('should have data-popper-placement of auto by default', () => {
    const { container } = render(
      <FloatingContent target="target" isOpen container="inline">
        Yo!
      </FloatingContent>,
    );

    expect(
      container.querySelector('div[data-popper-placement="auto"]'),
    ).toBeInTheDocument();
  });

  it('should override data-popper-placement', () => {
    const { container } = render(
      <FloatingContent
        placement="top"
        target="target"
        isOpen
        container="inline"
      >
        Yo!
      </FloatingContent>,
    );

    expect(
      container.querySelector('div[data-popper-placement="auto"]'),
    ).not.toBeInTheDocument();

    expect(
      container.querySelector('div[data-popper-placement="top"]'),
    ).toBeInTheDocument();
  });

  it('should allow for a placement prefix', () => {
    render(
      <FloatingContent
        placementPrefix="dropdown"
        target="target"
        isOpen
        container="inline"
      >
        Yo!
      </FloatingContent>,
    );

    expect(screen.getByText('Yo!')).toHaveClass('dropdown-auto');
  });

  it('should allow for a placement prefix with custom placement', () => {
    const { container } = render(
      <FloatingContent
        placementPrefix="dropdown"
        placement="top"
        target="target"
        isOpen
        container="inline"
      >
        Yo!
      </FloatingContent>,
    );

    expect(screen.getByText('Yo!')).toHaveClass('dropdown-auto');
    expect(
      container.querySelector('div[data-popper-placement="top"]'),
    ).toBeInTheDocument();
  });

  it('should render custom tag for the wrapper', () => {
    render(
      <FloatingContent
        tag="main"
        target="target"
        isOpen
        container="inline"
        data-testid="morty"
      >
        Yo!
      </FloatingContent>,
    );

    expect(screen.getByTestId('morty').tagName.toLowerCase()).toBe('main');
  });

  it('should allow a function to be used as children', () => {
    const renderChildren = vi.fn();
    render(
      <FloatingContent target="target" isOpen>
        {renderChildren}
      </FloatingContent>,
    );
    expect(renderChildren).toHaveBeenCalled();
  });

  it('should render children properly when children is a function', () => {
    render(
      <FloatingContent target="target" isOpen>
        {() => 'Yo!'}
      </FloatingContent>,
    );

    expect(screen.queryByText('Yo!')).toBeInTheDocument();
  });

  describe('defaultProps', () => {
    it('should default offset to 0', () => {
      render(
        <FloatingContent target="target" isOpen container="inline">
          Yo!
        </FloatingContent>,
      );

      expect(middleware('offset')?.options).toEqual(0);
    });

    it('should honor a patched FloatingContent.defaultProps.offset', () => {
      const original = FloatingContent.defaultProps.offset;
      FloatingContent.defaultProps.offset = 5;
      try {
        render(
          <FloatingContent target="target" isOpen container="inline">
            Yo!
          </FloatingContent>,
        );
        expect(middleware('offset')?.options).toEqual(5);
      } finally {
        FloatingContent.defaultProps.offset = original;
      }
    });

    it('should let an explicit offset win over defaultProps', () => {
      render(
        <FloatingContent
          target="target"
          isOpen
          container="inline"
          offset={{ mainAxis: 4, crossAxis: 3 }}
        >
          Yo!
        </FloatingContent>,
      );

      expect(middleware('offset')?.options).toEqual({
        mainAxis: 4,
        crossAxis: 3,
      });
    });
  });
});
