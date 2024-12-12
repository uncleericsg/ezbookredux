import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { toast } from 'sonner';

interface SubscriptionStep {
  id: string;
  title: string;
  description: string;
}

const steps: SubscriptionStep[] = [
  {
    id: 'payment',
    title: 'Payment',
    description: 'Complete your AMC package payment'
  },
  {
    id: 'activation',
    title: 'Activation',
    description: 'Activate your AMC membership'
  },
  {
    id: 'scheduling',
    title: 'Schedule Service',
    description: 'Book your first maintenance visit'
  }
];

const AMCSubscriptionFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  const handlePaymentSuccess = async () => {
    try {
      setLoading(true);
      
      // Update user status
      await updateUser({
        ...user,
        amcStatus: 'active'
      });

      // Show success message
      toast.success('AMC Package activated successfully!');
      
      // Move to next step
      setCurrentStep(1);
    } catch (error) {
      toast.error('Failed to activate AMC package');
    } finally {
      setLoading(false);
    }
  };

  const handleActivation = async () => {
    try {
      setLoading(true);
      
      // Enable AMC features
      await Promise.all([
        // Update user preferences
        updateUser({
          ...user,
          amcStatus: 'active'
        }),
        // Additional activation tasks...
      ]);

      toast.success('AMC features enabled successfully');
      setCurrentStep(2);
    } catch (error) {
      toast.error('Failed to enable AMC features');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduling = () => {
    navigate('/schedule', { 
      state: { 
        isAMC: true,
        categoryId: 'amc-service'
      }
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-medium text-blue-400">Payment Confirmation</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Complete your payment to activate your AMC package
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handlePaymentSuccess}
              disabled={loading}
              className="w-full btn btn-primary"
            >
              Confirm Payment
            </button>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                <div>
                  <h3 className="font-medium text-green-400">Payment Successful</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Your AMC package has been activated successfully
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleActivation}
              disabled={loading}
              className="w-full btn btn-primary"
            >
              Continue to Activation
            </button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1" />
                <div>
                  <h3 className="font-medium text-yellow-400">Schedule Your First Service</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Book your first maintenance visit to get started with your AMC package
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleScheduling}
              className="w-full btn btn-primary"
            >
              Schedule Service
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="text-sm mt-2 text-center">
                <div className={index <= currentStep ? 'text-gray-200' : 'text-gray-400'}>
                  {step.title}
                </div>
                <div className="text-gray-500 text-xs max-w-[120px]">
                  {step.description}
                </div>
              </div>
            </div>
          ))}

          {/* Progress Line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-700">
            <div
              className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        {renderStep()}
      </div>
    </div>
  );
};

export default AMCSubscriptionFlow;