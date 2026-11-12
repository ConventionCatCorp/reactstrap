import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import {
  Alert,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledAlert,
  UncontrolledButtonDropdown,
  UncontrolledDropdown,
  UncontrolledPopover,
  UncontrolledTooltip,
} from '..';
import { testForDefaultClass } from '../testUtils';

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  vi.useFakeTimers();
  user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe('UncontrolledAlert', () => {
  it('should be an Alert', async () => {
    testForDefaultClass(Alert, 'alert');
  });

  it('should be open by default', async () => {
    render(<UncontrolledAlert>Yo!</UncontrolledAlert>);
    expect(screen.getByText('Yo!')).toBeInTheDocument();
  });

  it('should toggle when close is clicked', async () => {
    render(<UncontrolledAlert>Yo!</UncontrolledAlert>);
    await user.click(screen.getByLabelText('Close'));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.queryByText('Yo!')).not.toBeInTheDocument();
  });
});

describe('UncontrolledButtonDropdown', () => {
  it('should be an ButtonDropdown', async () => {
    testForDefaultClass(ButtonDropdown, 'btn-group');
  });

  it('should be open by default', async () => {
    render(<UncontrolledButtonDropdown>Yo!</UncontrolledButtonDropdown>);
    expect(screen.getByText('Yo!')).toBeInTheDocument();
  });

  it('should toggle isOpen when toggle is called', async () => {
    render(
      <UncontrolledButtonDropdown>
        <DropdownToggle caret>Dropdown</DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Header</DropdownItem>
        </DropdownMenu>
      </UncontrolledButtonDropdown>,
    );

    await user.click(screen.getByText('Dropdown'));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole('menu')).toHaveClass('show');
  });
});

describe('UncontrolledDropdown', () => {
  it('should be an Dropdown', async () => {
    testForDefaultClass(UncontrolledDropdown, 'dropdown');
  });

  it('should be closed by default', async () => {
    render(
      <UncontrolledDropdown>
        <DropdownToggle caret>Dropdown</DropdownToggle>
        <DropdownMenu data-testid="sandman">
          <DropdownItem header>Header</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>,
    );

    expect(screen.getByTestId('sandman')).not.toHaveClass('show');
  });

  it('should toggle on button click', async () => {
    render(
      <UncontrolledDropdown>
        <DropdownToggle caret>Dropdown</DropdownToggle>
        <DropdownMenu data-testid="sandman">
          <DropdownItem header>Header</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>,
    );

    expect(screen.getByTestId('sandman')).not.toHaveClass('show');
    await user.click(screen.getByText('Dropdown'));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByTestId('sandman')).toHaveClass('show');
  });

  describe('onToggle', () => {
    it('should be closed on document body click', async () => {
      render(
        <UncontrolledDropdown defaultOpen>
          <DropdownToggle id="toggle">Toggle</DropdownToggle>
          <DropdownMenu data-testid="sandman">
            <DropdownItem>Test</DropdownItem>
            <DropdownItem id="divider" divider />
          </DropdownMenu>
        </UncontrolledDropdown>,
      );

      expect(screen.getByTestId('sandman')).toHaveClass('show');
      await user.click(document.body);
      act(() => vi.advanceTimersByTime(1000));
      expect(screen.getByTestId('sandman')).not.toHaveClass('show');
    });

    it('should be closed on container click', async () => {
      const { container } = render(
        <UncontrolledDropdown id="test" defaultOpen>
          <DropdownToggle id="toggle">Toggle</DropdownToggle>
          <DropdownMenu data-testid="dream">
            <DropdownItem>Test</DropdownItem>
            <DropdownItem id="divider" divider />
          </DropdownMenu>
        </UncontrolledDropdown>,
      );

      expect(screen.getByTestId('dream')).toHaveClass('show');
      await user.click(container);
      act(() => vi.advanceTimersByTime(1000));
      expect(screen.getByTestId('dream')).not.toHaveClass('show');
    });

    it('should toggle when toggle button is clicked', async () => {
      render(
        <UncontrolledDropdown id="test" defaultOpen={false}>
          <DropdownToggle id="toggle">Toggle</DropdownToggle>
          <DropdownMenu data-testid="lucien">
            <DropdownItem>Test</DropdownItem>
            <DropdownItem id="divider" divider />
          </DropdownMenu>
        </UncontrolledDropdown>,
      );

      expect(screen.getByTestId('lucien')).not.toHaveClass('show');
      await user.click(screen.getByText('Toggle'));

      act(() => vi.advanceTimersByTime(1000));
      expect(screen.getByTestId('lucien')).toHaveClass('show');
    });

    it('onToggle should be called on toggler click when opened', async () => {
      render(
        <UncontrolledDropdown id="test" defaultOpen>
          <DropdownToggle id="toggle">Toggle</DropdownToggle>
          <DropdownMenu data-testid="lucien">
            <DropdownItem>Test</DropdownItem>
            <DropdownItem id="divider" divider />
          </DropdownMenu>
        </UncontrolledDropdown>,
      );

      expect(screen.getByTestId('lucien')).toHaveClass('show');
      await user.click(screen.getByText('Toggle'));

      act(() => vi.advanceTimersByTime(1000));
      expect(screen.getByTestId('lucien')).not.toHaveClass('show');
    });

    it('onToggle should be called on key closing', async () => {
      const handleToggle = vi.fn();
      render(
        <UncontrolledDropdown id="test" onToggle={handleToggle} defaultOpen>
          <DropdownToggle id="toggle">Toggle</DropdownToggle>
          <DropdownMenu>
            <DropdownItem>Test</DropdownItem>
            <DropdownItem id="divider" divider />
          </DropdownMenu>
        </UncontrolledDropdown>,
      );

      screen.getByText('Toggle').focus();
      expect(handleToggle.mock.calls.length).toBe(0);

      await user.keyboard('{Escape}');
      expect(handleToggle.mock.calls.length).toBe(1);
    });

    it('onToggle should be called on key opening', async () => {
      const handleToggle = vi.fn();
      render(
        <UncontrolledDropdown
          id="test"
          onToggle={handleToggle}
          defaultOpen={false}
        >
          <DropdownToggle id="toggle">Toggle</DropdownToggle>
          <DropdownMenu>
            <DropdownItem>Test</DropdownItem>
            <DropdownItem id="divider" divider />
          </DropdownMenu>
        </UncontrolledDropdown>,
      );

      screen.getByText('Toggle').focus();
      expect(handleToggle.mock.calls.length).toBe(0);

      await user.keyboard('[ArrowDown]');
      expect(handleToggle.mock.calls.length).toBe(1);
    });
  });
});

