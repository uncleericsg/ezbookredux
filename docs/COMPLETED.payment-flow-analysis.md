# Payment Flow Analysis

## Current Flow Analysis (December 24, 2024)

### Booking Flow Sequence
1. Customer Form Submission
   ```typescript
   // Customer data structure
   {
     firstName: 'jane',
     lastName: 'jane',
     email: 'janedoe@jane.com',
     mobile: '9187 4498',
     floorUnit: '1111'
   }
   ```

2. Schedule Selection
   - Date: December 24, 2024
   - Time Slot: 14:00
   - Booking ID Generated: 'xtxGzVzt96wShQsIxwiw'

### Issue Identification
1. Double Component Mount
   ```typescript
   // Console shows duplicate mounting
   PaymentStep mounted with booking data: {
     customerInfo: {...},
     bookingId: 'xtxGzVzt96wShQsIxwiw',
     selectedService: {...},
     scheduledDateTime: Tue Dec 24 2024 14:00:00 GMT+0800,
     scheduledTimeSlot: '14:00'
   }
   ```

2. Missing Guard Clauses
   - Current version lacks protection against duplicate payment intent creation
   - Each mount triggers validation and payment intent creation

### Solution Components

1. Guard Clause Implementation
   ```typescript
   useEffect(() => {
     // Guard against duplicate payment intents
     if (paymentState.clientSecret) {
       console.log('Payment intent already exists, skipping initialization');
       return;
     }

     const validateBookingData = () => {...};
     // Rest of initialization
   }, [bookingData?.selectedService?.id, bookingData?.selectedService?.price, bookingData?.bookingId]);
   ```

2. Stripe API Integration
   ```typescript
   // Proper Stripe payment intent creation
   const paymentIntent = await stripe.paymentIntents.create({
     amount: Math.round(amount + tipAmount),
     currency: currency.toLowerCase(),
     automatic_payment_methods: {
       enabled: true,
     },
     metadata: {
       serviceId,
       bookingId,
       customerId: customerId || '',
       tipAmount: tipAmount.toString(),
       baseAmount: amount.toString(),
       firebase_booking_id: bookingId
     }
   });
   ```

3. Supabase Integration
   ```typescript
   // Payment record creation in Supabase
   const { error: dbError } = await supabase
     .from('payments')
     .insert([{
       id: paymentUuid,
       payment_intent_id: paymentIntent.id,
       amount: Math.round(amount + tipAmount),
       currency: currency.toLowerCase(),
       status: 'pending',
       customer_id: customerId || null,
       service_id: serviceId
     }]);
   ```

4. Success Handler
   ```typescript
   const handlePaymentSuccess = useCallback(async (paymentIntent: any) => {
     try {
       console.log('Payment success handler started', { paymentIntent });
       
       // Update payment status
       await dispatch(setPaymentStatus('processing'));
       
       // Update Supabase payment record
       await supabase
         .from('payments')
         .update({ status: 'succeeded' })
         .eq('payment_intent_id', paymentIntent.id);

       setPaymentState((prev) => ({
         ...prev,
         status: PAYMENT_STATES.SUCCESS,
       }));

       // Complete the payment
       await handlePaymentComplete(paymentIntent.id);
     } catch (error) {
       console.error('Error in payment success handler:', error);
       toast.error('Error completing payment. Please contact support.');
     }
   }, [dispatch, handlePaymentComplete]);
   ```

### Implementation Steps

1. Add Guard Clauses
   - Prevent duplicate payment intent creation
   - Add proper logging for skipped initializations

2. Optimize Dependencies
   - Use specific dependencies instead of entire objects
   - Prevent unnecessary re-renders

3. Enhance Error Handling
   - Add detailed error logging
   - Implement proper error recovery

4. Improve State Management
   - Clear state transitions
   - Proper loading state handling

### Testing Points

1. Payment Flow
   - Verify single payment intent creation
   - Check proper state transitions

2. Database Integration
   - Confirm Supabase record creation
   - Verify status updates

3. Error Scenarios
   - Test network failures
   - Verify error recovery

### Next Steps

1. Implementation
   - Add guard clauses
   - Update success handler
   - Enhance error handling

2. Testing
   - Test complete payment flow
   - Verify database records
   - Check error scenarios

3. Monitoring
   - Add comprehensive logging
   - Track payment intent creation
   - Monitor state transitions
