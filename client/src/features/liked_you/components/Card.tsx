export const Card = ({ 
  children, 
  name = "Suzy Baebae",
  age = 25,
  imageUrl = "https://www.nme.com/wp-content/uploads/2023/10/bae-suzy-retirement-getty-696x442.jpg",
  education = "Studied at Ateneo de Manila",
  previousDecision,
  purposes = [],
  location = "Manila",
  distanceKm = 0
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
}) => {
  const purposeLabels = {
    'study-buddy': 'Study Buddy',
    'date': 'Dating',
    'bizz': 'Networking'
  };
  return (
    <div className="w-full h-[400px] md:h-[450px] bg-foreground rounded-xl relative overflow-hidden flex items-center justify-center">
      {/* Profile Image */}
      <img 
        src={imageUrl} 
        alt="Profile" 
        className="max-h-full max-w-full object-contain bg-black opacity-80"
      />
      
      {/* Previous decision indicator */}
      {previousDecision && (
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${previousDecision === 'matched' ? 'bg-primary text-white' : 'bg-destructive text-white'}`}>
            {previousDecision === 'matched' ? 'previously matched' : 'previously rejected'}
          </span>
        </div>
      )}
      
      {/* Profile Information */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="flex flex-col gap-2 items-start">
          <div className="space-y-2 text-left">
            <p className="text-white">it's</p>
            <h2 className="text-white text-4xl font-bold">{name}, {age}</h2>
          </div>
          <div className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium mb-2">
            {education}
          </div>
          <div className="bg-white/90 text-black px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            {location} ({distanceKm}km)
          </div>
          {/* Purpose badges */}
          {purposes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {purposes.map((purpose) => (
                <div 
                  key={purpose}
                  className="bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                >
                  {purposeLabels[purpose]}
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
