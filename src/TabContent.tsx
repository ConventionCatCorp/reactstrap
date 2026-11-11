import { useMemo, type ElementType } from 'react';
import classNames from 'classnames';
import { TabContext } from './TabContext';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface TabContentOwnProps {
  /** `tabId` of the active `TabPane` */
  activeTab?: number | string;
  className?: string;
  cssModule?: CSSModule;
}

export type TabContentProps<T extends ElementType = 'div'> =
  TabContentOwnProps & PolymorphicExtras<TabContentOwnProps, T>;

function TabContent<T extends ElementType = 'div'>({
  activeTab,
  className,
  cssModule,
  tag,
  ...attributes
}: TabContentProps<T>) {
  const Tag: ElementType = tag ?? 'div';
  const classes = mapToCssModules(
    classNames('tab-content', className),
    cssModule,
  );
  const context = useMemo(() => ({ activeTabId: activeTab }), [activeTab]);

  return (
    <TabContext.Provider value={context}>
      <Tag {...attributes} className={classes} />
    </TabContext.Provider>
  );
}

export default TabContent;
