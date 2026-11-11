import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Offcanvas, OffcanvasBody, OffcanvasHeader, Button } from '..';
import { testForCustomClass } from '../testUtils';

describe('Offcanvas', () => {
  const toggle = () => {};
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    document.body.removeAttribute('style');
  });

  it('should render offcanvas portal into DOM', () => {
    render(
      <Offcanvas isOpen toggle={toggle}>
        Yo!
      </Offcanvas>,
    );

    act(() => vi.advanceTimersByTime(300));

    expect(screen.getByText(/yo/i)).toBeInTheDocument();
  });

  it('should forward innerRef to the offcanvas element', () => {
    const ref = { current: null as HTMLElement | null };
    render(
      <Offcanvas isOpen innerRef={ref}>
        Yo!
      </Offcanvas>,
    );
    expect(ref.current).toBe(screen.getByText(/yo/i));
  });

  it('should render with the class "offcanvas"', () => {
    render(
      <Offcanvas isOpen toggle={toggle}>
        Yo!
      </Offcanvas>,
    );

    expect(screen.getByText(/yo/i)).toHaveClass('offcanvas');
  });

  it('should render with the backdrop with the class "offcanvas-backdrop" by default', () => {
    render(
      <Offcanvas isOpen toggle={toggle}>
        Yo!
      </Offcanvas>,
    );

    expect(document.getElementsByClassName('offcanvas-backdrop')).toHaveLength(
      1,
    );
  });

  it('should not render with the backdrop with the class "offcanvas-backdrop" when backdrop is "false"', () => {
    render(
      <Offcanvas isOpen toggle={toggle} backdrop={false}>
        Yo!
      </Offcanvas>,
    );

    expect(document.getElementsByClassName('offcanvas').length).toBe(1);
    expect(document.getElementsByClassName('offcanvas-backdrop').length).toBe(
      0,
    );
  });

  it('should have custom class name if provided', () => {
    testForCustomClass(Offcanvas, { isOpen: true, toggle });
  });

  it('should render with additional props if provided', () => {
    render(
      <Offcanvas isOpen toggle={toggle} style={{ maxWidth: '95%' }}>
        Yo!
      </Offcanvas>,
    );

    expect(
      document.querySelector<HTMLElement>('.offcanvas')!.style.maxWidth,
    ).toBe('95%');
  });

  it('should render without fade transition if provided with fade={false}', () => {
    render(
      <Offcanvas
        isOpen
        toggle={toggle}
        fade={false}
        className="fadeless-offcanvas"
      >
        Howdy!
      </Offcanvas>,
    );

    expect(
      document.getElementsByClassName('fadeless-offcanvas')[0],
    ).not.toHaveClass('fade');
  });

  it('should render when expected when passed offcanvasTransition and backdropTransition props', () => {
    render(
      <Offcanvas
        isOpen
        toggle={toggle}
        offcanvasTransition={{ timeout: 2 }}
        backdropTransition={{ timeout: 10 }}
        className="custom-timeout-offcanvas"
      >
        Hello, world!
      </Offcanvas>,
    );

    expect(
      document.getElementsByClassName('custom-timeout-offcanvas')[0],
    ).toHaveClass('fade');
    expect(
      document.getElementsByClassName('custom-timeout-offcanvas')[0],
    ).not.toHaveClass('show');
    expect(
      document.getElementsByClassName('offcanvas-backdrop')[0],
    ).not.toHaveClass('show');

    act(() => vi.advanceTimersByTime(20));
    expect(
      document.getElementsByClassName('custom-timeout-offcanvas')[0],
    ).toHaveClass('show');
    expect(
      document.getElementsByClassName('offcanvas-backdrop')[0],
    ).toHaveClass('show');
  });

  it('should render with class "offcanvas-backdrop" and have custom class name if provided with backdropClassName', () => {
    render(
      <Offcanvas isOpen toggle={toggle} backdropClassName="my-custom-offcanvas">
        Yo!
      </Offcanvas>,
    );

    expect(
      document.getElementsByClassName(
        'offcanvas-backdrop my-custom-offcanvas',
      )[0],
    ).toBeInTheDocument();
  });

  it('should render with the class "offcanvas-${direction}" when direction is passed', () => {
    render(
      <Offcanvas isOpen toggle={toggle} direction="top">
        Yo!
      </Offcanvas>,
    );

    expect(screen.getByText(/yo/i)).toHaveClass('offcanvas-top');
  });

  it('should render offcanvas when isOpen is true', () => {
    render(
      <Offcanvas isOpen toggle={toggle}>
        Yo!
      </Offcanvas>,
    );

    expect(screen.getByText(/yo/i)).toHaveClass('offcanvas');
    expect(document.getElementsByClassName('offcanvas-backdrop').length).toBe(
      1,
    );
  });

  it('should render offcanvas with default role of "dialog"', () => {
    render(
      <Offcanvas isOpen toggle={toggle}>
        Yo!
      </Offcanvas>,
    );
    expect(screen.getByText(/yo/i).getAttribute('role')).toBe('dialog');
  });

  it('should render offcanvas with provided role', () => {
    render(
      <Offcanvas isOpen toggle={toggle} role="alert">
        Yo!
      </Offcanvas>,
    );

    expect(screen.getByText(/yo/i).getAttribute('role')).toBe('alert');
  });

  it('should render offcanvas with aria-labelledby provided labelledBy', () => {
    render(
      <Offcanvas isOpen toggle={toggle} labelledBy="myOffcanvasTitle">
        Yo!
      </Offcanvas>,
    );

    expect(screen.getByText(/yo/i).getAttribute('aria-labelledby')).toBe(
      'myOffcanvasTitle',
    );
  });

  it('should not render offcanvas when isOpen is false', () => {
    render(
      <Offcanvas isOpen={false} toggle={toggle}>
        Yo!
      </Offcanvas>,
    );

    expect(screen.queryByText(/yo/i)).not.toBeInTheDocument();
  });

  it('should toggle offcanvas', () => {
    const { rerender } = render(
      <Offcanvas isOpen={false} toggle={toggle}>
        Yo!
      </Offcanvas>,
    );

    expect(screen.queryByText(/yo/i)).not.toBeInTheDocument();

    rerender(
      <Offcanvas isOpen toggle={toggle}>
        Yo!
      </Offcanvas>,
    );

    expect(screen.queryByText(/yo/i)).toBeInTheDocument();

    rerender(
      <Offcanvas isOpen toggle={toggle}>
        Yo!
      </Offcanvas>,
    );

    expect(screen.queryByText(/yo/i)).toBeInTheDocument();
  });

  it('should call onClosed & onOpened', () => {
    const onOpened = vi.fn();
    const onClosed = vi.fn();
    const { rerender } = render(
      <Offcanvas
        isOpen={false}
        onOpened={onOpened}
        onClosed={onClosed}
        toggle={toggle}
      >
        Yo!
      </Offcanvas>,
    );

    expect(onOpened).not.toHaveBeenCalled();
    expect(onClosed).not.toHaveBeenCalled();

    rerender(
      <Offcanvas isOpen onOpened={onOpened} onClosed={onClosed} toggle={toggle}>
        Yo!
      </Offcanvas>,
    );

    act(() => vi.advanceTimersByTime(300));

    expect(onOpened).toHaveBeenCalledTimes(1);
    expect(onClosed).not.toHaveBeenCalled();

    onOpened.mockClear();
    onClosed.mockClear();

    rerender(
      <Offcanvas
        isOpen={false}
        onOpened={onOpened}
        onClosed={onClosed}
        toggle={toggle}
      >
        Yo!
      </Offcanvas>,
    );

    act(() => vi.advanceTimersByTime(300));

    expect(onClosed).toHaveBeenCalledTimes(1);
    expect(onOpened).not.toHaveBeenCalled();
  });

  it('should call onClosed & onOpened when fade={false}', () => {
    const onOpened = vi.fn();
    const onClosed = vi.fn();
    const { rerender } = render(
      <Offcanvas
        isOpen={false}
        onOpened={onOpened}
        onClosed={onClosed}
        toggle={toggle}
        fade={false}
      >
        Yo!
      </Offcanvas>,
    );

    expect(onOpened).not.toHaveBeenCalled();
    expect(onClosed).not.toHaveBeenCalled();

    rerender(
      <Offcanvas
        isOpen
        onOpened={onOpened}
        onClosed={onClosed}
        toggle={toggle}
        fade={false}
      >
        Yo!
      </Offcanvas>,
    );

    act(() => vi.advanceTimersByTime(300));

    expect(onOpened).toHaveBeenCalledTimes(1);
    expect(onClosed).not.toHaveBeenCalled();

    onOpened.mockClear();
    onClosed.mockClear();

    rerender(
      <Offcanvas
        isOpen={false}
        onOpened={onOpened}
        onClosed={onClosed}
        toggle={toggle}
        fade={false}
      >
        Yo!
      </Offcanvas>,
    );

    act(() => vi.advanceTimersByTime(300));

    expect(onClosed).toHaveBeenCalledTimes(1);
    expect(onOpened).not.toHaveBeenCalled();
  });

  it('should call toggle when escape key pressed', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const toggleMock = vi.fn();
    render(
      <Offcanvas isOpen toggle={toggleMock}>
        Yo!
      </Offcanvas>,
    );

    await user.keyboard('{Escape}');
    expect(toggleMock).toHaveBeenCalled();
  });

  it('should not call toggle when escape key pressed when keyboard is false', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const toggleMock = vi.fn();
    render(
      <Offcanvas isOpen toggle={toggleMock} keyboard={false}>
        Yo!
      </Offcanvas>,
    );

    await user.keyboard('{Escape}');
    expect(toggleMock).not.toHaveBeenCalled();
  });

  it('should call toggle when clicking backdrop', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const toggleMock = vi.fn();
    render(
      <Offcanvas isOpen toggle={toggleMock}>
        <button id="clicker">Does Nothing</button>
      </Offcanvas>,
    );

    await user.click(screen.getByText(/does nothing/i));

    expect(toggleMock).not.toHaveBeenCalled();

    await user.click(document.getElementsByClassName('offcanvas-backdrop')[0]);

    expect(toggleMock).toHaveBeenCalled();
  });

  it('should call toggle when clicking backdrop when fade is false', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const toggleMock = vi.fn();
    render(
      <Offcanvas isOpen toggle={toggleMock} fade={false}>
        <button id="clicker">Does Nothing</button>
      </Offcanvas>,
    );

    await user.click(screen.getByText(/does nothing/i));

    expect(toggleMock).not.toHaveBeenCalled();

    await user.click(document.getElementsByClassName('offcanvas-backdrop')[0]);

    expect(toggleMock).toHaveBeenCalled();
  });

  it('should destroy this._element', () => {
    const { rerender } = render(
      <Offcanvas isOpen toggle={toggle}>
        thor and dr.johns
      </Offcanvas>,
    );

    const element = screen.getByText(/thor and dr.johns/i);
    expect(element).toBeInTheDocument();

    rerender(
      <Offcanvas isOpen={false} toggle={toggle}>
        thor and dr.johns
      </Offcanvas>,
    );
    act(() => vi.advanceTimersByTime(300));
    expect(element).not.toBeInTheDocument();
  });

  it('should destroy this._element when unmountOnClose prop set to true', () => {
    const { rerender } = render(
      <Offcanvas isOpen toggle={toggle} unmountOnClose>
        thor and dr.johns
      </Offcanvas>,
    );

    const element = screen.getByText(/thor and dr.johns/i);
    expect(element).toBeInTheDocument();

    rerender(
      <Offcanvas isOpen={false} toggle={toggle} unmountOnClose>
        thor and dr.johns
      </Offcanvas>,
    );
    act(() => vi.advanceTimersByTime(300));
    expect(element).not.toBeInTheDocument();
  });

  it('should not destroy this._element when unmountOnClose prop set to false', () => {
    const { rerender } = render(
      <Offcanvas isOpen toggle={toggle} unmountOnClose={false}>
        thor and dr.johns
      </Offcanvas>,
    );

    const element = screen.getByText(/thor and dr.johns/i);
    expect(element).toBeInTheDocument();

    rerender(
      <Offcanvas isOpen={false} toggle={toggle} unmountOnClose={false}>
        thor and dr.johns
      </Offcanvas>,
    );
    act(() => vi.advanceTimersByTime(300));
    expect(element).toBeInTheDocument();
  });

  it('should destroy this._element on unmount', () => {
    const { unmount } = render(
      <Offcanvas isOpen toggle={toggle}>
        thor and dr.johns
      </Offcanvas>,
    );

    const element = screen.getByText(/thor and dr.johns/i);
    expect(element).toBeInTheDocument();

    unmount();
    act(() => vi.advanceTimersByTime(300));
    expect(element).not.toBeInTheDocument();
  });

  it('should remove exactly visibility styles from body', () => {
    // set a body class which includes offcanvas-open
    document.body.style.background = 'blue';

    const { rerender } = render(
      <Offcanvas isOpen={false} toggle={toggle}>
        Yo!
      </Offcanvas>,
    );

    // assert that the offcanvas is closed and the body class is what was set initially
    act(() => vi.advanceTimersByTime(300));
    expect(document.body.style.background).toBe('blue');
    expect(document.body.style.overflow).toBe('');

    rerender(
      <Offcanvas isOpen toggle={toggle}>
        Yo!
      </Offcanvas>,
    );

    // assert that the offcanvas is open and the body class is what was set initially + offcanvas-open
    act(() => vi.advanceTimersByTime(300));
    expect(document.body.style.background).toBe('blue');
    expect(document.body.style.overflow).toBe('hidden');

    // append another body class which includes offcanvas-open
    // using this to test if replace will leave a space when removing offcanvas-open
    document.body.style.color = 'red';
    expect(document.body.style.background).toBe('blue');
    expect(document.body.style.color).toBe('red');
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Offcanvas isOpen={false} toggle={toggle}>
        Yo!
      </Offcanvas>,
    );

    // assert that the offcanvas is closed and the body class is what was set initially
    act(() => vi.advanceTimersByTime(301));
    expect(document.body.style.background).toBe('blue');
    expect(document.body.style.color).toBe('red');
    expect(document.body.style.overflow).toBe('');
  });

  it('should call onEnter & onExit props if provided', () => {
    const onEnter = vi.fn();
    const onExit = vi.fn();
    const { rerender, unmount } = render(
      <Offcanvas
        isOpen={false}
        onEnter={onEnter}
        onExit={onExit}
        toggle={toggle}
      >
        Yo!
      </Offcanvas>,
    );

    expect(onEnter).toHaveBeenCalled();
    expect(onExit).not.toHaveBeenCalled();

    onEnter.mockReset();
    onExit.mockReset();

    rerender(
      <Offcanvas isOpen onEnter={onEnter} onExit={onExit} toggle={toggle}>
        Yo!
      </Offcanvas>,
    );
    act(() => vi.advanceTimersByTime(300));

    expect(onEnter).not.toHaveBeenCalled();
    expect(onExit).not.toHaveBeenCalled();

    onEnter.mockReset();
    onExit.mockReset();

    unmount();
    expect(onEnter).not.toHaveBeenCalled();
    expect(onExit).toHaveBeenCalled();
  });

  it('should update element z index when prop changes', () => {
    const { rerender } = render(
      <Offcanvas isOpen zIndex={0}>
        Yo!
      </Offcanvas>,
    );
    expect(screen.getByText(/yo/i).parentElement).toHaveStyle('z-index: 0');
    rerender(
      <Offcanvas isOpen zIndex={1}>
        Yo!
      </Offcanvas>,
    );
    expect(screen.getByText(/yo/i).parentElement).toHaveStyle('z-index: 1');
  });

  it('should allow focus on only focusable elements', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Offcanvas isOpen toggle={toggle}>
        <OffcanvasHeader toggle={toggle}>Offcanvas title</OffcanvasHeader>
        <OffcanvasBody>
          <a href="/">First Test</a>
          <map name="test">
            <area alt="test" href="/" coords="200,5,200,30" />
          </map>
          <input type="text" aria-label="test text input" />
          <input type="hidden" />
          <input type="text" disabled value="Test" />
          <select name="test" id="select_test">
            <option>Second item</option>
          </select>
          <select name="test" id="select_test_disabled" disabled>
            <option>Third item</option>
          </select>
          <textarea
            name="textarea_test"
            id="textarea_test"
            cols={30}
            rows={10}
            aria-label="test text area"
          />
          <textarea
            name="textarea_test_disabled"
            id="textarea_test_disabled"
            cols={30}
            rows={10}
            disabled
          />
          <object>Test</object>
          {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- custom tabindex must be focusable */}
          <span tabIndex={0}>test tab index</span>
        </OffcanvasBody>
      </Offcanvas>,
    );

    await user.tab();
    expect(screen.getByLabelText(/close/i)).toHaveFocus();
    await user.tab();
    expect(screen.getByText(/first test/i)).toHaveFocus();
    await user.tab();
    expect(screen.getByLabelText(/test text input/i)).toHaveFocus();
    await user.tab();
    expect(screen.getByText(/second item/i).parentElement).toHaveFocus();
    await user.tab();
    expect(screen.getByLabelText(/test text area/i)).toHaveFocus();
    await user.tab();
    expect(screen.getByText(/test tab index/i)).toHaveFocus();
    await user.tab();
    expect(screen.getByLabelText(/close/i)).toHaveFocus();
  });

  it('should return the focus to the last focused element before the offcanvas has opened', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { rerender } = render(
      <>
        <button className="focus">Focused</button>
        <Offcanvas isOpen={false}>
          <OffcanvasBody>Whatever</OffcanvasBody>
        </Offcanvas>
      </>,
    );

    await user.tab();
    expect(screen.getByText(/focused/i)).toHaveFocus();

    rerender(
      <>
        <button className="focus">Focused</button>
        <Offcanvas isOpen>
          <OffcanvasBody>Whatever</OffcanvasBody>
        </Offcanvas>
      </>,
    );

    expect(screen.getByText(/focused/i)).not.toHaveFocus();

    rerender(
      <>
        <button className="focus">Focused</button>
        <Offcanvas isOpen={false}>
          <OffcanvasBody>Whatever</OffcanvasBody>
        </Offcanvas>
      </>,
    );

    act(() => vi.runAllTimers());
    expect(screen.getByText(/focused/i)).toHaveFocus();
  });

  it('should not return the focus to the last focused element before the offcanvas has opened when "returnFocusAfterClose" is false', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { rerender } = render(
      <>
        <button className="focus">Focused</button>
        <Offcanvas returnFocusAfterClose={false} isOpen={false}>
          <OffcanvasBody>Whatever</OffcanvasBody>
        </Offcanvas>
      </>,
    );

    await user.tab();
    expect(screen.getByText(/focused/i)).toHaveFocus();

    rerender(
      <>
        <button className="focus">Focused</button>
        <Offcanvas returnFocusAfterClose={false} isOpen>
          <OffcanvasBody>Whatever</OffcanvasBody>
        </Offcanvas>
      </>,
    );

    expect(screen.getByText(/focused/i)).not.toHaveFocus();

    rerender(
      <>
        <button className="focus">Focused</button>
        <Offcanvas returnFocusAfterClose={false} isOpen={false}>
          <OffcanvasBody>Whatever</OffcanvasBody>
        </Offcanvas>
      </>,
    );

    act(() => vi.runAllTimers());
    expect(screen.getByText(/focused/i)).not.toHaveFocus();
  });

  it('should return the focus to the last focused element before the offcanvas has opened when "unmountOnClose" is false', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { rerender } = render(
      <>
        <button className="focus">Focused</button>
        <Offcanvas unmountOnClose={false} isOpen={false}>
          <OffcanvasBody>Whatever</OffcanvasBody>
        </Offcanvas>
      </>,
    );

    await user.tab();
    expect(screen.getByText(/focused/i)).toHaveFocus();

    rerender(
      <>
        <button className="focus">Focused</button>
        <Offcanvas unmountOnClose={false} isOpen>
          <OffcanvasBody>Whatever</OffcanvasBody>
        </Offcanvas>
      </>,
    );

    expect(screen.getByText(/focused/i)).not.toHaveFocus();

    rerender(
      <>
        <button className="focus">Focused</button>
        <Offcanvas unmountOnClose={false} isOpen={false}>
          <OffcanvasBody>Whatever</OffcanvasBody>
        </Offcanvas>
      </>,
    );

    act(() => vi.runAllTimers());
    expect(screen.getByText(/focused/i)).toHaveFocus();
  });

  it('should not return the focus to the last focused element before the offcanvas has opened when "returnFocusAfterClose" is false and "unmountOnClose" is false', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { rerender } = render(
      <>
        <button className="focus">Focused</button>
        <Offcanvas
          returnFocusAfterClose={false}
          unmountOnClose={false}
          isOpen={false}
        >
          <OffcanvasBody>Whatever</OffcanvasBody>
        </Offcanvas>
      </>,
    );

    await user.tab();
    expect(screen.getByText(/focused/i)).toHaveFocus();

    rerender(
      <>
        <button className="focus">Focused</button>
        <Offcanvas returnFocusAfterClose={false} unmountOnClose={false} isOpen>
          <OffcanvasBody>Whatever</OffcanvasBody>
        </Offcanvas>
      </>,
    );

    expect(screen.getByText(/focused/i)).not.toHaveFocus();

    rerender(
      <>
        <button className="focus">Focused</button>
        <Offcanvas
          returnFocusAfterClose={false}
          unmountOnClose={false}
          isOpen={false}
        >
          <OffcanvasBody>Whatever</OffcanvasBody>
        </Offcanvas>
      </>,
    );

    act(() => vi.runAllTimers());
    expect(screen.getByText(/focused/i)).not.toHaveFocus();
  });

  it('should attach/detach trapFocus for dialogs', () => {
    const addEventListener = vi.spyOn(document, 'addEventListener');
    const removeEventListener = vi.spyOn(document, 'removeEventListener');

    const { unmount } = render(
      <Offcanvas isOpen toggle={toggle}>
        Yo!
      </Offcanvas>,
    );

    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledWith(
      'focus',
      expect.any(Function),
      true,
    );

    unmount();

    expect(removeEventListener).toHaveBeenCalledTimes(1);
    expect(removeEventListener).toHaveBeenCalledWith(
      'focus',
      expect.any(Function),
      true,
    );

    addEventListener.mockRestore();
    removeEventListener.mockRestore();
  });

  it('should trap focus inside the open dialog', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <>
        <Button className="first">Focused</Button>
        <Offcanvas isOpen trapFocus>
          <OffcanvasBody>
            Something else to see
            <Button className="focus">focusable element</Button>
          </OffcanvasBody>
        </Offcanvas>
      </>,
    );
    await user.tab();
    expect(screen.getByText(/focusable element/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByText(/focusable element/i)).toHaveFocus();
  });
});
