import logoPng from '@/assets/webp/col-text-logo-light-mode.png';

export function SignUpFormHeader() {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center mb-4">
        <img src={logoPng} alt="Chemistry Logo" className="w-25 h-25 object-contain" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Find Your Balance</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Study partners, business connections, and meaningful relationships—all in one place.
        </p>
      </div>
    </div>
  );
}

