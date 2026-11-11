import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Collapse } from '..';

describe('Collapse', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should render children', () => {
    render(<Collapse>Hello</Collapse>);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });

  it('works with strict mode', () => {
    const spy = vi.spyOn(console, 'error');
    render(
      <React.StrictMode>
        <Collapse />
      </React.StrictMode>,
    );
    expect(spy).not.toHaveBeenCalled();
  });

  it('should have default isOpen value as false', () => {
    render(<Collapse>Hello</Collapse>);
    expect(screen.getByText(/hello/i)).not.toHaveClass('show');
  });

  it('should render with class "collapse"', () => {
    render(<Collapse>Hello</Collapse>);
    expect(screen.getByText(/hello/i)).toHaveClass('collapse');
  });

  it('should render with class "collapse-horizontal" if it has prop horizontal', () => {
    render(<Collapse horizontal>Hello</Collapse>);
    expect(screen.getByText(/hello/i)).toHaveClass('collapse-horizontal');
  });

  it('should render with class "navbar-collapse" if it has prop navbar', () => {
    render(<Collapse navbar>Hello</Collapse>);
    expect(screen.getByText(/hello/i)).toHaveClass('navbar-collapse');
  });

  it('should render with class "show" when isOpen is true', () => {
    render(<Collapse isOpen>Hello</Collapse>);
    expect(screen.getByText(/hello/i)).toHaveClass('show');
  });

  it('should set height to null when isOpen is true', () => {
    render(<Collapse isOpen data-testid="collapse" />);
    expect(screen.getByTestId('collapse').style.height).toBe('');
  });

  it('should not set height when isOpen is false', () => {
    render(<Collapse isOpen={false} data-testid="collapse" />);
    expect(screen.getByTestId('collapse').style.height).toBe('');
  });

  it('should forward all styles', () => {
    render(
      <Collapse
        isOpen={false}
        data-testid="collapse"
        style={{ backgroundColor: 'black' }}
      />,
    );
    expect(screen.getByTestId('collapse').style.backgroundColor).toBe('black');
  });

  it('should forward all callbacks', () => {
    const callbacks = {
      onEnter: vi.fn(),
      onEntering: vi.fn(),
      onEntered: vi.fn(),
      onExit: vi.fn(),
      onExiting: vi.fn(),
      onExited: vi.fn(),
    };
    const { rerender } = render(<Collapse isOpen={false} {...callbacks} />);
    rerender(<Collapse isOpen {...callbacks} />);
    expect(callbacks.onEnter).toHaveBeenCalled();
    expect(callbacks.onEntering).toHaveBeenCalled();
    expect(callbacks.onEntered).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(350));
    expect(callbacks.onEntered).toHaveBeenCalled();
    expect(callbacks.onExit).not.toHaveBeenCalled();
    rerender(<Collapse isOpen={false} {...callbacks} />);
    expect(callbacks.onExit).toHaveBeenCalled();
    expect(callbacks.onExiting).toHaveBeenCalled();
    expect(callbacks.onExited).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(350));
    expect(callbacks.onExiting).toHaveBeenCalled();
    expect(callbacks.onExited).toHaveBeenCalled();
  });

  it('should apply correct bootstrap classes', () => {
    const { rerender } = render(
      <Collapse isOpen={false} data-testid="collapse" />,
    );
    rerender(<Collapse isOpen data-testid="collapse" />);
    expect(screen.getByTestId('collapse')).toHaveClass('collapsing');
    act(() => vi.advanceTimersByTime(350));
    expect(screen.getByTestId('collapse')).toHaveClass('collapse show');

    rerender(<Collapse isOpen={false} data-testid="collapse" />);
    expect(screen.getByTestId('collapse')).toHaveClass('collapsing');
    act(() => vi.advanceTimersByTime(350));
    expect(screen.getByTestId('collapse')).toHaveClass('collapse');
  });

  it('should set inline style to 0 when isOpen change to false and remove after transition', () => {
    const { rerender } = render(<Collapse isOpen data-testid="collapse" />);
    rerender(<Collapse isOpen={false} data-testid="collapse" />);
    expect(screen.getByTestId('collapse').style.height).toBe('0px');
    act(() => vi.advanceTimersByTime(380));
    expect(screen.getByTestId('collapse').style.height).toBe('');
  });
});
