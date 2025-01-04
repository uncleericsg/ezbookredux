import { lazy, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

// Lazy load all components
const ChemWashHeroSection = lazy(() => import('./components/ChemWashHeroSection'));
const ChemWashServiceGrid = lazy(() => import('./components/ChemWashServiceGrid'));
const ChemOverhaulServiceGrid = lazy(() => import('./components/ChemOverhaulServiceGrid'));
const AdditionalServices = lazy(() => import('./components/AdditionalServices'));
const ChemWashKeyFeatures = lazy(() => import('./components/ChemWashKeyFeatures'));
const Testimonials = lazy(() => import('./components/Testimonials'));

const PowerJetChemWashHome: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const autoFocus = searchParams.get('autoFocus') === 'true';

  const handleBookNow = () => {
    toast.success('Booking confirmed for PowerJet Chemical Wash');
    console.log('Booking details:', {
      serviceType: 'powerjet-chemical',
      price: 150,
      duration: 90
    });
  };

  return (
    <div className="w-full bg-gradient-to-b from-indigo-950 via-purple-950 to-gray-950 min-h-screen py-10 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <Suspense 
          fallback={
            <div className="text-center animate-pulse">
              <div className="h-12 bg-gray-700 rounded w-3/4 mx-auto mb-6"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          }
        >
          <ChemWashHeroSection />
        </Suspense>

        {/* Chemical Wash Packages Section */}
        <div className="mb-20">
          <Suspense 
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="rounded-xl p-6 md:p-8 shadow-2xl backdrop-blur-sm bg-gray-800/80 border border-gray-700/50 animate-pulse"
                  >
                    <div className="h-8 bg-gray-700 rounded w-3/4 mb-6"></div>
                    <div className="h-10 bg-gray-700 rounded w-1/2 mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <ChemWashServiceGrid />
          </Suspense>
        </div>

        {/* Chemical Overhaul Packages Section */}
        <div className="mb-20">
          <Suspense 
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="rounded-xl p-6 md:p-8 shadow-2xl backdrop-blur-sm bg-gray-800/80 border border-gray-700/50 animate-pulse"
                  >
                    <div className="h-8 bg-gray-700 rounded w-3/4 mb-6"></div>
                    <div className="h-10 bg-gray-700 rounded w-1/2 mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <ChemOverhaulServiceGrid />
          </Suspense>
        </div>

        {/* Additional Services Section */}
        <Suspense 
          fallback={
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-gray-800 rounded-xl"></div>
                ))}
              </div>
            </div>
          }
        >
          <AdditionalServices />
        </Suspense>

        {/* Key Features Section */}
        <Suspense 
          fallback={
            <div className="animate-pulse space-y-8 mt-20">
              <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-800 rounded-xl"></div>
                ))}
              </div>
            </div>
          }
        >
          <ChemWashKeyFeatures />
        </Suspense>

        {/* Testimonials Section */}
        <Suspense 
          fallback={
            <div className="animate-pulse space-y-8 mt-20">
              <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 bg-gray-800 rounded-xl"></div>
                ))}
              </div>
            </div>
          }
        >
          <Testimonials />
        </Suspense>
      </div>
    </div>
  );
};

export default PowerJetChemWashHome;
