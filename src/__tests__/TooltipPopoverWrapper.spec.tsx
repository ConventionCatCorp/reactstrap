import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { lastFloating } from '../testUtils';
import TooltipPopoverWrapper from '../TooltipPopoverWrapper';

describe('Tooltip', () => {
  let element: HTMLDivElement;
  let container: HTMLDivElement;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    element = document.createElement('div');
    container = document.createElement('div');
    element.innerHTML =
      '<p id="target">This is the Tooltip <span id="innerTarget">target</span>.</p>';
    element.setAttribute('id', 'testContainer');
    container.setAttribute('id', 'container');
    container.setAttribute('data-testid', 'container');
    element.appendChild(container);
    document.body.appendChild(element);

    vi.useFakeTimers();
    user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    document.body.removeChild(element);
  });

  it('should render arrow by default', async () => {
    render(
      <TooltipPopoverWrapper target="target" isOpen>
        Tooltip Content
      </TooltipPopoverWrapper>,
    );

    expect(document.querySelector('.arrow')).toBeInTheDocument();
  });

  it('should render not render arrow if hiderArrow is true', async () => {
    render(
      <TooltipPopoverWrapper target="target" isOpen hideArrow>
        Tooltip Content
      </TooltipPopoverWrapper>,
    );

    expect(document.querySelector('.arrow')).not.toBeInTheDocument();
  });

  it('should not render children if isOpen is false', async () => {
    render(
      <TooltipPopoverWrapper target="target" isOpen={false}>
        Tooltip Content
      </TooltipPopoverWrapper>,
    );

    expect(screen.queryByText(/tooltip content/i)).not.toBeInTheDocument();
  });

  it('should render if isOpen is true', async () => {
    render(
      <TooltipPopoverWrapper
        target="target"
        isOpen
        className="tooltip show"
        trigger="hover"
      >
        Tooltip Content
      </TooltipPopoverWrapper>,
    );

    expect(screen.queryByText(/tooltip content/i)).toBeInTheDocument();
    expect(document.querySelector('.tooltip.show')).toBeInTheDocument();
  });

  it('should render with target object', async () => {
    render(
      <TooltipPopoverWrapper
        target={document.getElementById('target')!}
        isOpen
        className="tooltip show"
      >
        Tooltip Content
      </TooltipPopoverWrapper>,
    );

    expect(document.getElementsByClassName('tooltip show')).toHaveLength(1);
    expect(screen.queryByText(/tooltip content/i)).toBeInTheDocument();
  });

  it('should toggle isOpen', async () => {
    const { rerender } = render(
      <TooltipPopoverWrapper
        target="target"
        isOpen={false}
        className="tooltip show"
      >
        Tooltip Content
      </TooltipPopoverWrapper>,
    );

    expect(screen.queryByText(/tooltip content/i)).not.toBeInTheDocument();

    rerender(
      <TooltipPopoverWrapper target="target" isOpen className="tooltip show">
        Tooltip Content
      </TooltipPopoverWrapper>,
    );

    expect(screen.queryByText(/tooltip content/i)).toBeInTheDocument();

    rerender(
      <TooltipPopoverWrapper
        target="target"
        isOpen={false}
        className="tooltip show"
      >
        Tooltip Content
      </TooltipPopoverWrapper>,
    );

    act(() => vi.advanceTimersByTime(150));
    expect(screen.queryByText(/tooltip content/i)).not.toBeInTheDocument();
  });

  it('should handle target clicks', async () => {
    const toggle = vi.fn();
    const { rerender } = render(
      <TooltipPopoverWrapper target="target" isOpen={false} toggle={toggle}>
        Tooltip Content
      </TooltipPopoverWrapper>,
    );

    await user.click(screen.getByText(/this is the Tooltip/i));
    act(() => vi.advanceTimersByTime(150));
    expect(toggle).toHaveBeenCalled();
    toggle.mockClear();

    rerender(
      <TooltipPopoverWrapper target="target" isOpen toggle={toggle}>
        Tooltip Content
      </TooltipPopoverWrapper>,
    );

    await user.click(screen.getByText(/this is the Tooltip/i));
    act(() => vi.advanceTimersByTime(150));
    expect(toggle).toHaveBeenCalled();
  });

  it('should handle inner target clicks', async () => {
    const toggle = vi.fn();
    render(
      <TooltipPopoverWrapper target="target" isOpen={false} toggle={toggle}>
        Tooltip Content
      </TooltipPopoverWrapper>,
    );

    await user.click(screen.getByText(/target/i));
    act(() => vi.advanceTimersByTime(150));
    expect(toggle).toHaveBeenCalled();
  });

  it('should not do anything when document click outside of target', async () => {
    const toggle = vi.fn();
    render(
      <TooltipPopoverWrapper target="target" isOpen={false} toggle={toggle}>
        Tooltip Content
      </TooltipPopoverWrapper>,
    );

    await user.click(screen.getByTestId('container'));
    expect(toggle).not.toHaveBeenCalled();
  });

  it('should open after receiving single touchstart and single click', async () => {
    const toggle = vi.fn();
    render(
      <TooltipPopoverWrapper
        target="target"
        isOpen={false}
        toggle={toggle}
        trigger="click"
      >
        Tooltip Content
      </TooltipPopoverWrapper>,
    );

    await user.click(screen.getByText(/target/i));
    act(() => vi.advanceTimersByTime(200));

    expect(toggle).toHaveBeenCalled();

    // TODO: RTL currently doesn't support touch events
  });

  it('should close after receiving single touchstart and single click', async () => {
    const toggle = vi.fn();
    render(
      <TooltipPopoverWrapper
        target="target"
        isOpen
        toggle={toggle}
        trigger="click"
      >
        Tooltip Content
      </TooltipPopoverWrapper>,
    );

    await user.click(screen.getByText(/target/i));
    act(() => vi.advanceTimersByTime(200));

    expect(toggle).toHaveBeenCalled();

    // TODO: RTL currently doesn't support touch events
  });

  it('should pass down custom middleware, replacing same-named defaults', async () => {
    const offset = { name: 'offset', fn: (s: { x: number; y: number }) => s };
    const custom = { name: 'custom', fn: (s: { x: number; y: number }) => s };
    render(
      <TooltipPopoverWrapper
        isOpen
        target="target"
        placement="top"
        middleware={[offset, custom]}
      >
        Tooltip Content
      </TooltipPopoverWrapper>,
    );

    const mw = lastFloating().middleware!;
    expect(mw.filter((m) => m && m.name === 'offset')).toEqual([offset]);
    expect(mw).toContain(custom);
    expect(mw.map((m) => m && m.name)).toEqual(
      expect.arrayContaining(['flip', 'shift']),
    );
  });

  describe('FloatingContent', () => {
    const FloatingContent = vi.fn((props: any) =>
      props.children({ update: () => {} }),
    );
    let Wrapper: typeof TooltipPopoverWrapper;

    beforeEach(async () => {
      vi.resetModules();
      vi.doMock('../FloatingContent', () => ({ default: FloatingContent }));
      Wrapper = (await import('../TooltipPopoverWrapper')).default;
    });

    afterEach(() => {
      vi.doUnmock('../FloatingContent');
    });

    it('should pass down cssModule', async () => {
      const cssModule = {
        a: 'b',
      };

      render(
        <Wrapper isOpen target="target" cssModule={cssModule}>
          Tooltip Content
        </Wrapper>,
      );

      expect(FloatingContent).toHaveBeenCalledTimes(1);

      expect(FloatingContent.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          cssModule: expect.objectContaining({
            a: 'b',
          }),
        }),
      );
    });

    it('should pass down offset', async () => {
      render(
        <Wrapper isOpen target="target" offset={12}>
          Tooltip content
        </Wrapper>,
      );

      expect(FloatingContent).toHaveBeenCalledTimes(1);
      expect(FloatingContent.mock.calls[0][0].offset).toBe(12);
    });

    it('should not inject an offset when none is passed', async () => {
      render(
        <Wrapper isOpen target="target">
          Tooltip content
        </Wrapper>,
      );

      expect(FloatingContent).toHaveBeenCalledTimes(1);
      expect(FloatingContent.mock.calls[0][0].offset).toBeUndefined();
    });

    it('should pass down flip', async () => {
      render(
        <Wrapper isOpen target="target" flip={false}>
          Tooltip Content
        </Wrapper>,
      );

      expect(FloatingContent).toHaveBeenCalledTimes(1);
      expect(FloatingContent.mock.calls[0][0].flip).toBe(false);
    });

    it('should handle inner target click and correct placement', async () => {
      const toggle = vi.fn();

      const { rerender } = render(
        <Wrapper target="target" isOpen={false} toggle={toggle}>
          Tooltip Content
        </Wrapper>,
      );

      await user.click(screen.getByText(/target/i));
      act(() => vi.advanceTimersByTime(200));
      expect(toggle).toHaveBeenCalled();

      rerender(
        <Wrapper target="target" isOpen toggle={toggle}>
          Tooltip Content
        </Wrapper>,
      );

      expect(FloatingContent.mock.calls[0][0].target.id).toBe('target');
    });
  });

  it('should not call props.toggle when disabled', async () => {
    const toggle = vi.fn();

    render(
      <TooltipPopoverWrapper target="target" disabled isOpen toggle={toggle}>
        Tooltip Content
      </TooltipPopoverWrapper>,
    );

    await user.click(screen.getByText(/target/i));

    expect(toggle).not.toHaveBeenCalled();
  });

  it('should not throw when props.toggle is not provided', async () => {
    render(
      <TooltipPopoverWrapper target="target" disabled isOpen>
        Tooltip Content
      </TooltipPopoverWrapper>,
    );

    await expect(
      user.click(screen.getByText(/target/i)),
    ).resolves.toBeUndefined();
  });

  it('should not throw when passed a ref object as the target', async () => {
    const targetObj = createRef<any>();

    targetObj.current = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    const { unmount } = render(
      <TooltipPopoverWrapper isOpen={false} target={targetObj}>
        Yo!
      </TooltipPopoverWrapper>,
    );

    unmount();

    expect(targetObj.current.addEventListener).toHaveBeenCalled();
    expect(targetObj.current.removeEventListener).toHaveBeenCalled();
  });

  describe('multi target', () => {
    let targets: NodeListOf<HTMLElement>;
    let targetContainer: HTMLDivElement;
    beforeEach(() => {
      targetContainer = document.createElement('div');
      targetContainer.innerHTML =
        "<span class='example first'>Target 1</span><span class='example second'>Target 2<span class='inner_example'>Inner target</span></span>";
      element.appendChild(targetContainer);
      targets = targetContainer.querySelectorAll('.example');
    });

    afterEach(() => {
      element.removeChild(targetContainer);
    });

    it('should attach tooltip on multiple target when a target selector matches multiple elements', async () => {
      const toggle = vi.fn();
      render(
        <TooltipPopoverWrapper
          target=".example"
          isOpen={false}
          toggle={toggle}
          delay={0}
        >
          Yo!
        </TooltipPopoverWrapper>,
      );

      await user.click(targets[0]);
      act(() => vi.advanceTimersByTime(200));
      expect(toggle).toHaveBeenCalledTimes(1);

      await user.click(targets[1]);
      act(() => vi.advanceTimersByTime(200));
      expect(toggle).toHaveBeenCalledTimes(2);
    });

    it('should attach tooltip on second target with correct placement, when inner element is clicked', async () => {
      const toggle = vi.fn();
      render(
        <TooltipPopoverWrapper
          target=".example"
          isOpen={false}
          toggle={toggle}
          delay={0}
        >
          Yo!
        </TooltipPopoverWrapper>,
      );

      await user.click(targets[0]);
      act(() => vi.advanceTimersByTime(200));
      expect(toggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('delay', () => {
    it('should accept a number', async () => {
      const toggle = vi.fn();
      render(
        <TooltipPopoverWrapper
          target="target"
          isOpen
          toggle={toggle}
          delay={200}
        >
          Tooltip Content
        </TooltipPopoverWrapper>,
      );

      await user.click(screen.getByText(/target/i));

      act(() => vi.advanceTimersByTime(100));
      expect(toggle).not.toHaveBeenCalled();
      act(() => vi.advanceTimersByTime(100));
      expect(toggle).toHaveBeenCalled();
    });

    it('should accept an object', async () => {
      const toggle = vi.fn();
      render(
        <TooltipPopoverWrapper
          target="target"
          isOpen
          toggle={toggle}
          delay={{ show: 400, hide: 400 }}
        >
          Tooltip Content
        </TooltipPopoverWrapper>,
      );

      await user.click(screen.getByText(/target/i));

      act(() => vi.advanceTimersByTime(200));
      expect(toggle).not.toHaveBeenCalled();
      act(() => vi.advanceTimersByTime(200));
      expect(toggle).toHaveBeenCalled();
    });

    it('should use default value if value is missing from object', async () => {
      const toggle = vi.fn();
      render(
        <TooltipPopoverWrapper
          target="target"
          isOpen
          toggle={toggle}
          delay={{ show: 0 }}
        >
          Tooltip Content
        </TooltipPopoverWrapper>,
      );

      await user.click(screen.getByText(/target/i));

      act(() => vi.advanceTimersByTime(10));
      expect(toggle).not.toHaveBeenCalled();
      act(() => vi.advanceTimersByTime(40)); // default hide value is 50
      expect(toggle).toHaveBeenCalled();
    });
  });

  describe('hide', () => {
    it('should call toggle when isOpen', async () => {
      const toggle = vi.fn();
      render(
        <TooltipPopoverWrapper target="target" isOpen toggle={toggle}>
          Tooltip Content
        </TooltipPopoverWrapper>,
      );

      await user.click(screen.getByText(/target/i));

      act(() => vi.advanceTimersByTime(200));
      expect(toggle).toHaveBeenCalled();
    });
  });

  describe('show', () => {
    it('should call toggle when isOpen', async () => {
      const toggle = vi.fn();
      render(
        <TooltipPopoverWrapper target="target" isOpen={false} toggle={toggle}>
          Tooltip Content
        </TooltipPopoverWrapper>,
      );

      await user.click(screen.getByText(/target/i));

      act(() => vi.advanceTimersByTime(200));
      expect(toggle).toHaveBeenCalled();
    });
  });

  describe('onMouseOverTooltip', () => {
    it('should clear timeout if it exists on target click', async () => {
      const toggle = vi.fn();
      const { rerender } = render(
        <TooltipPopoverWrapper
          target="target"
          isOpen={false}
          toggle={toggle}
          delay={200}
          trigger="hover"
        >
          Tooltip Content
        </TooltipPopoverWrapper>,
      );

      await user.hover(screen.getByText(/target/i));

      rerender(
        <TooltipPopoverWrapper
          target="target"
          isOpen
          toggle={toggle}
          delay={200}
          trigger="hover"
        >
          Tooltip Content
        </TooltipPopoverWrapper>,
      );

      await user.unhover(screen.getByText(/target/i));

      act(() => vi.advanceTimersByTime(200));
      expect(toggle).toHaveBeenCalledTimes(1);
    });

    it('should not call .toggle if isOpen', async () => {
      const toggle = vi.fn();
      render(
        <TooltipPopoverWrapper
          target="target"
          isOpen
          toggle={toggle}
          delay={200}
          trigger="hover"
        >
          Tooltip Content
        </TooltipPopoverWrapper>,
      );

      await user.hover(screen.getByText(/target/i));
      act(() => vi.advanceTimersByTime(200));
      expect(toggle).not.toHaveBeenCalled();
    });
  });

  describe('onMouseLeaveTooltip', () => {
    it('should clear timeout if it exists on target click', async () => {
      const toggle = vi.fn();
      const { rerender } = render(
        <TooltipPopoverWrapper
          target="target"
          isOpen
          toggle={toggle}
          delay={200}
          trigger="hover"
        >
          Tooltip Content
        </TooltipPopoverWrapper>,
      );

      // user-event 14 only fires mouseout if the pointer is over the element.
      await user.hover(screen.getByText(/target/i));
      await user.unhover(screen.getByText(/target/i));

      rerender(
        <TooltipPopoverWrapper
          target="target"
          isOpen={false}
          toggle={toggle}
          delay={200}
          trigger="hover"
        >
          Tooltip Content
        </TooltipPopoverWrapper>,
      );

      await user.hover(screen.getByText(/target/i));

      act(() => vi.advanceTimersByTime(200));
      expect(toggle).toHaveBeenCalledTimes(1);
    });

    it('should not call .toggle if isOpen is false', async () => {
      const toggle = vi.fn();
      render(
        <TooltipPopoverWrapper
          target="target"
          isOpen={false}
          toggle={toggle}
          delay={200}
          trigger="hover"
        >
          Tooltip Content
        </TooltipPopoverWrapper>,
      );

      // user-event 14 only fires mouseout if the pointer is over the element.
      await user.hover(screen.getByText(/target/i));
      await user.unhover(screen.getByText(/target/i));
      act(() => vi.advanceTimersByTime(200));
      expect(toggle).not.toHaveBeenCalled();
    });
  });

  describe('autohide', () => {
    it('should keep Tooltip around when false and onmouseleave from Tooltip content', async () => {
      const toggle = vi.fn();
      render(
        <TooltipPopoverWrapper
          trigger="hover"
          target="target"
          autohide={false}
          isOpen
          toggle={toggle}
          delay={200}
        >
          Tooltip Content
        </TooltipPopoverWrapper>,
      );

      await user.hover(screen.getByText(/tooltip content/i));
      act(() => vi.advanceTimersByTime(200));
      expect(toggle).not.toHaveBeenCalled();
      await user.unhover(screen.getByText(/tooltip content/i));
      act(() => vi.advanceTimersByTime(200));
      expect(toggle).toHaveBeenCalled();
    });

    it('clears showTimeout and hideTimeout in onMouseLeaveTooltipContent', async () => {
      const toggle = vi.fn();
      render(
        <TooltipPopoverWrapper
          trigger="hover"
          target="target"
          autohide={false}
          isOpen
          toggle={toggle}
          delay={200}
        >
          Tooltip Content
        </TooltipPopoverWrapper>,
      );

      // user-event 14 only fires mouseout if the pointer is over the element.
      await user.hover(screen.getByText(/tooltip content/i));
      await user.unhover(screen.getByText(/tooltip content/i));
      await user.hover(screen.getByText(/tooltip content/i));
      await user.unhover(screen.getByText(/tooltip content/i));

      act(() => vi.advanceTimersByTime(200));

      expect(toggle).toHaveBeenCalledTimes(1);
    });

    it('should not keep Tooltip around when autohide is true and Tooltip content is hovered over', async () => {
      const toggle = vi.fn();
      render(
        <TooltipPopoverWrapper
          target="target"
          autohide
          isOpen
          toggle={toggle}
          delay={200}
          trigger="click hover focus"
        >
          Tooltip Content
        </TooltipPopoverWrapper>,
      );

      // Pointer moves from the target onto the content (user-event 14 needs a real path).
      await user.hover(screen.getByText(/target/i));
      await user.hover(screen.getByText(/tooltip content/i));

      act(() => vi.advanceTimersByTime(200));

      expect(toggle).toHaveBeenCalled();
    });

    it('should allow a function to be used as children', async () => {
      const renderChildren = vi.fn();
      render(
        <TooltipPopoverWrapper target="target" isOpen>
          {renderChildren}
        </TooltipPopoverWrapper>,
      );
      expect(renderChildren).toHaveBeenCalled();
    });

    it('should render children properly when children is a function', async () => {
      render(
        <TooltipPopoverWrapper
          target="target"
          isOpen
          className="tooltip show"
          trigger="hover"
        >
          {() => 'Tooltip Content'}
        </TooltipPopoverWrapper>,
      );

      expect(screen.getByText(/tooltip content/i)).toBeInTheDocument();
    });
  });
});
