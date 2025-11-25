import React from 'react';
import { 
    FaWifi, 
    FaUtensils, 
    FaConciergeBell, 
    FaMountain, 
    FaSwimmingPool,
    FaSnowflake,
    FaPlug,
    FaBath,
    FaLock,
    FaWineBottle,
    FaLightbulb,
    FaHeadset
} from 'react-icons/fa';

const AmenityIcon = ({ amenity, className = 'w-5 h-5' }) => {
    const iconMap = {
        'Free Wifi': FaWifi,
        'Free WiFi': FaWifi,
        'Free Breakfast': FaUtensils,
        'Room Service': FaConciergeBell,
        'Mountain View': FaMountain,
        'Pool Access': FaSwimmingPool,
        'Air Conditioning': FaSnowflake,
        'Charging Station (USB-C / Fast Charge)': FaPlug,
        'Private Bathroom Access': FaBath,
        'CCTV Security / Smart Lock': FaLock,
        'Mini Bar': FaWineBottle,
        'Customizable Lighting': FaLightbulb,
        '24/7 Support Staff': FaHeadset,
    };

    const IconComponent = iconMap[amenity];
    
    if (!IconComponent) {
        return null;
    }

    return <IconComponent className={className} />;
};

export default AmenityIcon;

