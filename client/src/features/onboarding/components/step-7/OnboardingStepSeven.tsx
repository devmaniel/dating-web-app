import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoveRight, X, ImageUpIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useFileUpload } from '@/shared/hooks/use-file-upload';
import { onboardingStepSevenSchema, type OnboardingStepSevenFormData } from '../../schemas/onboardingStepSevenSchema';
import { OnboardingLayout } from '..';

export interface OnboardingStepSevenFormProps {
  onSubmit?: (data: OnboardingStepSevenFormData) => void;
  onBack?: () => void;
  initialData?: OnboardingStepSevenFormData;
}

export function OnboardingStepSeven({ onSubmit, onBack, initialData }: OnboardingStepSevenFormProps = {}) {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;

  // Card Preview Upload Hook
  const [
    { files: cardPreviewFiles, isDragging: isCardPreviewDragging, errors: cardPreviewErrors },
    {
      handleDragEnter: handleCardPreviewDragEnter,
      handleDragLeave: handleCardPreviewDragLeave,
      handleDragOver: handleCardPreviewDragOver,
      handleDrop: handleCardPreviewDrop,
      openFileDialog: openCardPreviewDialog,
      removeFile: removeCardPreviewFile,
      getInputProps: getCardPreviewInputProps,
    },
  ] = useFileUpload({
    accept: 'image/*',
    maxSize,
    multiple: false,
    maxFiles: 1,
    allowDuplicates: false,
  });

  // PFP Upload Hook
  const [
    { files: pfpFiles, isDragging: isPfpDragging, errors: pfpErrors },
    {
      handleDragEnter: handlePfpDragEnter,
      handleDragLeave: handlePfpDragLeave,
      handleDragOver: handlePfpDragOver,
      handleDrop: handlePfpDrop,
      openFileDialog: openPfpDialog,
      removeFile: removePfpFile,
      getInputProps: getPfpInputProps,
    },
  ] = useFileUpload({
    accept: 'image/*',
    maxSize,
    multiple: false,
    maxFiles: 1,
    allowDuplicates: false,
  });

  // Albums Upload Hook
  const [
    { files: albumFiles, isDragging: isAlbumDragging, errors: albumErrors },
    {
      handleDragEnter: handleAlbumDragEnter,
      handleDragLeave: handleAlbumDragLeave,
      handleDragOver: handleAlbumDragOver,
      handleDrop: handleAlbumDrop,
      openFileDialog: openAlbumDialog,
      removeFile: removeAlbumFile,
      getInputProps: getAlbumInputProps,
    },
  ] = useFileUpload({
    accept: 'image/*',
    maxSize,
    multiple: true,
    maxFiles: 6,
    allowDuplicates: true,
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingStepSevenFormData>({
    resolver: zodResolver(onboardingStepSevenSchema),
    mode: 'onChange',
    defaultValues: {
      cardPreview: initialData?.cardPreview,
      pfp: initialData?.pfp,
      albums: initialData?.albums ?? [],
    },
  });

  // Sync card preview from useFileUpload to form
  useEffect(() => {
    if (cardPreviewFiles.length > 0) {
      setValue('cardPreview', cardPreviewFiles[0].file as File, { shouldValidate: true });
    }
  }, [cardPreviewFiles, setValue]);

  // Sync PFP from useFileUpload to form
  useEffect(() => {
    if (pfpFiles.length > 0) {
      setValue('pfp', pfpFiles[0].file as File, { shouldValidate: true });
    }
  }, [pfpFiles, setValue]);

  // Sync albums from useFileUpload to form
  useEffect(() => {
    const fileObjects = albumFiles.map(f => f.file as File);
    setValue('albums', fileObjects, { shouldValidate: true });
  }, [albumFiles, setValue]);

  const handleFormSubmit = async (data: OnboardingStepSevenFormData) => {
    try {
      console.log('Onboarding Step 7 data:', data);
      onSubmit?.(data);
    } catch (err) {
      console.error('Onboarding error:', err);
    }
  };

  const isFormValid = cardPreviewFiles.length === 1 && pfpFiles.length === 1 && !isSubmitting;

  return (
    <OnboardingLayout currentStep={7}>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
          {/* Header */}
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-bold text-foreground tracking-tight">Show your best self</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Upload your card preview, profile picture, and optional album photos
            </p>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10">
            {/* Card Preview Section */}
            <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-foreground">Card Preview</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Required
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">This will be displayed on your profile card instead of PFP</p>
                </div>
                {cardPreviewFiles.length === 1 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    ✓ Uploaded
                  </span>
                )}
              </div>
              
              {(errors.cardPreview || cardPreviewErrors.length > 0) && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.cardPreview?.message || cardPreviewErrors[0]}
                  </p>
                </div>
              )}

              {cardPreviewFiles.length === 0 ? (
                <div
                  role="button"
                  onClick={openCardPreviewDialog}
                  onDragEnter={handleCardPreviewDragEnter}
                  onDragLeave={handleCardPreviewDragLeave}
                  onDragOver={handleCardPreviewDragOver}
                  onDrop={handleCardPreviewDrop}
                  data-dragging={isCardPreviewDragging || undefined}
                  className="relative flex min-h-64 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 transition-all duration-300 hover:bg-muted/50 hover:border-primary/50 data-[dragging=true]:bg-primary/10 data-[dragging=true]:border-primary cursor-pointer group"
                >
                  <input
                    {...getCardPreviewInputProps({ multiple: false })}
                    className="sr-only"
                    aria-label="Upload card preview"
                  />
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border-2 border-border bg-background shadow-sm group-hover:border-primary/50 transition-colors">
                      <ImageUpIcon className="size-7 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-foreground">
                        Upload Card Preview
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click or drag & drop
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground bg-background/80 px-3 py-1 rounded-full">
                      Max {maxSizeMB}MB • JPG, PNG
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="w-full bg-secondary rounded-xl overflow-hidden border-2 border-border shadow-lg">
                    {cardPreviewFiles[0].preview && (
                      <img
                        src={cardPreviewFiles[0].preview}
                        alt="Card preview"
                        className="w-full h-auto object-cover"
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCardPreviewFile(cardPreviewFiles[0].id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>

            {/* PFP Section */}
            <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-foreground">Profile Picture (PFP)</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Required
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Your profile picture for your account</p>
                </div>
                {pfpFiles.length === 1 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    ✓ Uploaded
                  </span>
                )}
              </div>
              
              {(errors.pfp || pfpErrors.length > 0) && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.pfp?.message || pfpErrors[0]}
                  </p>
                </div>
              )}

              {pfpFiles.length === 0 ? (
                <div className="flex justify-center py-4">
                  <div className="w-72 h-72">
                    <div
                      role="button"
                      onClick={openPfpDialog}
                      onDragEnter={handlePfpDragEnter}
                      onDragLeave={handlePfpDragLeave}
                      onDragOver={handlePfpDragOver}
                      onDrop={handlePfpDrop}
                      data-dragging={isPfpDragging || undefined}
                      className="relative flex w-full h-full flex-col items-center justify-center overflow-hidden rounded-full border-3 border-dashed border-border bg-muted/30 p-6 transition-all duration-300 hover:bg-muted/50 hover:border-primary/50 data-[dragging=true]:bg-primary/10 data-[dragging=true]:border-primary cursor-pointer group"
                    >
                      <input
                        {...getPfpInputProps({ multiple: false })}
                        className="sr-only"
                        aria-label="Upload profile picture"
                      />
                      <div className="flex flex-col items-center justify-center text-center space-y-3">
                        <div className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background shadow-sm group-hover:border-primary/50 transition-colors">
                          <ImageUpIcon className="size-7 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-base font-semibold text-foreground">
                            Upload Profile Picture
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Click or drag & drop
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground bg-background/80 px-3 py-1 rounded-full">
                          Max {maxSizeMB}MB • JPG, PNG
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center py-4">
                  <div className="relative group w-72 h-72">
                    <div className="w-full h-full bg-secondary rounded-full overflow-hidden border-4 border-border shadow-lg">
                      {pfpFiles[0].preview && (
                        <img
                          src={pfpFiles[0].preview}
                          alt="Profile picture"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removePfpFile(pfpFiles[0].id)}
                      className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Albums Section */}
            <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-foreground">Albums</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground">
                      Optional
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Extra photos to showcase more of yourself (up to 6)</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    albumFiles.length > 0
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {albumFiles.length} / 6 uploaded
                  </span>
                </div>
              </div>
              
              {(errors.albums || albumErrors.length > 0) && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.albums?.message || albumErrors[0]}
                  </p>
                </div>
              )}

              {/* Upload Area - Only show if less than 6 files */}
              {albumFiles.length < 6 && (
                <div
                  role="button"
                  onClick={openAlbumDialog}
                  onDragEnter={handleAlbumDragEnter}
                  onDragLeave={handleAlbumDragLeave}
                  onDragOver={handleAlbumDragOver}
                  onDrop={handleAlbumDrop}
                  data-dragging={isAlbumDragging || undefined}
                  className="relative flex min-h-48 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 transition-all duration-300 hover:bg-muted/50 hover:border-primary/50 data-[dragging=true]:bg-primary/10 data-[dragging=true]:border-primary cursor-pointer group"
                >
                  <input
                    {...getAlbumInputProps({ multiple: true })}
                    className="sr-only"
                    aria-label="Upload album photos"
                  />
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border-2 border-border bg-background shadow-sm group-hover:border-primary/50 transition-colors">
                      <ImageUpIcon className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-foreground">
                        Upload Album Photos
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click or drag & drop multiple images
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground bg-background/80 px-3 py-1 rounded-full">
                      Max {maxSizeMB}MB per image • JPG, PNG
                    </p>
                  </div>
                </div>
              )}

              {/* Photo Grid - Masonry Layout */}
              {albumFiles.length > 0 && (
                <div className="columns-2 gap-3 space-y-3">
                  {albumFiles.map((fileWithPreview, index) => (
                    <div key={fileWithPreview.id} className="relative group break-inside-avoid mb-3">
                      <div className="w-full bg-secondary rounded overflow-hidden border-2 border-border">
                        {fileWithPreview.preview && (
                          <img
                            src={fileWithPreview.preview}
                            alt={`Album photo ${index + 1}`}
                            className="w-full h-auto object-cover"
                          />
                        )}
                      </div>
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full">
                        {index + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAlbumFile(fileWithPreview.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6">
              <Button
                type="button"
                onClick={onBack}
                variant="ghost"
                className="h-12 px-6 rounded-full text-base font-medium"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid}
                className="h-12 px-8 bg-primary text-primary-foreground rounded-full text-base font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                Continue
                <MoveRight strokeWidth={2.5} className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
    </OnboardingLayout>
  );
}
