import { act, fireEvent, render, screen } from '@testing-library/react';
import { Popper } from '../popper';
import PopperContent from '../PopperContent';
import Tooltip from '../Tooltip';

vi.mock('../popper');

const lastPopperProps = () => vi.mocked(Popper).mock.calls.at(-1)![0];

describe('Tooltip', () => {
  let element: HTMLDivElement;
  beforeEach(() => {
    element = document.createElement('div');
    element.setAttribute('id', 'tooltip-target');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should apply popperClassName to popper component', () => {
    render(
      <Tooltip target="tooltip-target" popperClassName="boba-was-here" isOpen>
        Bo-Katan Kryze
      </Tooltip>,
    );

    expect(screen.queryByText('Bo-Katan Kryze')?.parentElement).toHaveClass(
      'tooltip show boba-was-here',
    );
  });

  it('should apply arrowClassName to arrow', () => {
    render(
      <Tooltip target="tooltip-target" arrowClassName="boba-was-here" isOpen>
        Bo-Katan Kryze
      </Tooltip>,
    );
    expect(document.querySelector('.arrow')).toHaveClass('boba-was-here');
  });

  // Regression: React 19 ignores defaultProps on function components.
  describe('defaults', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should place top with the bs-tooltip prefix', () => {
      render(
        <Tooltip target="tooltip-target" isOpen>
          Content
        </Tooltip>,
      );

      expect(lastPopperProps().placement).toBe('top');
      expect(screen.getByText('Content').parentElement).toHaveClass(
        'bs-tooltip-auto',
      );
    });

    it('should open on hover and focus, not on click (trigger "hover focus")', () => {
      const toggle = vi.fn();
      render(
        <Tooltip target="tooltip-target" toggle={toggle}>
          Content
        </Tooltip>,
      );

      element.click();
      act(() => vi.runAllTimers());
      expect(toggle).not.toHaveBeenCalled();

      fireEvent.mouseOver(element);
      act(() => vi.runAllTimers());
      expect(toggle).toHaveBeenCalledTimes(1);

      fireEvent.focusIn(element);
      expect(toggle).toHaveBeenCalledTimes(2);
    });

    it('should hide when the pointer moves onto the tooltip (autohide)', () => {
      const toggle = vi.fn();
      render(
        <Tooltip target="tooltip-target" toggle={toggle} isOpen>
          Content
        </Tooltip>,
      );

      fireEvent.mouseOut(element);
      fireEvent.mouseOver(screen.getByText('Content'));
      act(() => vi.runAllTimers());
      expect(toggle).toHaveBeenCalledTimes(1);
    });

    it('should use the PopperContent default offset', () => {
      render(
        <Tooltip target="tooltip-target" isOpen>
          Content
        </Tooltip>,
      );

      expect(lastPopperProps().modifiers).toContainEqual({
        name: 'offset',
        options: { offset: PopperContent.defaultProps.offset },
      });
    });

    it('should honor a patched PopperContent.defaultProps.offset', () => {
      const original = PopperContent.defaultProps.offset;
      PopperContent.defaultProps.offset = [0, 5];
      try {
        render(
          <Tooltip target="tooltip-target" isOpen>
            Content
          </Tooltip>,
        );
        expect(lastPopperProps().modifiers).toContainEqual({
          name: 'offset',
          options: { offset: [0, 5] },
        });
      } finally {
        PopperContent.defaultProps.offset = original;
      }
    });
  });
});
