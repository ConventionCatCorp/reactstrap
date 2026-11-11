import { screen } from '@testing-library/react';
import { Popper } from '../popper';
import type { DropdownContextValue } from '../DropdownContext';
import { DropdownMenu } from '..';
import { customDropdownRender } from '../testUtils';

vi.mock('../popper');

const PopperMock = vi.mocked(Popper);

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
    expect(PopperMock.mock.calls[0][0].placement).toBe('bottom-start');
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
    // expect(wrapper.find(Popper).prop('placement')).toBe('top-start');
  });

  it('should render left when direction is "start" on the context', async () => {
    contextProps.isOpen = true;
    contextProps.direction = 'start';
    customDropdownRender(<DropdownMenu>Ello world</DropdownMenu>, contextProps);
    expect(screen.getByText(/ello world/i)).toHaveAttribute(
      'data-popper-placement',
      'left-start',
    );
    // expect(wrapper.find(Popper).prop('placement')).toBe('left-start');
  });

  it('should render right when direction is "end" on the context', async () => {
    contextProps.isOpen = true;
    contextProps.direction = 'end';
    customDropdownRender(<DropdownMenu>Ello world</DropdownMenu>, contextProps);
    expect(screen.getByText(/ello world/i)).toHaveAttribute(
      'data-popper-placement',
      'right-start',
    );
    // expect(wrapper.find(Popper).prop('placement')).toBe('right-start');
  });

  it('should not disable flip modifier by default', async () => {
    contextProps.isOpen = true;
    customDropdownRender(<DropdownMenu>Ello world</DropdownMenu>, contextProps);

    expect(PopperMock.mock.calls[0][0].modifiers![0]).toMatchObject({
      name: 'flip',
      enabled: true,
    });
  });

  it('should disable flip modifier when flip is false', async () => {
    contextProps.isOpen = true;
    customDropdownRender(
      <DropdownMenu flip={false}>Ello world</DropdownMenu>,
      contextProps,
    );

    expect(PopperMock.mock.calls.length).toBe(1);
    expect(PopperMock.mock.calls[0][0].modifiers![0]).toMatchObject({
      name: 'flip',
      enabled: false,
    });
  });

  it('should position using fixed mode', async () => {
    contextProps.isOpen = true;
    customDropdownRender(
      <DropdownMenu strategy="fixed">Ello world</DropdownMenu>,
      contextProps,
    );
    expect(PopperMock.mock.calls[0][0].strategy).toBe('fixed');
  });

  it('should not render Popper when isOpen is false', async () => {
    customDropdownRender(
      <DropdownMenu end>Ello world</DropdownMenu>,
      contextProps,
    );

    expect(PopperMock).not.toHaveBeenCalled();
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
