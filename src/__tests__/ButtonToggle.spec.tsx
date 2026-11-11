import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ButtonToggle } from '..';
import { testForChildrenInComponent } from '../testUtils';

describe('ButtonToggle', () => {
  it('should render children', () => {
    testForChildrenInComponent(ButtonToggle);
  });

  it('should have button already toggled for defaultValue true', () => {
    render(<ButtonToggle defaultValue>Ello world</ButtonToggle>);

    expect(screen.getByText(/world/i)).toHaveClass('active');
  });

  describe('onClick', () => {
    it('calls props.onClick if it exists', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<ButtonToggle onClick={onClick}>Testing Click</ButtonToggle>);

      await user.click(screen.getByText(/testing click/i));
      expect(onClick).toHaveBeenCalled();
    });

    it('toggles active on every click, even with props.onClick', async () => {
      const user = userEvent.setup();
      render(<ButtonToggle onClick={vi.fn()}>Testing Click</ButtonToggle>);
      const button = screen.getByText(/testing click/i);

      await user.click(button);
      expect(button).toHaveClass('active');
      await user.click(button);
      expect(button).not.toHaveClass('active');
    });

    it('should not call props.onClick if it exists and button is disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <ButtonToggle onClick={onClick} disabled>
          Testing Click
        </ButtonToggle>,
      );

      await user.click(screen.getByText(/testing click/i));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('onFocus', () => {
    it('calls props.onFocus if it exists', () => {
      const onFocus = vi.fn();
      render(<ButtonToggle onFocus={onFocus}>Testing Click</ButtonToggle>);

      screen.getByText(/testing click/i).focus();
      expect(onFocus).toHaveBeenCalled();
    });
  });

  describe('onBlur', () => {
    it('calls props.onBlur if it exists', () => {
      const onBlur = vi.fn();
      render(<ButtonToggle onBlur={onBlur}>Testing Click</ButtonToggle>);
      screen.getByText(/testing click/i).focus();
      screen.getByText(/testing click/i).blur();
      expect(onBlur).toHaveBeenCalled();
    });
  });
});
