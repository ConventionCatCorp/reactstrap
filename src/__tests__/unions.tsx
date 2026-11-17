// Compile-only: string-union props accept Bootstrap values and reject typos.
import {
  Button,
  Col,
  Container,
  FormText,
  InputGroup,
  List,
  Modal,
  Nav,
  Navbar,
  Placeholder,
  Popover,
  Row,
  Spinner,
  Table,
  Tooltip,
} from '..';

export const ok = (
  <>
    <Button color="primary" size="lg" />
    <Button color="link" size="sm" />
    {/* Custom `$theme-colors` / `$grid-breakpoints` entries stay allowed. */}
    <Button color="brand" />
    <Container fluid="3xl" />
    <Navbar color="dark" expand="md" fixed="top" sticky="bottom" />
    <Navbar expand />
    <Nav horizontal="between" vertical="lg" />
    <Table size="sm" responsive="xxl" />
    <Modal size="xl" fullscreen="xxl" role="alertdialog" />
    <Spinner type="grow" size="sm" color="info" />
    <Placeholder animation="wave" size="xs" xs={6} />
    <List type="unstyled" />
    <FormText color="" />
    <FormText color="muted" />
    <InputGroup size="sm" />
    <Row xs={2} md="auto" />
    <Col xs="auto" md={{ size: 4, order: 'last', offset: 1 }} />
    <Tooltip target="a" trigger="hover focus" />
    <Popover target="a" trigger="legacy" />
  </>
);

export const bad = (
  <>
    {/* @ts-expect-error not a button size */}
    <Button size="md" />
    {/* @ts-expect-error not a modal size */}
    <Modal size="md" />
    {/* @ts-expect-error not a table size */}
    <Table size="lg" />
    {/* @ts-expect-error not a spinner type */}
    <Spinner type="dots" />
    {/* @ts-expect-error not a placeholder animation */}
    <Placeholder animation="pulse" />
    {/* @ts-expect-error not a navbar position */}
    <Navbar fixed="left" />
    {/* @ts-expect-error not a justify-content value */}
    <Nav horizontal="middle" />
    {/* @ts-expect-error not a list type */}
    <List type="ordered" />
    {/* @ts-expect-error not a trigger event */}
    <Tooltip target="a" trigger="hover blur" />
  </>
);
