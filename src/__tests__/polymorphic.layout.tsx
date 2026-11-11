// Compile-only: polymorphic `tag` typing for layout/content components.
import type { ReactNode } from 'react';
import {
  ButtonGroup,
  ButtonToggle,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  CardImg,
  CardImgOverlay,
  CardLink,
  CardSubtitle,
  CardText,
  CardTitle,
  CloseButton,
  Col,
  Container,
  List,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  ListInlineItem,
  Placeholder,
  PlaceholderButton,
  Progress,
  Row,
  Spinner,
  Table,
} from '..';

const Link = (props: {
  to: string;
  replace?: boolean;
  children?: ReactNode;
}) => <a href={props.to}>{props.children}</a>;

export const ok = (
  <>
    <ButtonGroup tag={Link} to="/" size="sm" />
    <ButtonToolbar tag={Link} to="/" />
    <ButtonToggle tag={Link} to="/" defaultValue color="primary" />
    <ButtonToggle onBlur={() => {}} type="submit" />
    <Card tag={Link} to="/" body inverse />
    <CardBody tag={Link} to="/" />
    <CardFooter tag={Link} to="/" />
    <CardGroup tag={Link} to="/" />
    <CardHeader tag="h5" />
    <CardImg src="/x.png" alt="" top />
    <CardImg tag={Link} to="/" />
    <CardImgOverlay tag={Link} to="/" />
    <CardLink href="/x" target="_blank" />
    <CardLink tag={Link} to="/" replace />
    <CardSubtitle tag="h6" />
    <CardText tag={Link} to="/" />
    <CardTitle tag="h5" />
    <CloseButton variant="white" onClick={() => {}} />
    <CloseButton ref={(el: HTMLButtonElement | null) => void el} />
    <Col tag={Link} to="/" xs={6} md={{ size: 4, offset: 2 }} />
    <Container tag={Link} to="/" fluid="md" />
    <List tag="ol" type="unstyled" />
    <ListGroup tag={Link} to="/" flush />
    <ListGroupItem tag={Link} to="/" action active />
    <ListGroupItem tag="a" href="/x" target="_blank" />
    <ListGroupItemHeading tag={Link} to="/" />
    <ListGroupItemText tag={Link} to="/" />
    <ListInlineItem tag={Link} to="/" />
    <Placeholder tag={Link} to="/" xs={6} animation="glow" />
    <PlaceholderButton xs={6} color="success" />
    <PlaceholderButton tag={Link} to="/" xs={6} />
    <Progress tag={Link} to="/" value={50} />
    <Row tag={Link} to="/" md={2} />
    <Spinner tag={Link} to="/" color="primary" />
    <Table tag={Link} to="/" striped responsive="md" />
    <Table ref={(el: HTMLTableElement | null) => void el} />
  </>
);

export const bad = (
  <>
    {/* @ts-expect-error unknown prop */}
    <Card colour="primary" />
    {/* @ts-expect-error `to` is required by Link */}
    <Col tag={Link} />
    {/* @ts-expect-error typo on Link prop */}
    <Row tag={Link} too="/" />
    {/* @ts-expect-error typo on Link prop */}
    <ListGroupItem tag={Link} too="/" />
    {/* @ts-expect-error typo on Link prop */}
    <ButtonToggle tag={Link} too="/" />
    {/* @ts-expect-error typo on Link prop */}
    <PlaceholderButton tag={Link} too="/" />
    {/* @ts-expect-error unknown prop */}
    <PlaceholderButton colour="primary" />
    {/* @ts-expect-error unknown prop */}
    <CloseButton colour="primary" />
    {/* @ts-expect-error div has no href */}
    <Container href="/x" />
    {/* @ts-expect-error img has no target */}
    <CardImg target="_blank" />
  </>
);
