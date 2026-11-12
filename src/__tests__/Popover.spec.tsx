import { render, screen } from '@testing-library/react';
import { lastFloating, middleware } from '../testUtils';
import FloatingContent from '../FloatingContent';
import Popover from '../Popover';

describe('Popover', () => {
  let element: HTMLDivElement;
  beforeEach(() => {
    element = document.createElement('div');
    element.setAttribute('id', 'popover-target');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should apply floatingClassName to the floating element', () => {
    render(
      <Popover target="popover-target" floatingClassName="boba-was-here" isOpen>
        Bo-Katan Kryze
      </Popover>,
    );

    expect(screen.queryByText('Bo-Katan Kryze')?.parentElement).toHaveClass(
      'popover show boba-was-here',
    );
  });

  it('should apply arrowClassName to arrow', () => {
    render(
      <Popover target="popover-target" arrowClassName="boba-was-here" isOpen>
        Bo-Katan Kryze
      </Popover>,
    );

    expect(document.querySelector('.arrow')).toHaveClass('boba-was-here');
  });

  // Regression: React 19 ignores defaultProps on function components.
  describe('defaults', () => {
    it('should default offset to 8', () => {
      render(
        <Popover target="popover-target" isOpen>
          Content
        </Popover>,
      );

      expect(middleware('offset')?.options).toEqual(8);
    });

    it('should let an explicit offset win', () => {
      render(
        <Popover
          target="popover-target"
          isOpen
          offset={{ mainAxis: 2, crossAxis: 1 }}
        >
          Content
        </Popover>,
      );

      expect(middleware('offset')?.options).toEqual({
        mainAxis: 2,
        crossAxis: 1,
      });
    });

    it('should keep offset 8 when FloatingContent.defaultProps.offset is patched', () => {
      const original = FloatingContent.defaultProps.offset;
      FloatingContent.defaultProps.offset = 5;
      try {
        render(
          <Popover target="popover-target" isOpen>
            Content
          </Popover>,
        );
        expect(middleware('offset')?.options).toEqual(8);
      } finally {
        FloatingContent.defaultProps.offset = original;
      }
    });

    it('should place right with the bs-popover prefix', () => {
      render(
        <Popover target="popover-target" isOpen>
          Content
        </Popover>,
      );

      expect(lastFloating().placement).toBe('right');
      expect(screen.getByText('Content').parentElement).toHaveClass(
        'bs-popover-auto',
      );
    });

    it('should toggle on target click (trigger "click")', () => {
      const toggle = vi.fn();
      vi.useFakeTimers();
      try {
        render(
          <Popover target="popover-target" toggle={toggle}>
            Content
          </Popover>,
        );
        element.click();
        vi.runAllTimers();
        expect(toggle).toHaveBeenCalledTimes(1);
      } finally {
        vi.useRealTimers();
      }
    });
  });
});
