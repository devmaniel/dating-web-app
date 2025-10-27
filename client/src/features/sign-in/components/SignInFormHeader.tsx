import logoPng from '@/assets/webp/col-text-logo-light-mode.png';

export function SignInFormHeader() {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center mb-4">
        <img src={logoPng} alt="Chemistry Logo" className="w-25 h-25 object-contain" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Your connections are waiting. Let's continue building something meaningful.
        </p>
      </div>
    </div>
  );
}

