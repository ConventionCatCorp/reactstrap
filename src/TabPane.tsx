import { useContext, type ElementType } from 'react';
import classNames from 'classnames';
import { TabContext } from './TabContext';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface TabPaneOwnProps {
  className?: string;
  cssModule?: CSSModule;
  /** Id matched against `TabContent`'s `activeTab` */
  tabId?: number | string;
}

export type TabPaneProps<T extends ElementType = 'div'> = TabPaneOwnProps &
  PolymorphicExtras<TabPaneOwnProps, T>;

function TabPane<T extends ElementType = 'div'>({
  className,
  cssModule,
  tabId,
  tag,
  ...attributes
}: TabPaneProps<T>) {
  const Tag: ElementType = tag ?? 'div';
  const { activeTabId } = useContext(TabContext);
  const classes = mapToCssModules(
    classNames('tab-pane', className, { active: tabId === activeTabId }),
    cssModule,
  );

  return <Tag {...attributes} className={classes} />;
}

export default TabPane;
