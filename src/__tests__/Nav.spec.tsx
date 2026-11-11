import { render } from '@testing-library/react';
import { Nav } from '..';
import {
  testForChildrenInComponent,
  testForCustomClass,
  testForCustomTag,
  testForDefaultClass,
} from '../testUtils';

describe('Nav', () => {
  it('should render .nav markup', () => {
    testForDefaultClass(Nav, 'nav');
  });

  it('should render custom tag', () => {
    testForCustomTag(Nav);
  });

  it('should render children', () => {
    testForChildrenInComponent(Nav);
  });

  it('should handle justified prop', () => {
    const { container } = render(<Nav justified />);
    expect(container).toContainHTML('<ul class="nav nav-justified"></ul>');
  });

  it('should handle fill prop', () => {
    const { container } = render(<Nav fill />);
    expect(container).toContainHTML('<ul class="nav nav-fill"></ul>');
  });

  it('should handle pills prop', () => {
    const { container } = render(<Nav pills />);
    expect(container).toContainHTML('<ul class="nav nav-pills"></ul>');
  });

  it('should handle pills prop with card prop', () => {
    const { container } = render(<Nav pills card />);
    expect(container).toContainHTML(
      '<ul class="nav nav-pills card-header-pills"></ul>',
    );
  });

  it('should handle tabs prop', () => {
    const { container } = render(<Nav tabs />);
    expect(container).toContainHTML('<ul class="nav nav-tabs"></ul>');
  });

  it('should handle tabs prop with card prop', () => {
    const { container } = render(<Nav tabs card />);
    expect(container).toContainHTML(
      '<ul class="nav nav-tabs card-header-tabs"></ul>',
    );
  });

  it('should handle vertical prop', () => {
    const { container } = render(<Nav vertical />);
    expect(container).toContainHTML('<ul class="nav flex-column"></ul>');
  });

  it('should handle vertical prop with string', () => {
    const { container } = render(<Nav vertical="sm" />);
    expect(container).toContainHTML('<ul class="nav flex-sm-column"></ul>');
  });

  it('should handle horizontal prop with string', () => {
    const { container } = render(<Nav horizontal="end" />);
    expect(container).toContainHTML(
      '<ul class="nav justify-content-end"></ul>',
    );
  });

  it('should pass additional classNames', () => {
    testForCustomClass(Nav);
  });

  it('should render .navbar-nav class only', () => {
    const { container } = render(<Nav navbar>Children</Nav>);
    expect(container).toContainHTML('<ul class="navbar-nav">Children</ul>');
  });
});
