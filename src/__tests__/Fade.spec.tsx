import { act, render, screen } from '@testing-library/react';
import { Fade } from '..';
import { testForCustomTag } from '../testUtils';

const shown = () => document.getElementsByClassName('fade show').length;

describe('Fade', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should transition classes from "fade" to "fade show" on appear', () => {
    const ui = (isIn: boolean) => (
      <>
        <Fade in={isIn}>Yo!</Fade>
        <Fade in={isIn} appear={false}>
          Yo 2!
        </Fade>
      </>
    );
    const { rerender } = render(ui(true));

    expect(screen.getByText('Yo!')).toHaveClass('fade');
    expect(screen.getByText('Yo!')).not.toHaveClass('show');
    expect(screen.getByText('Yo 2!')).toHaveClass('fade show');

    act(() => vi.advanceTimersByTime(300));

    expect(screen.getByText('Yo!')).toHaveClass('fade show');
    expect(screen.getByText('Yo 2!')).toHaveClass('fade show');

    rerender(ui(false));

    expect(screen.getByText('Yo!')).not.toHaveClass('show');
    expect(screen.getByText('Yo 2!')).not.toHaveClass('show');
  });

  it('should transition classes from "fade" to "fade show" on enter', () => {
    const onEnter = vi.fn();
    const onEntered = vi.fn();
    const onExit = vi.fn();
    const onExited = vi.fn();
    const ui = (isIn: boolean) => (
      <>
        <Fade
          in={isIn}
          unmountOnExit
          onEnter={onEnter}
          onEntered={onEntered}
          onExit={onExit}
          onExited={onExited}
        >
          Yo 3!
        </Fade>
        <Fade in={isIn} unmountOnExit appear={false} enter={false} exit={false}>
          Yo 4!
        </Fade>
      </>
    );
    const { rerender } = render(ui(false));

    expect(document.getElementsByClassName('fade').length).toBe(0);

    rerender(ui(true));

    expect(onEnter).toHaveBeenCalledWith(screen.getByText('Yo 3!'), false);
    expect(onExit).not.toHaveBeenCalled();
    expect(document.getElementsByClassName('fade').length).toBe(2);
    expect(shown()).toBe(1);

    act(() => vi.advanceTimersByTime(300));

    expect(onEntered).toHaveBeenCalledTimes(1);
    expect(shown()).toBe(2);

    rerender(ui(false));

    expect(onExit).toHaveBeenCalled();
    expect(shown()).toBe(0);

    act(() => vi.advanceTimersByTime(300));

    expect(onExited).toHaveBeenCalledTimes(1);
    expect(document.getElementsByClassName('fade').length).toBe(0);
  });

  it('should reverse an exit that is still running', () => {
    const onEntered = vi.fn();
    const { rerender } = render(
      <Fade in appear={false} onEntered={onEntered}>
        Yo
      </Fade>,
    );
    rerender(
      <Fade in={false} onEntered={onEntered}>
        Yo
      </Fade>,
    );
    act(() => vi.advanceTimersByTime(50));
    rerender(
      <Fade in onEntered={onEntered}>
        Yo
      </Fade>,
    );
    act(() => vi.advanceTimersByTime(300));

    expect(onEntered).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Yo')).toHaveClass('fade show');
  });

  it('should forward object and callback refs', () => {
    const objRef = { current: null as HTMLElement | null };
    let cbNode: HTMLElement | null = null;
    render(
      <>
        <Fade innerRef={objRef}>A</Fade>
        <Fade innerRef={(el) => void (cbNode = el)}>B</Fade>
      </>,
    );
    expect(objRef.current).toBe(screen.getByText('A'));
    expect(cbNode).toBe(screen.getByText('B'));
  });

  it('should pass className down', () => {
    render(<Fade className="test-class-name">Yo!</Fade>);
    expect(screen.getByText(/yo/i)).toHaveClass('test-class-name');
  });

  it('should pass other props down', () => {
    render(<Fade data-testprop="testvalue">Yo</Fade>);
    expect(screen.getByText(/yo/i)).toHaveAttribute(
      'data-testprop',
      'testvalue',
    );
  });

  it('should support custom tag', () => {
    testForCustomTag(Fade);
  });
});
