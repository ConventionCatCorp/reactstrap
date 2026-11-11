import { useState } from 'react';
import {
  Dropdown,
  DropdownMenu,
  DropdownToggle,
} from '@conventioncatcorp/reactstrap';

function Example() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle
        tag="span"
        data-toggle="dropdown"
        aria-expanded={dropdownOpen}
      >
        Custom Dropdown Content
      </DropdownToggle>
      <DropdownMenu>
        <button type="button" className="btn btn-link" onClick={toggle}>
          Custom dropdown item
        </button>
        <button type="button" className="btn btn-link" onClick={toggle}>
          Custom dropdown item
        </button>
        <button type="button" className="btn btn-link" onClick={toggle}>
          Custom dropdown item
        </button>
        <button type="button" className="btn btn-link" onClick={toggle}>
          Custom dropdown item
        </button>
      </DropdownMenu>
    </Dropdown>
  );
}

export default Example;
