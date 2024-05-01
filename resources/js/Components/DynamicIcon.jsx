import React from 'react';
import { Icon } from '@rsuite/icons';
import * as TotalIcons from '@rsuite/icons';
const DynamicIcon = ({ icon }) => {
    icon = icon.trim().replace('Icon','');
    const IconComponent = TotalIcons[icon];
    if (!IconComponent) {
        return null;
    }
    return <Icon as={IconComponent} />;
};
export default DynamicIcon;
