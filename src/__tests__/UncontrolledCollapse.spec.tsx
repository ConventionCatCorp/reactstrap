import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UncontrolledCollapse } from '..';

describe('UncontrolledCollapse', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <button id="toggler">Click Me</button>
        <button class="toggler">Toggler 1</button>
        <button class="toggler">Toggler 2</button>
      </div>`;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('should be a Collapse', () => {
    render(
      <UncontrolledCollapse data-testid="collapse" toggler="#toggler">
        Yo!
      </UncontrolledCollapse>,
    );

    expect(screen.getByTestId('collapse')).toHaveClass('collapse');
  });

  it('should toggle isOpen when toggle is called', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <UncontrolledCollapse data-testid="collapse" toggler="#toggler">
        Yo!
      </UncontrolledCollapse>,
    );

    await user.click(screen.getByText(/click me/i));
    act(() => vi.advanceTimersByTime(1000));

    expect(screen.getByTestId('collapse')).toHaveClass('show');
  });

  it('should toggle for multiple togglers', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <UncontrolledCollapse data-testid="collapse" toggler=".toggler">
        Yo!
      </UncontrolledCollapse>,
    );

    expect(screen.getByTestId('collapse')).not.toHaveClass('show');

    await user.click(screen.getByText(/toggler 1/i));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByTestId('collapse')).toHaveClass('show');

    await user.click(screen.getByText(/toggler 2/i));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByTestId('collapse')).not.toHaveClass('show');
  });
});