describe('UncontrolledTooltip', () => {
  it('tooltip should not be rendered by default', async () => {
    render(
      <div>
        <span id="dream">sandman</span>
        <UncontrolledTooltip target="dream">
          king of dream world
        </UncontrolledTooltip>
      </div>,
    );
    expect(screen.queryByText('king of dream world')).not.toBeInTheDocument();
  });

  it('tooltip should not be rendered on hover', async () => {
    render(
      <div>
        <span id="dream">sandman</span>
        <UncontrolledTooltip target="dream">
          king of dream world
        </UncontrolledTooltip>
      </div>,
    );

    fireEvent.mouseOver(screen.getByText('sandman'));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('king of dream world')).toBeInTheDocument();
  });

  it('should render correctly with a ref object as the target', async () => {
    const target = createRef<HTMLSpanElement>();
    render(
      <div>
        <span ref={target}>sandman</span>
        <UncontrolledTooltip target={target}>
          king of dream world
        </UncontrolledTooltip>
      </div>,
    );

    fireEvent.mouseOver(screen.getByText('sandman'));
    act(() => vi.advanceTimersByTime(1000));

    expect(screen.queryByText('king of dream world')).toBeInTheDocument();
  });
});

describe('UncontrolledPopover', () => {
  let target: HTMLButtonElement;

  beforeEach(() => {
    target = document.createElement('button');
    target.id = 'pop';
    document.body.appendChild(target);
  });

  afterEach(() => {
    target.remove();
  });

  it('should be closed by default and toggle on target click', () => {
    render(
      <UncontrolledPopover target="pop">
        king of dream world
      </UncontrolledPopover>,
    );

    expect(screen.queryByText('king of dream world')).not.toBeInTheDocument();
    fireEvent.click(target);
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('king of dream world')).toBeInTheDocument();
  });

  it('should be open with defaultOpen', () => {
    render(
      <UncontrolledPopover target="pop" defaultOpen>
        king of dream world
      </UncontrolledPopover>,
    );

    expect(screen.getByText('king of dream world')).toBeInTheDocument();
  });
});
