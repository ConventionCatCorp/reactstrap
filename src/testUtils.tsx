import type { ComponentType, ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { DropdownContext, type DropdownContextValue } from './DropdownContext';

type AnyComponent = ComponentType<any>;

export function testForCustomClass(Component: AnyComponent, props = {}) {
  render(<Component {...props} data-testid="test" className="custom-class" />);
  expect(screen.getByTestId('test')).toHaveClass('custom-class');
}

export function testForCustomTag(
  Component: AnyComponent,
  props = {},
  tag = 'h1',
) {
  render(<Component {...props} tag={tag} data-testid="test" />);
  expect(screen.getByTestId('test').tagName.toLowerCase()).toMatch(tag);
}

export function testForCustomAttribute(Component: AnyComponent, props = {}) {
  render(
    <Component {...props} data-testid="test" custom-attribute="custom-value" />,
  );
  expect(screen.getByTestId('test')).toHaveAttribute(
    'custom-attribute',
    'custom-value',
  );
}

export function testForDefaultTag(Component: AnyComponent, tag: string) {
  render(<Component data-testid="test" />);
  expect(screen.getByTestId('test').tagName.toLowerCase()).toMatch(tag);
}

export function testForDefaultClass(
  Component: AnyComponent,
  className: string,
) {
  render(<Component data-testid="test" />);
  expect(screen.getByTestId('test')).toHaveClass(className);
}

export function testForChildrenInComponent(Component: AnyComponent) {
  render(<Component>Yo!</Component>);
  expect(screen.getByText('Yo!')).toBeInTheDocument();
}

/** Render with a DropdownContext provider. */
export const customDropdownRender = (
  ui: ReactNode,
  providerProps: Partial<DropdownContextValue>,
) =>
  render(
    <DropdownContext.Provider value={providerProps as DropdownContextValue}>
      {ui}
    </DropdownContext.Provider>,
  );
