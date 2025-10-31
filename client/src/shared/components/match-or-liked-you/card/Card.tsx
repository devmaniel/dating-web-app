import { FaBook, FaHeart, FaUsers } from 'react-icons/fa';
import React from 'react';

export const Card = ({ 
  children, 
  name = "Suzy Baebae",
  age = 25,
  imageUrl = "https://www.nme.com/wp-content/uploads/2023/10/bae-suzy-retirement-getty-696x442.jpg",
  education = "Studied at Ateneo de Manila",
  previousDecision,
  purposes = [],
  location = "Manila",
  distanceKm = 0,
  gender,
  school,
  program
}: { 
  children?: React.ReactNode;
  name?: string;
  age?: number;
  imageUrl?: string;
  education?: string;
  previousDecision?: 'rejected' | 'matched' | null;
  purposes?: Array<'study-buddy' | 'date' | 'bizz'>;
  location?: string;
  distanceKm?: number;
  gender?: 'male' | 'female' | 'nonbinary';
  school?: string;
  program?: string;
}) => {
  const purposeConfig = {
    'study-buddy': { label: 'Looking for a Study Buddy', icon: <FaBook className="inline mr-1" /> },
    'date': { label: 'Looking for Dating', icon: <FaHeart className="inline mr-1" /> },
    'bizz': { label: 'Looking for Networking', icon: <FaUsers className="inline mr-1" /> }
  };

  const genderLabels = {
    'male': 'Male',
    'female': 'Female',
    'nonbinary': 'Non-binary'
  };

  // Determine what to display: if school/program provided, use those; otherwise fall back to education
  const hasEducationDetails = school || program;
  
  // Extract city from location (first part before comma)
  const cityOnly = location ? location.split(',')[0].trim() : location;
  
  return (
    <div className="w-full h-[400px] md:h-[450px] bg-foreground rounded-xl relative overflow-hidden flex items-center justify-center">
      {/* Profile Image */}
      <img 
        src={imageUrl} 
        alt="Profile" 
        className="max-h-full max-w-full object-contain bg-black opacity-80"
      />
      
      {/* Profile Information */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="flex flex-col gap-3 items-start">
          {/* Name and Age */}
          <div className="space-y-2 text-left">
            <p className="text-white text-sm">it's</p>
            <h2 className="text-white text-4xl font-bold">{name}, {age}</h2>
          </div>

          {/* Top Row: Gender + Location */}
          <div className="flex flex-wrap gap-2 w-full">
            {gender && (
              <div className="bg-white/80 text-black px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                {genderLabels[gender]}
              </div>
            )}
            <div className="bg-white/80 text-black px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
              {cityOnly} ({distanceKm}km)
            </div>
          </div>

          {/* Education Details Row */}
          {hasEducationDetails && (
            <div className="flex flex-wrap gap-2 w-full">
              {program && (
                <div className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium">
                  {program}
                </div>
              )}
              {school && (
                <div className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium">
                  {school}
                </div>
              )}
            </div>
          )}

          {/* Fallback to education string if no details */}
          {!hasEducationDetails && education && (
            <div className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium">
              {education}
            </div>
          )}

          {/* Purpose badges */}
          {purposes.length > 0 && (
            <div className="flex flex-wrap gap-2 w-full">
              {purposes.map((purpose) => (
                <div 
                  key={purpose}
                  className="bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm flex items-center"
                >
                  {purposeConfig[purpose].icon}
                  {purposeConfig[purpose].label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {children}
    </div>
  );
};
