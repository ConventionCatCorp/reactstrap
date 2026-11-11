import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropdownItem } from '..';
import {
  testForChildrenInComponent,
  testForDefaultTag,
  customDropdownRender,
} from '../testUtils';

describe('DropdownItem', () => {
  const user = userEvent.setup();

  it('should render a single child', async () => {
    testForChildrenInComponent(DropdownItem);
  });

  it('should render type as "button" by default', async () => {
    testForDefaultTag(DropdownItem, 'button');
  });

  it('should not render type when tag is "button" and toggle is false', async () => {
    render(<DropdownItem toggle={false}>Home</DropdownItem>);
    expect(screen.getByText('Home')).not.toHaveAttribute('type');
  });

  it('should render type as user defined when defined by the user', async () => {
    render(<DropdownItem type="submit">Home</DropdownItem>);
    expect(screen.getByText('Home')).toHaveAttribute('type', 'submit');
  });

  it('should not render type by default when the type is not defined and the tag is not "button"', async () => {
    render(<DropdownItem tag="a">Home</DropdownItem>);
    expect(screen.getByText('Home')).not.toHaveAttribute('type');
  });

  it('should render custom element', async () => {
    function Link(props: { children?: ReactNode }) {
      return (
        <a href="/home" {...props}>
          {props.children}
        </a>
      );
    }
    render(<DropdownItem tag={Link}>Home</DropdownItem>);
    expect(screen.getByText('Home')).toHaveAttribute('href', '/home');
    expect(screen.getByText('Home').tagName.toLowerCase()).toMatch('a');
  });

  it('should render dropdown item text', async () => {
    render(<DropdownItem text>text</DropdownItem>);
    expect(screen.getByText('text')).toHaveClass('dropdown-item-text');
    expect(screen.getByText('text').tagName.toLowerCase()).toMatch('span');
  });

  describe('header', () => {
    it('should render h6 tag heading', async () => {
      render(<DropdownItem header>Heading</DropdownItem>);
      expect(screen.getByText('Heading')).toHaveClass('dropdown-header');
      expect(screen.getByText('Heading').tagName.toLowerCase()).toMatch('h6');
    });
  });

  describe('active', () => {
    it('should render an active class', async () => {
      render(<DropdownItem active data-testid="divider" />);
      expect(screen.getByTestId('divider')).toHaveClass('active');
    });
  });

  describe('divider', () => {
    it('should render a divider element', async () => {
      render(<DropdownItem divider data-testid="divider" />);
      expect(screen.getByTestId('divider')).toHaveClass('dropdown-divider');
    });
  });

  describe('link (with href)', () => {
    it('should render an anchor tag', async () => {
      render(<DropdownItem href="#">GO!</DropdownItem>);
      expect(screen.getByText('GO!')).toHaveClass('dropdown-item');
      expect(screen.getByText('GO!').tagName.toLowerCase()).toMatch('a');
    });
  });

  describe('onClick', () => {
    it('should not be called when disabled', async () => {
      const onClick = vi.fn();
      render(
        <DropdownItem disabled onClick={onClick}>
          Item
        </DropdownItem>,
      );
      await user.click(screen.getByText('Item'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not be called when divider is set', async () => {
      const onClick = vi.fn();
      render(
        <DropdownItem divider onClick={onClick}>
          Item
        </DropdownItem>,
      );
      await user.click(screen.getByText('Item'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not be called when header item', async () => {
      const onClick = vi.fn();
      render(
        <DropdownItem header onClick={onClick}>
          Item
        </DropdownItem>,
      );
      await user.click(screen.getByText('Item'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should be called when not disabled, heading, or divider', async () => {
      const onClick = vi.fn();
      customDropdownRender(
        <DropdownItem onClick={onClick}>Item</DropdownItem>,
        {
          toggle: () => {},
        },
      );
      await user.click(screen.getByText(/item/i));
      expect(onClick).toHaveBeenCalled();
    });

    it('should call toggle', async () => {
      const toggle = vi.fn();
      customDropdownRender(
        <DropdownItem onClick={() => {}}>Item</DropdownItem>,
        {
          toggle,
        },
      );
      await user.click(screen.getByText(/item/i));
      expect(toggle).toHaveBeenCalled();
    });
  });
});
