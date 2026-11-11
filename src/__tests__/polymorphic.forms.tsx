// Compile-only: polymorphic `tag` typing for form/nav/breadcrumb/pagination components.
import type { ChangeEvent, ReactNode } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  NavbarText,
  NavbarToggler,
  Pagination,
  PaginationItem,
  PaginationLink,
} from '..';

const Link = (props: {
  to: string;
  replace?: boolean;
  children?: ReactNode;
}) => <a href={props.to}>{props.children}</a>;

export const ok = (
  <>
    <Form tag={Link} to="/" />
    <Form onSubmit={(e) => e.preventDefault()} noValidate />
    <FormFeedback tag={Link} to="/" valid tooltip />
    <FormGroup tag="fieldset" disabled check />
    <FormGroup tag={Link} to="/" row />
    <FormText tag={Link} to="/" color="danger" />
    <Input type="email" placeholder="x" bsSize="sm" invalid />
    <Input type="select" multiple>
      <option>1</option>
    </Input>
    <Input ref={(el: HTMLInputElement | null) => void el} />
    <Input tag={Link} to="/" />
    <InputGroup size="lg" tag={Link} to="/" />
    <InputGroup type="dropdown" isOpen toggle={() => {}} />
    <InputGroupText tag={Link} to="/" />
    <Label for="x" sm={2} md={{ size: 4, offset: 1 }} check />
    <Label tag={Link} to="/" hidden />
    <Nav tag={Link} to="/" tabs vertical="md" />
    <NavItem tag={Link} to="/" active />
    <NavLink href="#" active disabled onClick={(e) => e.preventDefault()} />
    <NavLink tag={Link} to="/" replace active />
    <Navbar tag={Link} to="/" expand="md" container={false} dark />
    <NavbarBrand tag={Link} to="/" />
    <NavbarBrand href="/" />
    <NavbarText tag={Link} to="/" />
    <NavbarToggler tag={Link} to="/" />
    <NavbarToggler onClick={() => {}} />
    <Breadcrumb tag={Link} to="/" listTag="div" listClassName="x" />
    <BreadcrumbItem tag={Link} to="/" active />
    <Pagination size="sm" aria-label="x" tag="main" listTag="div" />
    <PaginationItem tag={Link} to="/" active disabled />
    <PaginationLink tag={Link} to="/" previous />
    <PaginationLink href="/x" next target="_blank" />
  </>
);

export const bad = (
  <>
    {/* @ts-expect-error unknown prop */}
    <FormGroup chek />
    {/* @ts-expect-error form has no href */}
    <Form href="/" />
    {/* @ts-expect-error unknown type */}
    <Input type="txt" />
    {/* @ts-expect-error `to` is required by Link */}
    <Input tag={Link} />
    {/* @ts-expect-error typo on Link prop */}
    <InputGroup tag={Link} too="/" />
    {/* @ts-expect-error unknown prop */}
    <Label colour="x" />
    {/* @ts-expect-error unknown prop */}
    <Nav tab />
    {/* @ts-expect-error typo on Link prop */}
    <NavLink tag={Link} too="/" />
    {/* @ts-expect-error `to` is required by Link */}
    <NavbarBrand tag={Link} />
    {/* @ts-expect-error unknown prop */}
    <Breadcrumb lisTag="ul" />
    {/* @ts-expect-error `to` is required by Link */}
    <PaginationLink tag={Link} />
    {/* @ts-expect-error typo on Link prop */}
    <PaginationLink tag={Link} too="/" next />
    {/* @ts-expect-error unknown prop */}
    <PaginationItem activ />
    {/* @ts-expect-error unknown prop */}
    <Pagination sise="sm" />
  </>
);

// `type` picks the element's attributes and event types.
export const inputByType = (
  <>
    <Input type="textarea" rows={5} onChange={(e) => e.currentTarget.value} />
    <Input
      type="select"
      multiple
      onChange={(e) => Array.from(e.currentTarget.selectedOptions)}
    />
    <Input type="checkbox" onChange={(e) => e.currentTarget.checked} />
    {/* @ts-expect-error `rows` is a textarea attribute */}
    <Input type="text" rows={5} />
  </>
);

declare const isLong: boolean;

// Non-literal `type`: attributes of every possible element, events on the element union.
export const inputMixed = (
  <>
    <Input
      type={isLong ? 'textarea' : 'text'}
      rows={isLong ? 15 : undefined}
      onChange={(e) => e.currentTarget.value}
    />
    {/* React handler types are bivariant, so input-typed handlers still fit the union */}
    <Input
      type={isLong ? 'textarea' : 'text'}
      onChange={(e: ChangeEvent<HTMLInputElement>) => e.currentTarget.value}
    />
  </>
);
