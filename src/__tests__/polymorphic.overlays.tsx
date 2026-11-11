// Compile-only: polymorphic `tag` typing for overlays, transitions, accordion, tabs.
import { useRef, type ReactNode } from 'react';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Alert,
  Collapse,
  Fade,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  TabContent,
  TabPane,
  Toast,
  ToastBody,
  ToastHeader,
  UncontrolledAccordion,
  UncontrolledAlert,
  UncontrolledCollapse,
} from '..';

const Link = (props: {
  to: string;
  replace?: boolean;
  children?: ReactNode;
}) => <a href={props.to}>{props.children}</a>;

function Ok() {
  const divRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <Fade tag={Link} to="/" timeout={100} onEntered={(node) => void node} />
      <Fade ref={divRef} data-testid="x" baseClass="b" />
      <Collapse tag={Link} to="/" isOpen horizontal />
      <Collapse tag="ul" isOpen style={{ color: 'red' }} />
      <UncontrolledCollapse tag={Link} to="/" toggler="#t" />
      <Alert tag={Link} to="/" color="danger" toggle={() => {}} />
      <Alert transition={{ timeout: 10, unmountOnExit: true }} />
      <UncontrolledAlert tag={Link} to="/" />
      <Toast tag={Link} to="/" isOpen />
      <ToastBody tag={Link} to="/" />
      <ModalBody tag={Link} to="/" />
      <ModalFooter tag={Link} to="/" />
      <OffcanvasBody tag={Link} to="/" />
      <Accordion tag={Link} to="/" open="1" toggle={() => {}} />
      <UncontrolledAccordion tag={Link} to="/" defaultOpen="1" />
      <AccordionItem tag={Link} to="/" />
      <AccordionHeader tag={Link} to="/" targetId="1" />
      <AccordionBody accordionId="1" tag="section" />
      <TabContent tag={Link} to="/" activeTab="1" />
      <TabPane tag={Link} to="/" tabId="1" />
      <ModalHeader tag="h1" wrapTag="header" toggle={() => {}} />
      <OffcanvasHeader tag="h1" toggle={() => {}} />
      <ToastHeader icon="primary" tag="span" />
      <Modal isOpen modalTransition={{ timeout: 10 }} aria-label="m" />
      <Offcanvas isOpen direction="end" data-testid="o" />
    </>
  );
}

export const bad = (
  <>
    {/* @ts-expect-error `to` is required by Link */}
    <Fade tag={Link} />
    {/* @ts-expect-error typo on Link prop */}
    <Collapse tag={Link} too="/" />
    {/* @ts-expect-error unknown prop */}
    <Collapse isopen />
    {/* @ts-expect-error typo on Link prop */}
    <Alert tag={Link} too="/" />
    {/* @ts-expect-error unknown prop */}
    <Alert colour="danger" />
    {/* @ts-expect-error `to` is required by Link */}
    <Toast tag={Link} />
    {/* @ts-expect-error typo on Link prop */}
    <ModalBody tag={Link} too="/" />
    {/* @ts-expect-error `toggle` is required */}
    <Accordion open="1" />
    {/* @ts-expect-error typo on Link prop */}
    <AccordionHeader tag={Link} too="/" targetId="1" />
    {/* @ts-expect-error typo on Link prop */}
    <TabPane tag={Link} too="/" />
    {/* @ts-expect-error unknown prop */}
    <Modal isopen />
    {/* @ts-expect-error unknown prop */}
    <Offcanvas directon="end" />
    {/* @ts-expect-error unknown prop */}
    <ModalHeader closeAriaLabl="x" />
    {/* @ts-expect-error unknown prop */}
    <AccordionBody accordionId="1" isopen />
  </>
);

export { Ok };
