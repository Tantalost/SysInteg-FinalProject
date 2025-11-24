import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Ratings from '../components/Ratings.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { facilityIcons } from '../assets/assets.js';

const CheckBox = ({ label, selected = false, onChange = () => { } }) => {
    return (
        <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
            <input type="checkbox" checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
            <span className='font-light select-none'>{label}</span>
        </label>
    );
};

const RadioButton = ({ label, selected = false, onChange = () => { } }) => {
    return (
        <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
            <input type="radio" name="sortOption" checked={selected} onChange={() => onChange(label)} />
            <span className='font-light select-none'>{label}</span>
        </label>
    );
};

const Services = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { properties, currency } = useAppContext();
    const navigate = useNavigate();
    const [openFilters, setOpenFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        roomTypes: [],
        priceRanges: [],
    });
    const [selectedSort, setSelectedSort] = useState('');

    const roomTypes = [
        'Gaming Room',
        'Movie Room',
        'KTV Room',
    ];

    const priceRanges = [
        '0 to 500',
        '500 to 1000',
        '1000 to 2000',
    ];

    const sortOptions = [
        'Price Low to High',
        'Price High to Low',
        'Newest First',
    ];

    const handleFilterChange = (checked, value, type) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            if (checked) {
                updatedFilters[type].push(value);
            } else {
                updatedFilters[type] = updatedFilters[type].filter(item => item !== value);
            }
            return updatedFilters;
        });
    };

    const handleSortChange = (sortOption) => {
        setSelectedSort(sortOption);
    };

    const matchesRoomType = (property) => (
        selectedFilters.roomTypes.length === 0 ||
        selectedFilters.roomTypes.includes(property.roomType)
    );

    const matchesPriceRange = (property) => (
        selectedFilters.priceRanges.length === 0 ||
        selectedFilters.priceRanges.some(range => {
            const [min, max] = range.split(' to ').map(Number);
            return property.pricePerHour >= min && property.pricePerHour <= max;
        })
    );

    const sortRooms = (a, b) => {
        if (selectedSort === 'Price Low to High') {
            return a.pricePerHour - b.pricePerHour;
        }
        if (selectedSort === 'Price High to Low') {
            return b.pricePerHour - a.pricePerHour;
        }
        if (selectedSort === 'Newest First') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
    };

    const filterRoomType = (property) => {
        const roomType = searchParams.get('roomType');
        if (!roomType) return true;
        return property.roomType.toLowerCase().includes(roomType.toLowerCase());
    };

    const filteredRooms = useMemo(() => {
        return properties
            .filter(item =>
                matchesRoomType(item) &&
                matchesPriceRange(item) &&
                filterRoomType(item)
            )
            .sort(sortRooms);
    }, [properties, selectedFilters, selectedSort, searchParams]);

    const clearFilters = () => {
        setSelectedFilters({
            roomTypes: [],
            priceRanges: [],
        });
        setSelectedSort('');
        setSearchParams({});
    };

    return (
        <div className='flex flex-col-reverse lg:flex-row items-start gap-10 pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            <div>
                <div className='flex flex-col items-start text-left'>
                    <h1 className='font-playfair text-4xl md:text-[40px]'>Our Services</h1>
                    <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>
                        Explore our immersive themed rooms and curated amenities designed to elevate every stay.
                    </p>
                </div>

                {filteredRooms.map((room) => (
                    <div key={room._id} className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0'>
                        <img
                            onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0); }}
                            src={room.images[0]}
                            alt="roomImg"
                            title='View Room Details'
                            className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer'
                        />

                        <div className='md:w-1/2 flex flex-col gap-2'>
                            <p
                                onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0); }}
                                className='text-gray-800 text-3xl font-playfair cursor-pointer'
                            >
                                {room.name}
                            </p>
                            <div className='flex items-center'>
                                <Ratings />
                                <p className='ml-2'>200+ reviews</p>
                            </div>
                            <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                                {room.amenities.map((item, index) => (
                                    <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'>
                                        <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                        <p className='text-xs'>{item}</p>
                                    </div>
                                ))}
                            </div>
                            <p className='text-xl font-medium text-gray-700'>₱{room.pricePerHour} /hour</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16'>
                <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters && 'border-b'}`}>
                    <p className='text-base font-medium text-gray-800'>FILTERS</p>
                    <div className='text-xs cursor-pointer'>
                        <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden'>
                            {openFilters ? 'HIDE' : 'SHOW'}
                        </span>
                        <span className='hidden lg:block' onClick={clearFilters}>CLEAR</span>
                    </div>
                </div>

                <div className={`${openFilters ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
                    <div className='px-5 pt-5'>
                        <p className='font-medium text-gray-800 pb-2'>Popular filters</p>
                        {roomTypes.map((room, index) => (
                            <CheckBox
                                key={index}
                                label={room}
                                selected={selectedFilters.roomTypes.includes(room)}
                                onChange={(checked) => handleFilterChange(checked, room, 'roomTypes')}
                            />
                        ))}
                    </div>
                    <div className='px-5 pt-5'>
                        <p className='font-medium text-gray-800 pb-2'>Price Range</p>
                        {priceRanges.map((range, index) => (
                            <CheckBox
                                key={index}
                                label={`${currency} ${range}`}
                                selected={selectedFilters.priceRanges.includes(range)}
                                onChange={(checked) => handleFilterChange(checked, range, 'priceRanges')}
                            />
                        ))}
                    </div>
                    <div className='px-5 pt-5 pb-7'>
                        <p className='font-medium text-gray-800 pb-2'>Sort By</p>
                        {sortOptions.map((option, index) => (
                            <RadioButton
                                key={index}
                                label={option}
                                selected={selectedSort === option}
                                onChange={() => handleSortChange(option)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;

