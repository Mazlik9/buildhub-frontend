import React from 'react';

const ProfileHeader = ({ 
  onLogoClick, 
  onSearchChange,
  searchQuery 
}) => {
  return (
    <div className="w-full">
      {/* Оранжевая полоса */}
      <div className="w-full h-[75px] bg-[#ef6c1a] flex items-center justify-between px-[150px]">
        {/* Логотип и название */}
        <button 
          onClick={onLogoClick}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <div className="w-[52px] h-[50px] rounded-[9px] bg-[#d9d9d9]" />
          <p className="text-xl font-bold text-white">BUILDHUB</p>
        </button>
        
        {/* Поле поиска */}
        <div className="w-[659px] h-[52px] rounded-[20px] bg-[#f4f6f5] flex items-center px-4">
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={onSearchChange}
            className="w-full bg-transparent border-none outline-none text-base placeholder-gray-500"
          />
        </div>
        
        {/* Иконки */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-[#d9d9d9] cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center">
            <span className="text-xs text-gray-700">1</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#d9d9d9] cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center">
            <span className="text-xs text-gray-700">2</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#d9d9d9] cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center">
            <span className="text-xs text-gray-700">3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;