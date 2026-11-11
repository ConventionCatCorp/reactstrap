import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CloseButton from '../CloseButton';

describe('CloseButton', () => {
  it('should render a close button', () => {
    render(<CloseButton data-testid="close-btn" />);
    expect(screen.getByTestId('close-btn')).toHaveClass('btn-close');
  });

  it('should render white variant', () => {
    render(<CloseButton variant="white" data-testid="close-btn" />);
    expect(screen.getByTestId('close-btn')).toHaveClass('btn-close-white');
  });

  describe('onClick', () => {
    it('calls props.onClick if it exists', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<CloseButton onClick={onClick} data-testid="btn-close" />);

      await user.click(screen.getByTestId('btn-close'));
      expect(onClick).toHaveBeenCalled();
    });

    it('returns the value returned by props.onClick', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn(() => 1234);
      render(<CloseButton onClick={onClick} data-testid="btn-close" />);

      await user.click(screen.getByTestId('btn-close'));

      expect(onClick.mock.results[0].value).toBe(1234);
    });

    it('is not called when disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <CloseButton onClick={onClick} disabled data-testid="btn-close" />,
      );
      await user.click(screen.getByTestId('btn-close'));

      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
