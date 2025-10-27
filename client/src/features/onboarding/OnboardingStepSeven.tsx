import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoveRight, X, ImageUpIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useFileUpload } from '@/shared/hooks/use-file-upload';
import { onboardingStepSevenSchema, type OnboardingStepSevenFormData } from './schemas/onboardingStepSevenSchema';
import { OnboardingLayout } from './components';

export interface OnboardingStepSevenFormProps {
  onSubmit?: (data: OnboardingStepSevenFormData) => void;
  onBack?: () => void;
  initialData?: OnboardingStepSevenFormData;
}

export function OnboardingStepSeven({ onSubmit, onBack, initialData }: OnboardingStepSevenFormProps = {}) {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;

  const [
    { files, isDragging, errors: uploadErrors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
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
      photos: initialData?.photos ?? [],
    },
  });

  // Sync files from useFileUpload to form
  useEffect(() => {
    const fileObjects = files.map(f => f.file as File);
    setValue('photos', fileObjects, { shouldValidate: true });
  }, [files, setValue]);

  const handleFormSubmit = async (data: OnboardingStepSevenFormData) => {
    try {
      console.log('Onboarding Step 7 data:', data);
      onSubmit?.(data);
    } catch (err) {
      console.error('Onboarding error:', err);
    }
  };

  const isFormValid = files.length >= 2 && !isSubmitting;

  return (
    <OnboardingLayout currentStep={7}>
      <div className="space-y-6 animate-in fade-in duration-500">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Show your best self</h2>
            <p className="text-sm text-muted-foreground mt-2">Add at least 2 photos—profiles with photos get 10x more matches</p>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Upload Area - Only show if less than 6 files */}
            {files.length < 6 && (
              <div className="relative">
                <div
                  role="button"
                  onClick={openFileDialog}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  data-dragging={isDragging || undefined}
                  className="relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border p-4 transition-colors hover:bg-muted data-[dragging=true]:bg-muted data-[dragging=true]:border-primary cursor-pointer"
                >
                  <input
                    {...getInputProps({ multiple: true })}
                    className="sr-only"
                    aria-label="Upload photos"
                  />
                  <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                    <div
                      className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-background"
                      aria-hidden="true"
                    >
                      <ImageUpIcon className="size-4 opacity-60" />
                    </div>
                    <p className="mb-1.5 text-sm font-medium text-foreground">
                      Drop your images here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Max size: {maxSizeMB}MB per image • Up to 6 images
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Photos Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-normal text-foreground">Photos</h3>
                <span className="text-sm text-muted-foreground">
                  {files.length} / 6
                </span>
              </div>
              
              {/* Error Messages under Photos header */}
              {errors.photos && (
                <p className="text-sm text-red-600">{errors.photos.message}</p>
              )}
              {uploadErrors.length > 0 && (
                <p className="text-sm text-red-600">{uploadErrors[0]}</p>
              )}

              {/* Photo Grid - Only show if there are files */}
              {files.length > 0 && (
                <div className="columns-2 gap-3 space-y-3">
                  {files.map((fileWithPreview) => (
                    <div key={fileWithPreview.id} className="relative group break-inside-avoid mb-3">
                      <div className="w-full bg-secondary rounded overflow-hidden border-2 border-border">
                        {fileWithPreview.preview && (
                          <img
                            src={fileWithPreview.preview}
                            alt={fileWithPreview.file.name}
                            className="w-full h-auto object-cover"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(fileWithPreview.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-primary/70 hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-200"
                      >
                        <X className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end items-center gap-4 pt-4">
              <Button
                type="button"
                onClick={onBack}
                variant="ghost"
                className="h-14 px-8 bg-secondary text-foreground rounded-full text-base font-medium hover:bg-secondary/80 transition-all duration-200"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid}
                className="h-14 px-8 bg-primary text-primary-foreground rounded-full text-base font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center justify-center gap-2 [&_svg]:!size-6"
              >
                Next
                <MoveRight strokeWidth={2.5} />
              </Button>
            </div>
          </form>
        </div>
    </OnboardingLayout>
  );
}
