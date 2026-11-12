import { act, fireEvent, render, screen } from '@testing-library/react';
import { lastFloating, middleware } from '../testUtils';
import FloatingContent from '../FloatingContent';
import Tooltip from '../Tooltip';

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

  it('should apply floatingClassName to the floating element', () => {
    render(
      <Tooltip target="tooltip-target" floatingClassName="boba-was-here" isOpen>
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

      expect(lastFloating().placement).toBe('top');
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

    it('should use the FloatingContent default offset', () => {
      render(
        <Tooltip target="tooltip-target" isOpen>
          Content
        </Tooltip>,
      );

      expect(middleware('offset')?.options).toEqual(
        FloatingContent.defaultProps.offset,
      );
    });

    it('should honor a patched FloatingContent.defaultProps.offset', () => {
      const original = FloatingContent.defaultProps.offset;
      FloatingContent.defaultProps.offset = 5;
      try {
        render(
          <Tooltip target="tooltip-target" isOpen>
            Content
          </Tooltip>,
        );
        expect(middleware('offset')?.options).toEqual(5);
      } finally {
        FloatingContent.defaultProps.offset = original;
      }
    });
  });
});
