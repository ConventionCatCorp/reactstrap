// Compile-only: polymorphic `tag` typing.
import type { ReactNode } from 'react';
import { Badge, Button } from '..';

const Link = (props: {
  to: string;
  replace?: boolean;
  children?: ReactNode;
}) => <a href={props.to}>{props.children}</a>;

export const ok = (
  <>
    <Button tag={Link} to="/" replace color="primary" />
    <Button href="/x" />
    <Button tag="a" href="/x" target="_blank" />
    <Button type="submit" onClick={(e) => e.preventDefault()} />
    <Button data-testid="x" aria-label="close" />
    <Button ref={(el: HTMLButtonElement | null) => void el} />
    <Badge tag={Link} to="/" pill />
  </>
);

export const bad = (
  <>
    {/* @ts-expect-error unknown prop */}
    <Button colour="primary" />
    {/* @ts-expect-error `to` is required by Link */}
    <Button tag={Link} />
    {/* @ts-expect-error typo on Link prop */}
    <Button tag={Link} too="/" />
    {/* @ts-expect-error button has no target */}
    <Button target="_blank" />
  </>
);
