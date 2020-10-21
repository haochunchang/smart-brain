import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const ProfileIcon = ({ onRouteChange, toggleModal }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    return (
        <div className="pa4 tc">
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle
                    tag="span"
                    data-toggle="dropdown"
                    aria-expanded={dropdownOpen}
                >
                    <img
                        src="http://tachyons.io/img/logo.jpg"
                        className="br-100 h3 w3 dib" alt="avatar" 
                    />
                </DropdownToggle>
                <DropdownMenu className="b--transparent shadow-5" right>
                    <DropdownItem onClick={toggleModal}>View Profile</DropdownItem>
                    <DropdownItem onClick={() => onRouteChange("signout")}>Sign Out</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    )
}

export default ProfileIcon;