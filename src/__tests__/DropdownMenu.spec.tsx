import { screen } from '@testing-library/react';
import { offset, useFloating } from '@floating-ui/react-dom';
import type { DropdownContextValue } from '../DropdownContext';
import { DropdownMenu } from '..';
import { customDropdownRender, lastFloating, middleware } from '../testUtils';

describe('DropdownMenu', () => {
  const contextProps = {
    isOpen: false,
    direction: 'down' as DropdownContextValue['direction'],
    inNavbar: false,
  };

  beforeEach(() => {
    contextProps.isOpen = false;
    contextProps.direction = 'down';
    contextProps.inNavbar = false;
  });

  it('should render children', async () => {
    customDropdownRender(<DropdownMenu>Content</DropdownMenu>, contextProps);

    expect(screen.getByText(/content/i)).toBeInTheDocument();
  });

  it('should not have the class "show" when isOpen context is false', async () => {
    customDropdownRender(<DropdownMenu>Content</DropdownMenu>, contextProps);

    expect(screen.getByText(/content/i)).not.toHaveClass('show');
  });

  it('should have the class "show" when isOpen context is true', async () => {
    contextProps.isOpen = true;
    customDropdownRender(<DropdownMenu>Content</DropdownMenu>, contextProps);
    expect(screen.getByText(/content/i)).toHaveClass('show');
  });

  it('should render left aligned menus by default', async () => {
    contextProps.isOpen = true;
    customDropdownRender(<DropdownMenu>Ello world</DropdownMenu>, contextProps);

    expect(screen.getByText(/ello world/i)).not.toHaveClass(
      'dropdown-menu-end',
    );
  });

  it('should render right aligned menus', async () => {
    contextProps.isOpen = true;
    customDropdownRender(
      <DropdownMenu end>Ello world</DropdownMenu>,
      contextProps,
    );

    expect(screen.getByText(/ello world/i)).toHaveClass('dropdown-menu-end');
  });

  it('should ignore the removed Bootstrap 4 "right" prop', () => {
    contextProps.isOpen = true;
    customDropdownRender(
      <DropdownMenu {...{ right: 'true' }}>Ello world</DropdownMenu>,
      contextProps,
    );

    expect(screen.getByText(/ello world/i)).not.toHaveClass(
      'dropdown-menu-end',
    );
    expect(lastFloating().placement).toBe('bottom-start');
  });

  it('should render down when direction is unknown on the context', async () => {
    contextProps.isOpen = true;
    contextProps.direction = 'unknown' as DropdownContextValue['direction'];
    customDropdownRender(<DropdownMenu>Ello world</DropdownMenu>, contextProps);

    expect(screen.getByText(/ello world/i)).toHaveAttribute(
      'data-popper-placement',
      'bottom-start',
    );
  });

  it('should render down when direction is "down" on the context', async () => {
    contextProps.isOpen = true;
    customDropdownRender(<DropdownMenu>Ello world</DropdownMenu>, contextProps);

    expect(screen.getByText(/ello world/i)).toHaveAttribute(
      'data-popper-placement',
      'bottom-start',
    );
  });

  it('should render up when direction is "up" on the context', async () => {
    contextProps.isOpen = true;
    contextProps.direction = 'up';
    customDropdownRender(<DropdownMenu>Ello world</DropdownMenu>, contextProps);
    expect(screen.getByText(/ello world/i)).toHaveAttribute(
      'data-popper-placement',
      'top-start',
    );
  });

  it('should render left when direction is "start" on the context', async () => {
    contextProps.isOpen = true;
    contextProps.direction = 'start';
    customDropdownRender(<DropdownMenu>Ello world</DropdownMenu>, contextProps);
    expect(screen.getByText(/ello world/i)).toHaveAttribute(
      'data-popper-placement',
      'left-start',
    );
  });

  it('should render right when direction is "end" on the context', async () => {
    contextProps.isOpen = true;
    contextProps.direction = 'end';
    customDropdownRender(<DropdownMenu>Ello world</DropdownMenu>, contextProps);
    expect(screen.getByText(/ello world/i)).toHaveAttribute(
      'data-popper-placement',
      'right-start',
    );
  });

  it('should flip and shift by default', async () => {
    contextProps.isOpen = true;
    customDropdownRender(<DropdownMenu>Ello world</DropdownMenu>, contextProps);

    expect(middleware('flip')).toBeDefined();
    expect(middleware('shift')).toBeDefined();
  });

  it('should not flip when flip is false', async () => {
    contextProps.isOpen = true;
    customDropdownRender(
      <DropdownMenu flip={false}>Ello world</DropdownMenu>,
      contextProps,
    );

    expect(middleware('flip')).toBeUndefined();
    expect(middleware('shift')).toBeDefined();
  });

  it('should let custom middleware replace same-named defaults', async () => {
    contextProps.isOpen = true;
    const custom = { name: 'shift', fn: (s: { x: number; y: number }) => s };
    customDropdownRender(
      <DropdownMenu middleware={[custom]}>Ello world</DropdownMenu>,
      contextProps,
    );

    const names = lastFloating().middleware?.map((m) => m && m.name);
    expect(names).toEqual(['flip', 'shift']);
    expect(lastFloating().middleware).toContain(custom);
  });

  it('should run a custom offset before flip and shift', async () => {
    contextProps.isOpen = true;
    const custom = offset(2);
    customDropdownRender(
      <DropdownMenu middleware={[custom]}>Ello world</DropdownMenu>,
      contextProps,
    );

    const mw = lastFloating().middleware!;
    expect(mw.map((m) => m && m.name)).toEqual(['offset', 'flip', 'shift']);
    expect(mw[0]).toBe(custom);
  });

  it('should float against the toggle from context', async () => {
    contextProps.isOpen = true;
    const reference = document.createElement('button');
    customDropdownRender(<DropdownMenu>Ello world</DropdownMenu>, {
      ...contextProps,
      reference,
    });

    expect(lastFloating().elements?.reference).toBe(reference);
  });

  it('should keep a custom onClick and reposition with updateOnSelect', async () => {
    contextProps.isOpen = true;
    const onClick = vi.fn();
    const update = vi.fn();
    const actual = vi.mocked(useFloating).getMockImplementation()!;
    vi.mocked(useFloating).mockImplementation((o) => ({
      ...actual(o),
      update,
    }));
    try {
      customDropdownRender(
        <DropdownMenu updateOnSelect onClick={onClick}>
          Ello world
        </DropdownMenu>,
        contextProps,
      );
      screen.getByText(/ello world/i).click();
    } finally {
      vi.mocked(useFloating).mockImplementation(actual);
    }

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledTimes(1);
  });

  it('should position using fixed mode', async () => {
    contextProps.isOpen = true;
    customDropdownRender(
      <DropdownMenu strategy="fixed">Ello world</DropdownMenu>,
      contextProps,
    );
    expect(lastFloating().strategy).toBe('fixed');
  });

  it('should not position the menu when isOpen is false', async () => {
    customDropdownRender(
      <DropdownMenu end>Ello world</DropdownMenu>,
      contextProps,
    );

    expect(useFloating).not.toHaveBeenCalled();
  });

  it('should render custom tag', async () => {
    contextProps.isOpen = true;
    customDropdownRender(
      <DropdownMenu tag="main">Yo!</DropdownMenu>,
      contextProps,
    );

    expect(screen.getByText(/yo/i).tagName).toBe('MAIN');
  });

  describe('using container', () => {
    let element: HTMLDivElement;

    beforeEach(() => {
      element = document.createElement('div');
      document.body.appendChild(element);
    });

    afterEach(() => {
      document.body.removeChild(element);
    });

    it('should render inside container', async () => {
      contextProps.isOpen = true;
      element.innerHTML = '<div id="anotherContainer"></div>';
      customDropdownRender(
        <DropdownMenu container="#anotherContainer">My body</DropdownMenu>,
        contextProps,
      );

      expect(document.getElementById('anotherContainer')!.innerHTML).toContain(
        'My body',
      );
    });
  });

  it('should not have the class "dropdown-menu-dark" by default', async () => {
    contextProps.isOpen = true;
    customDropdownRender(
      <DropdownMenu>Keep it light</DropdownMenu>,
      contextProps,
    );

    expect(screen.getByText(/keep it light/i)).not.toHaveClass(
      'dropdown-menu-dark',
    );
  });

  it('should have the class "dropdown-menu-dark" when dark is true', async () => {
    contextProps.isOpen = true;
    customDropdownRender(
      <DropdownMenu dark data-testid="dark-menu">
        Let&apos;s go dark
      </DropdownMenu>,
      contextProps,
    );

    expect(screen.getByTestId('dark-menu')).toHaveClass('dropdown-menu-dark');
  });
});
