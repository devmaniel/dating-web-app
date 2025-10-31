import { useState } from 'react';
import { Settings, Camera, Mail } from 'lucide-react';
import { FaMale, FaFemale, FaTransgender, FaBirthdayCake, FaMapMarkerAlt, FaGraduationCap } from 'react-icons/fa';
import { CustomDialog } from './CustomDialog';
import { ChangePasswordModal } from './ChangePasswordModal';
import { Button } from '@/shared/components/ui/button';
import { useUserProfile } from '@/shared/hooks/useUserProfile';
// COMMENTED OUT UNUSED IMPORTS FOR EDIT FUNCTIONALITY
// import { Input } from '@/shared/components/ui/input';
// import { Textarea } from '@/shared/components/ui/textarea';
// import { Edit, Save, X, Lock } from 'lucide-react';

interface AccountSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccountSettingsDialog = ({ open, onOpenChange }: AccountSettingsDialogProps) => {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  
  // Fetch user profile data from API
  const { profile, isLoading, error } = useUserProfile();
  
  // Edit modes - COMMENTED OUT FOR NOW
  // const [isEditingAccount, setIsEditingAccount] = useState(false);
  // const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Helper function to format education display
  const formatEducation = () => {
    if (!profile) return 'Education information not available';
    
    if (profile.program && profile.school) {
      return `${profile.program} at ${profile.school}`;
    }
    
    if (profile.program) return profile.program;
    if (profile.school) return profile.school;
    
    return 'Education information not available';
  };
  
  // Helper function to format music data
  const formatMusicData = () => {
    if (!profile?.music || !Array.isArray(profile.music) || profile.music.length === 0) {
      return [];
    }
    
    return profile.music.map((track: any) => ({
      artist: track.artists?.[0]?.name || track.artist || 'Unknown Artist',
      song: track.name || track.song || 'Unknown Song',
      album: track.albumName || track.album || 'Unknown Album',
      albumCover: track.albumCoverUrl || track.albumCover || null
    }));
  };
  
  // Helper function to get first album cover for vinyl display
  const getFirstAlbumCover = () => {
    const musicData = formatMusicData();
    return musicData.length > 0 ? musicData[0].albumCover : null;
  };
  
  // Helper function to check if user has music
  const hasMusic = () => {
    return profile?.music && Array.isArray(profile.music) && profile.music.length > 0;
  };
  
  // Helper function to get user photos (placeholder for now)
  const getUserPhotos = () => {
    // TODO: Implement photo fetching from UserPhoto API
    // For now, return empty array to show fallback message
    return [];
  };
  
  // Helper function to check if user has photos
  const hasPhotos = () => {
    const photos = getUserPhotos();
    return photos.length > 0;
  };
  
  // Helper function to get cover picture from UserPhoto
  const getCoverPicture = (): string => {
    // DEBUG: Log the profile data to see what we're getting
    console.log('🔍 DEBUG - Full profile data:', profile);
    console.log('🔍 DEBUG - user_photos array:', profile?.user_photos);
    
    // Get cover picture from UserPhoto data
    const coverPhoto = profile?.user_photos?.find(photo => photo.type === 'cover_picture');
    console.log('🔍 DEBUG - Found cover photo:', coverPhoto);
    
    if (coverPhoto?.img_link) {
      console.log('✅ DEBUG - Using cover photo from database:', coverPhoto.img_link);
      return coverPhoto.img_link;
    }
    
    console.log('❌ DEBUG - No cover photo found, using fallback');
    // Fallback to default cover image like Card.tsx component
    return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop";
  };
  
  // Helper function to get profile picture from UserPhoto
  const getProfilePicture = (): string | null => {
    // First check UserPhoto data for profile_picture
    const profilePhoto = profile?.user_photos?.find(photo => photo.type === 'profile_picture');
    console.log('🔍 DEBUG - Found profile photo:', profilePhoto);
    
    if (profilePhoto?.img_link) {
      console.log('✅ DEBUG - Using profile photo from database:', profilePhoto.img_link);
      return profilePhoto.img_link;
    }
    
    // Fallback to profile_picture_url if available
    if (profile?.profile_picture_url) {
      console.log('✅ DEBUG - Using profile_picture_url fallback:', profile.profile_picture_url);
      return profile.profile_picture_url;
    }
    
    console.log('❌ DEBUG - No profile photo found, showing initials');
    // Return null to show initials fallback
    return null;
  };
  
