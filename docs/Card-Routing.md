# Card Routing Issue Documentation

## Issue Description
We encountered a validation error in the PowerJet Chemical Wash service booking flow. The error occurred due to incorrect duration parsing logic.

The problematic code:
```javascript
if (!categoryId || (!price && !isAmcService) || !maxDuration) {
  toast.error('Invalid service type selected');
  return;
}
```

The issue was specifically with the duration parsing:
```javascript
parseInt(duration.split('-')[1])
```

For PowerJet Chemical Wash, the duration was formatted as "1 hour 30 minutes", but the code was trying to split on a hyphen (-) which didn't exist in the string.

## Solution
We modified the duration parsing logic to handle the "X hour(s) Y minute(s)" format correctly. The new implementation:

```javascript
// Convert "1 hour 30 minutes" to total minutes
const [hours, minutes] = duration.split(' ');
const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
```

This change ensures:
1. Proper parsing of the duration string
2. Correct calculation of maxDuration
3. Successful validation of the service type

## Impact
The fix resolved the "Invalid service type selected" error and allowed the PowerJet Chemical Wash booking flow to work as intended.

## Best Practices
1. Always validate input formats before parsing
2. Use clear, consistent duration formats across the application
3. Add unit tests for duration parsing logic
4. Consider using a dedicated duration parsing library for complex cases
