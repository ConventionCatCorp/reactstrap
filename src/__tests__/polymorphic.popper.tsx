// Compile-only: polymorphic `tag` typing (popper, dropdown, carousel groups).
import type { ReactNode } from 'react';
import {
  ButtonDropdown,
  CarouselItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  PopoverBody,
  PopoverHeader,
  PopperContent,
  UncontrolledButtonDropdown,
  UncontrolledDropdown,
  type PopoverProps,
  type UncontrolledTooltipProps,
} from '..';

const Link = (props: {
  to: string;
  replace?: boolean;
  children?: ReactNode;
}) => <a href={props.to}>{props.children}</a>;
const cond = Math.random() > 0.5;

export const popoverProps: PopoverProps = { target: 'x', isOpen: true };
export const tooltipProps: UncontrolledTooltipProps = { target: 'x' };

export const ok = (
  <>
    <DropdownItem tag={Link} to="/" replace />
    <DropdownItem href="/x" onClick={(e) => e.preventDefault()} />
    <DropdownItem tag="a" href="/x" target="_blank" />
    <DropdownItem ref={(el: HTMLButtonElement | null) => void el} />
    <DropdownToggle tag={Link} to="/" caret />
    <DropdownToggle tag={cond ? 'button' : 'a'} onClick={() => {}} caret />
    <DropdownToggle color="primary" outline size="sm" href="/x" />
    <DropdownToggle nav caret data-testid="x" />
    <DropdownMenu tag="ul" end data-testid="x" />
    <DropdownMenu tag={Link} to="/" />
    <Dropdown tag="li" isOpen toggle={() => {}} />
    <Dropdown tag={Link} to="/" />
    <ButtonDropdown direction="up" isOpen toggle={() => {}} />
    <UncontrolledDropdown tag="li" onToggle={(_e, isOpen) => void isOpen} />
    <UncontrolledButtonDropdown defaultOpen />
    <PopoverBody tag={Link} to="/" />
    <PopoverHeader tag="h5" id="x" />
    <PopperContent tag="span" target="x" id="x">
      x
    </PopperContent>
    <PopperContent tag={Link} to="/" target="x">
      x
    </PopperContent>
    <CarouselItem tag="li" ref={(el: HTMLElement | null) => void el} />
  </>
);

export const bad = (
  <>
    {/* @ts-expect-error typo on Link prop */}
    <DropdownItem tag={Link} too="/" />
    {/* @ts-expect-error `to` is required by Link */}
    <DropdownItem tag={Link} />
    {/* @ts-expect-error unknown prop */}
    <DropdownItem colour="x" />
    {/* @ts-expect-error typo on Link prop */}
    <DropdownToggle tag={Link} too="/" />
    {/* @ts-expect-error unknown prop */}
    <DropdownToggle colour="x" />
    {/* @ts-expect-error typo on DOM prop */}
    <DropdownToggle tag={cond ? 'button' : 'a'} onClik={() => {}} />
    {/* @ts-expect-error typo on Link prop */}
    <DropdownMenu tag={Link} too="/" />
    {/* @ts-expect-error typo on Link prop */}
    <Dropdown tag={Link} too="/" />
    {/* @ts-expect-error unknown prop */}
    <UncontrolledDropdown defaultopen />
    {/* @ts-expect-error unknown prop */}
    <PopoverBody colour="x" />
    {/* @ts-expect-error typo on Link prop */}
    <PopperContent tag={Link} too="/" target="x">
      x
    </PopperContent>
  </>
);

export const badStringTag = (
  <>
    {/* @ts-expect-error typo on DOM prop */}
    <DropdownToggle tag="a" onClik={() => {}} />
    {/* @ts-expect-error typo on DOM prop */}
    <DropdownMenu tag="ul" onClik={() => {}} />
    {/* @ts-expect-error typo on DOM prop */}
    <Dropdown tag="li" onClik={() => {}} />
    {/* @ts-expect-error typo on DOM prop */}
    <UncontrolledDropdown tag="li" onClik={() => {}} />
    {/* @ts-expect-error typo on DOM prop */}
    <PopperContent tag="span" target="x" onClik={() => {}}>
      x
    </PopperContent>
  </>
);