  // Helper function to get user's full name
  const getUserFullName = () => {
    if (!profile) return 'User';
    
    const parts = [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'User';
  };
  
  // Helper function to format birthdate
  const formatBirthdate = () => {
    if (!profile?.birthdate) return 'Not provided';
    
    const date = new Date(profile.birthdate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Helper function to calculate age
  const calculateAge = () => {
    if (!profile?.birthdate) return null;
    
    const today = new Date();
    const birthDate = new Date(profile.birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <CustomDialog 
        open={open} 
        onClose={() => onOpenChange(false)}
        title={
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Account Settings
          </div>
        }
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-sm text-gray-500 ml-4">Loading profile...</p>
        </div>
      </CustomDialog>
    );
  }
  
  // Show error state
  if (error || !profile) {
    return (
      <CustomDialog 
        open={open} 
        onClose={() => onOpenChange(false)}
        title={
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Account Settings
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-700 mb-2 font-semibold">Profile Not Available</p>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            {error || 'Unable to load profile data.'}
          </p>
        </div>
      </CustomDialog>
    );
  }
  
  // Temporary edit data - COMMENTED OUT FOR NOW
  // const [editAccountData, setEditAccountData] = useState(accountData);
  // const [editProfileData, setEditProfileData] = useState(profileData);
  
  // const handleEditAccount = () => {
  //   setEditAccountData(accountData);
  //   setIsEditingAccount(true);
  // };
  
  // const handleSaveAccount = () => {
  //   setAccountData(editAccountData);
  //   setIsEditingAccount(false);
  // };
  
  // const handleCancelAccount = () => {
  //   setEditAccountData(accountData);
  //   setIsEditingAccount(false);
  // };
  
  // const handleEditProfile = () => {
  //   setEditProfileData(profileData);
  //   setIsEditingProfile(true);
  // };
  
  // const handleSaveProfile = () => {
  //   setProfileData(editProfileData);
  //   setIsEditingProfile(false);
  // };
  
  // const handleCancelProfile = () => {
  //   setEditProfileData(profileData);
  //   setIsEditingProfile(false);
  // };

  return (
    <>
      <CustomDialog 
        open={open} 
        onClose={() => onOpenChange(false)}
        title={
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Account Settings
          </div>
        }
      >
        <div className="w-full">
          {/* Cover Photo Section - Facebook Style */}
          <div className="relative -m-6 mb-0">
            {/* Cover Photo */}
            <div className="relative group">
              <div className="w-full h-80 bg-black overflow-hidden flex items-center justify-center">
                <img 
                  src={getCoverPicture()} 
                  alt="Cover" 
                  className="max-h-full max-w-full object-contain bg-black opacity-80"
                />
              </div>
              {/* EDIT COVER BUTTON REMOVED */}
              {/* <button className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-lg p-2 flex items-center gap-2 text-sm font-medium transition-colors">
                <Camera className="w-4 h-4" />
                Edit Cover
              </button> */}
            </div>
            
            {/* Profile Picture - Overlapping Cover */}
            <div className="absolute -bottom-16 left-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-white p-1">
                  <div className="w-full h-full rounded-full bg-secondary overflow-hidden">
                    {getProfilePicture() ? (
                      <img 
                        src={getProfilePicture()!} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <span className="text-gray-600 text-2xl font-bold">
                          {getUserFullName().charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="pt-20 px-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{getUserFullName()}</h1>
              <p className="text-gray-600">{formatEducation()}</p>
            </div>

            {/* Content Sections */}
            <div className="w-full space-y-10">
              {/* Account Information Card */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-light text-muted-foreground">Account Information</p>
                  {/* EDIT FUNCTIONALITY COMMENTED OUT */}
                  {/* {!isEditingAccount ? (
                    <Button variant="outline" size="sm" onClick={handleEditAccount}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Account Information
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleSaveAccount}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleCancelAccount}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )} */}
                </div>
                <div className="bg-secondary/30 rounded-lg p-6 space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground mb-2">Email Address</p>
                      <p className="text-lg text-foreground">{profile.email}</p>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center mt-1">
                      {profile.gender === 'male' ? (
                        <FaMale className="w-4 h-4 text-blue-500" />
                      ) : profile.gender === 'female' ? (
                        <FaFemale className="w-4 h-4 text-pink-500" />
                      ) : (
                        <FaTransgender className="w-4 h-4 text-purple-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground mb-2">Gender</p>
                      <p className="text-lg text-foreground capitalize">{profile.gender || 'Not specified'}</p>
                    </div>
                  </div>

                  {/* Birthdate */}
                  <div className="flex items-start gap-3">
                    <FaBirthdayCake className="w-5 h-5 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground mb-2">Birthdate</p>
                      <p className="text-lg text-foreground">
                        {formatBirthdate()}
                        {calculateAge() && (
                          <span className="text-muted-foreground ml-2">({calculateAge()} years old)</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="w-5 h-5 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground mb-2">Location</p>
                      <p className="text-lg text-foreground">{profile.location || 'Not specified'}</p>
                    </div>
                  </div>

                  {/* School/Education */}
                  <div className="flex items-start gap-3">
                    <FaGraduationCap className="w-5 h-5 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground mb-2">Education</p>
                      <p className="text-lg text-foreground">{formatEducation()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Information Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-light text-muted-foreground">Profile Information</p>
                  {/* EDIT FUNCTIONALITY COMMENTED OUT */}
                  {/* {!isEditingProfile ? (
                    <Button variant="outline" size="sm" onClick={handleEditProfile}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile Information
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleSaveProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleCancelProfile}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )} */}
                </div>

                {/* 1. About Me */}
                <div className="space-y-2">
                  <p className="text-light text-muted-foreground">About Me</p>
                  <h3 className="text-2xl">{profile.about_me || 'No information provided'}</h3>
                  {/* EDIT MODE COMMENTED OUT */}
                  {/* {!isEditingProfile ? (
                    <h3 className="text-2xl">{profileData.aboutMe}</h3>
                  ) : (
                    <Textarea
                      value={editProfileData.aboutMe}
                      onChange={(e) => setEditProfileData({...editProfileData, aboutMe: e.target.value})}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="resize-none"
                    />
                  )} */}
                </div>

                {/* 2. Interests */}
                <div className="space-y-2">
                  <p className="text-light text-muted-foreground">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {(profile.interests || []).map((interest: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-foreground rounded-full border border-gray-800">
                        <span>{interest === 'Music' ? '🎵' : interest === 'Photography' ? '📸' : '🍳'}</span>
                        <span className="text-sm font-medium text-background">{interest}</span>
                      </div>
                    ))}
                    {(!profile.interests || profile.interests.length === 0) && (
                      <p className="text-muted-foreground">No interests added</p>
                    )}
                  </div>
                  {/* EDIT MODE COMMENTED OUT */}
                  {/* {!isEditingProfile ? (
                    <div className="flex flex-wrap gap-2">
                      {profileData.interests.map((interest, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-foreground rounded-full border border-gray-800">
                          <span>{interest === 'Music' ? '🎵' : interest === 'Photography' ? '📸' : '🍳'}</span>
                          <span className="text-sm font-medium text-background">{interest}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Input
                      value={editProfileData.interests.join(', ')}
                      onChange={(e) => setEditProfileData({
                        ...editProfileData, 
                        interests: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      })}
                      placeholder="Enter interests separated by commas (e.g., Music, Photography, Cooking)"
                    />
                  )} */}
                </div>

                {/* 3. Looking For */}
                <div className="space-y-2">
                  <p className="text-light text-muted-foreground">Looking for?</p>
                  <div className="bg-muted-foreground w-full rounded-lg p-5">
                    <div className="bg-white w-full p-3 rounded-lg">
                      <h3 className="text-center text-black font-bold text-xl">
                        {profile.looking_for || 'Not specified'}
                      </h3>
                    </div>
                  </div>
                  {/* EDIT MODE COMMENTED OUT */}
                  {/* {!isEditingProfile ? (
                    <div className="bg-muted-foreground w-full rounded-lg p-5">
                      <div className="bg-white w-full p-3 rounded-lg">
                        <h3 className="text-center text-black font-bold text-xl">
                          {profileData.lookingFor}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <Input
                      value={editProfileData.lookingFor}
                      onChange={(e) => setEditProfileData({...editProfileData, lookingFor: e.target.value})}
                      placeholder="What are you looking for?"
                    />
                  )} */}
                </div>

                {/* 4. Music - Matching ProfileMusic UI */}
                <div className="space-y-2">
                  <p className="text-light text-gray-600">Onto Music</p>
                  {hasMusic() ? (
                    <div className="w-full flex flex-col gap-5 justify-center">
                      {/* First track with vinyl display */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center w-full">
                          {getFirstAlbumCover() ? (
                            <div className="relative">
                              <div className="bg-gray-600 h-72 w-72 rounded-sm"></div>
                              <img
                                src={getFirstAlbumCover()}
                                alt="Album Cover"
                                className="absolute inset-0 w-72 h-72 object-cover rounded-sm"
                              />
                            </div>
                          ) : (
                            <div className="bg-gray-600 h-72 w-72 rounded-sm"></div>
                          )}
                          <img
                            src="/src/assets/png/half-vinyl.png"
                            alt="Vinyl Record"
                            className="h-64 object-contain"
                          />
                        </div>

                        <div className="flex flex-col justify-center items-center text-center w-96">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mb-2">
                            <span className="text-primary-foreground font-bold text-sm">1</span>
                          </div>
                          <p className="text-light text-muted-foreground">{formatMusicData()[0]?.artist || "Unknown Artist"}</p>
                          <h3 className="text-2xl">{formatMusicData()[0]?.song || "Unknown Song"}</h3>
                          <p className="text-light text-muted-foreground">{formatMusicData()[0]?.album || "Unknown Album"}</p>
                        </div>
                      </div>

                      {/* Remaining tracks with numbering */}
                      {formatMusicData().length > 1 && (
                        <div className="space-y-2 w-full">
                          {formatMusicData().slice(1).map((track, index) => (
                            <div key={index} className="bg-foreground text-background flex items-center p-4 w-full rounded-sm">
                              {/* Number indicator */}
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-4">
                                <span className="text-primary-foreground font-bold text-sm">{index + 2}</span>
                              </div>
                              
                              <div className="flex gap-3">
                                {track.albumCover ? (
                                  <img
                                    src={track.albumCover}
                                    alt="Album Cover"
                                    className="w-28 h-28 rounded object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="bg-gray-600 w-28 h-28 rounded-sm flex-shrink-0"></div>
                                )}
                                <div className="space-y-1 flex justify-center flex-col">
                                  <h1 className="text-sm">{track.artist}</h1>
                                  <h1 className="text-lg font-semibold">{track.song}</h1>
                                  <p className="text-sm">{track.album}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-center py-12">
                      <p className="text-muted-foreground text-center">
                        Music: "You still don't have any music added"
                      </p>
                    </div>
                  )}
                  {/* EDIT MODE COMMENTED OUT */}
                  {/* {!isEditingProfile ? (
                    <div className="w-full flex flex-col gap-5 justify-center">
                      <div className="flex items-center">
                        <div className="bg-gray-600 h-72 w-72 rounded-sm"></div>
                        <img
                          src="/src/assets/png/half-vinyl.png"
                          alt="Vinyl Record"
                          className="h-64 object-contain"
                        />
                      </div>

                      <div className="space-y-2 w-full">
                        {profileData.music.map((track, index) => (
                          <div key={index} className="bg-foreground text-white p-4 w-full rounded-sm">
                            <div className="flex gap-3">
                              <div className="bg-gray-600 w-28 h-20 rounded-sm"></div>
                              <div className="space-y-1">
                                <h1 className="text-sm">{track.artist}</h1>
                                <h1 className="text-lg font-semibold">{track.song}</h1>
                                <p className="text-sm">{track.album}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {editProfileData.music.map((track, index) => (
                        <div key={index} className="grid grid-cols-3 gap-3">
                          <Input
                            value={track.artist}
                            onChange={(e) => {
                              const newMusic = [...editProfileData.music];
                              newMusic[index] = { ...newMusic[index], artist: e.target.value };
                              setEditProfileData({ ...editProfileData, music: newMusic });
                            }}
                            placeholder="Artist name"
                          />
                          <Input
                            value={track.song}
                            onChange={(e) => {
                              const newMusic = [...editProfileData.music];
                              newMusic[index] = { ...newMusic[index], song: e.target.value };
                              setEditProfileData({ ...editProfileData, music: newMusic });
                            }}
                            placeholder="Song title"
                          />
                          <Input
                            value={track.album}
                            onChange={(e) => {
                              const newMusic = [...editProfileData.music];
                              newMusic[index] = { ...newMusic[index], album: e.target.value };
                              setEditProfileData({ ...editProfileData, music: newMusic });
                            }}
                            placeholder="Album name"
                          />
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newMusic = [...editProfileData.music, { artist: '', song: '', album: '' }];
                          setEditProfileData({ ...editProfileData, music: newMusic });
                        }}
                      >
                        Add Song
                      </Button>
                    </div>
                  )} */}
                </div>

                {/* 5. Album - CSS Masonry Layout */}
                <div className="space-y-4">
                  <p className="text-light text-muted-foreground">Album</p>
                  {hasPhotos() ? (
                    <div className="columns-2 gap-3 space-y-3">
                      {getUserPhotos().map((photo: string, index: number) => (
                        <div key={index} className="relative group break-inside-avoid mb-3">
                          <div className="w-full bg-secondary rounded overflow-hidden border-2 border-border">
                            <img
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        </div>
                      ))}
                      <div className="relative group break-inside-avoid mb-3">
                        <div className="w-full bg-secondary rounded overflow-hidden border-2 border-border h-32 flex items-center justify-center group hover:bg-secondary/80 transition-colors cursor-pointer">
                          <Camera className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-center py-12">
                      <p className="text-muted-foreground text-center">
                        Album: "You still don't have any album added"
                      </p>
                    </div>
                  )}
                  {/* EDIT MODE COMMENTED OUT */}
                  {/* {!isEditingProfile ? (
                    <div className="columns-2 gap-3 space-y-3">
                      {profileData.photos.map((photo, index) => (
                        <div key={index} className="relative group break-inside-avoid mb-3">
                          <div className="w-full bg-secondary rounded overflow-hidden border-2 border-border">
                            <img
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        </div>
                      ))}
                      <div className="relative group break-inside-avoid mb-3">
                        <div className="w-full bg-secondary rounded overflow-hidden border-2 border-border h-32 flex items-center justify-center group hover:bg-secondary/80 transition-colors cursor-pointer">
                          <Camera className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {editProfileData.photos.map((photo, index) => (
                          <div key={index} className="space-y-2">
                            <Input
                              value={photo}
                              onChange={(e) => {
                                const newPhotos = [...editProfileData.photos];
                                newPhotos[index] = e.target.value;
                                setEditProfileData({ ...editProfileData, photos: newPhotos });
                              }}
                              placeholder="Photo URL"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newPhotos = editProfileData.photos.filter((_, i) => i !== index);
                                setEditProfileData({ ...editProfileData, photos: newPhotos });
                              }}
                              className="w-full text-red-600 hover:text-red-700"
                            >
                              Remove Photo
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newPhotos = [...editProfileData.photos, ''];
                          setEditProfileData({ ...editProfileData, photos: newPhotos });
                        }}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Add Photo
                      </Button>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomDialog>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </>
  );
};
