import { createEvent, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DropdownContextValue } from '../DropdownContext';
import { DropdownToggle } from '..';
import { customDropdownRender } from '../testUtils';

vi.mock('../popper');

describe('DropdownToggle', () => {
  const user = userEvent.setup();
  const contextProps = {
    isOpen: false,
    direction: 'down' as DropdownContextValue['direction'],
    inNavbar: false,
    toggle: vi.fn(),
  };

  beforeEach(() => {
    contextProps.isOpen = false;
    contextProps.direction = 'down';
    contextProps.inNavbar = false;
    contextProps.toggle.mockClear();
  });

  it('should wrap text', async () => {
    customDropdownRender(
      <DropdownToggle>Ello world</DropdownToggle>,
      contextProps,
    );

    expect(screen.getByText(/ello world/i)).toBeInTheDocument();
  });

  it('should add default visually-hidden content', async () => {
    customDropdownRender(<DropdownToggle />, contextProps);

    expect(screen.getByText(/toggle dropdown/i)).toHaveClass('visually-hidden');
  });

  it('should add default visually-hidden content', async () => {
    customDropdownRender(
      <DropdownToggle aria-label="Dropup Toggle" />,
      contextProps,
    );

    expect(screen.getByText(/dropup toggle/i)).toHaveClass('visually-hidden');
  });

  it('should render elements', async () => {
    customDropdownRender(
      <DropdownToggle>Click Me</DropdownToggle>,
      contextProps,
    );

    expect(screen.getByText(/click me/i).tagName).toBe('BUTTON');
  });

  it('should render a caret', async () => {
    customDropdownRender(
      <DropdownToggle caret>Ello world</DropdownToggle>,
      contextProps,
    );

    expect(screen.getByText(/ello world/i)).toHaveClass('dropdown-toggle');
  });

  describe('color', () => {
    it('should render the dropdown as a BUTTON element with default color secondary', async () => {
      customDropdownRender(<DropdownToggle data-testid="rick" />, contextProps);
      expect(screen.getByTestId(/rick/i)).toHaveClass('btn-secondary');
    });

    it('should render the dropdown as a BUTTON element with explicit color success', async () => {
      customDropdownRender(
        <DropdownToggle color="success" data-testid="morty" />,
        contextProps,
      );

      expect(screen.getByTestId(/morty/i)).toHaveClass('btn-success');
    });

    it('should render the dropdown as an A element with no color attribute', async () => {
      customDropdownRender(
        <DropdownToggle tag="a" data-testid="pickle-rick" />,
        contextProps,
      );

      expect(screen.getByTestId(/pickle-rick/i).tagName).toBe('A');
      expect(screen.getByTestId(/pickle-rick/i)).not.toHaveAttribute('color');
    });

    it('should render the dropdown as a DIV element with no color attribute', async () => {
      customDropdownRender(
        <DropdownToggle tag="div" color="success" data-testid="tiny-rick" />,
        contextProps,
      );

      expect(screen.getByTestId(/tiny-rick/i).tagName).toBe('DIV');
      expect(screen.getByTestId(/tiny-rick/i)).not.toHaveAttribute('color');
    });
  });

  it('should render a split', async () => {
    customDropdownRender(
      <DropdownToggle split>Ello world</DropdownToggle>,
      contextProps,
    );

    expect(screen.getByText(/ello world/i)).toHaveClass(
      'dropdown-toggle-split',
    );
  });

  describe('onClick', () => {
    it('should call props.onClick if it exists', async () => {
      const onClick = vi.fn();
      customDropdownRender(
        <DropdownToggle onClick={onClick}>Ello world</DropdownToggle>,
        contextProps,
      );

      await user.click(screen.getByText(/ello world/i));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call context.toggle when present', async () => {
      contextProps.toggle = vi.fn();
      customDropdownRender(
        <DropdownToggle>Ello world</DropdownToggle>,
        contextProps,
      );

      await user.click(screen.getByText(/ello world/i));

      expect(contextProps.toggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('disabled', () => {
    it('should not call onClick when disabled', async () => {
      const onClick = vi.fn();
      customDropdownRender(
        <DropdownToggle disabled onClick={onClick}>
          Ello world
        </DropdownToggle>,
        contextProps,
      );

      await user.click(screen.getByText(/ello world/i));

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('nav', () => {
    it('should add .nav-link class', async () => {
      customDropdownRender(
        <DropdownToggle nav>Ello world</DropdownToggle>,
        contextProps,
      );

      expect(screen.getByText(/ello world/i)).toHaveClass('nav-link');
      expect(screen.getByText(/ello world/i).tagName).toBe('A');
    });

    it('should preventDefault', async () => {
      customDropdownRender(
        <DropdownToggle nav>Ello world</DropdownToggle>,
        contextProps,
      );

      const node = screen.getByText(/ello world/i);
      const click = createEvent.click(node);
      fireEvent(node, click);

      expect(click.defaultPrevented).toBeTruthy();
    });
  });
});
