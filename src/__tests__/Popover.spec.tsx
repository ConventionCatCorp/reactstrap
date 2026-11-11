import { render, screen } from '@testing-library/react';
import { Popper } from '../popper';
import PopperContent from '../PopperContent';
import Popover from '../Popover';

vi.mock('../popper');

const lastPopperProps = () => vi.mocked(Popper).mock.calls.at(-1)![0];

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

  it('should apply popperClassName to popper component', () => {
    render(
      <Popover target="popover-target" popperClassName="boba-was-here" isOpen>
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
    it('should pass offset [0, 8] to popper', () => {
      render(
        <Popover target="popover-target" isOpen>
          Content
        </Popover>,
      );

      expect(lastPopperProps().modifiers).toContainEqual({
        name: 'offset',
        options: { offset: [0, 8] },
      });
    });

    it('should let an explicit offset win', () => {
      render(
        <Popover target="popover-target" isOpen offset={[1, 2]}>
          Content
        </Popover>,
      );

      expect(lastPopperProps().modifiers).toContainEqual({
        name: 'offset',
        options: { offset: [1, 2] },
      });
    });

    it('should keep offset [0, 8] when PopperContent.defaultProps.offset is patched', () => {
      const original = PopperContent.defaultProps.offset;
      PopperContent.defaultProps.offset = [0, 5];
      try {
        render(
          <Popover target="popover-target" isOpen>
            Content
          </Popover>,
        );
        expect(lastPopperProps().modifiers).toContainEqual({
          name: 'offset',
          options: { offset: [0, 8] },
        });
      } finally {
        PopperContent.defaultProps.offset = original;
      }
    });

    it('should place right with the bs-popover prefix', () => {
      render(
        <Popover target="popover-target" isOpen>
          Content
        </Popover>,
      );

      expect(lastPopperProps().placement).toBe('right');
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
