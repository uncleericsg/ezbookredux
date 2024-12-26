# Path Alias Migration - Tracking Document

## Current Status
- Total files to fix: 27 (verified)
- Files completed: 27
- Files remaining: 0
- Completion: 100%

## Required Changes

### 1. Supabase Client Migration (7 files)
#### Core Change
- Move `src/lib/supabase.ts` → `src/services/supabase/client.ts`
- Done: File moved and working

#### Files to Update
1. `src/lib/supabase.ts`
   - Done: Moved to `src/services/supabase/client.ts`
   - Status: Completed

2. `src/services/paymentService.ts`
   - Done: Updated to `@services/supabase/client`
   - Status: Completed

3. `src/services/checkUserBookingLink.ts`
   - Done: Using shared Supabase client
   - Status: Completed

4. `src/services/migrateBookingTable.ts`
   - Done: Using shared Supabase client
   - Status: Completed

5. `src/services/checkBookingTable.ts`
   - Done: Using shared Supabase client
   - Status: Completed

6. `src/services/checkAddressTable.ts`
   - Done: Using shared Supabase client
   - Status: Completed

7. `src/services/checkSchema.ts`
   - Done: Using shared Supabase client
   - Status: Completed

### 2. UI Utils Path Fix (5 files)
#### Core Change
- Update imports from `@/lib/utils` to `@utils/cn`

#### Files to Update
1. `src/components/ui/textarea.tsx`
   - Done: Using `@utils/cn`
   - Status: Completed

2. `src/components/ui/Dialog.tsx`
   - Done: Using `@utils/cn`
   - Status: Completed

3. `src/components/ui/select.tsx`
   - Done: Using `@utils/cn`
   - Status: Completed

4. `src/components/ui/skeleton.tsx`
   - Done: Using `@utils/cn`
   - Status: Completed

5. `src/components/ui/Tooltip.tsx`
   - Done: Using `@utils/cn`
   - Status: Completed

### 3. Relative Path Fix (1 file)
#### Core Change
- Replace relative path with path alias

#### Files to Update
1. `src/components/admin/UserImport.tsx`
   - Done: Using `@hooks/useRepairShopr`
   - Status: Completed

### 4. CN Utility Migration (14 files)
#### Core Change
- Move `cn` utility from `src/lib/utils.ts` to `src/utils/cn.ts`
- Standardize imports to use `@utils/cn`

#### Files to Update
1. Using `@/lib/utils`:
   - [x] `src/components/ui/button.tsx`
   - [x] `src/components/ui/input.tsx`
   - [x] `src/components/ui/spinner.tsx`
   - [x] `src/components/ui/toast.tsx`
   - [x] `src/components/ui/Switch.tsx`
   - [x] `src/components/ui/Slider.tsx`
   - [x] `src/components/ui/badge.tsx`
   - [x] `src/components/ui/Tooltip.tsx`
   - [x] `src/components/admin/CustomerSettings.tsx`
   - [x] `src/components/admin/BookingSettings.tsx`

2. Using `~/lib/utils`:
   - [x] `src/components/notifications/NotificationTemplates.tsx`
   - [x] `src/components/notifications/NotificationTemplateList.tsx`

3. Using `@lib/utils`:
   - [x] `src/components/booking/BookingSummary.tsx`

4. File Operations:
   - [x] Create: `src/utils/cn.ts`
   - [x] Remove: `src/lib/utils.ts` (after migration complete)

#### Progress
- Total files to update: 15
- Files completed: 15
- Files remaining: 0
- Completion: 100%

#### Implementation Plan
1. **Phase 1: Setup** 
   - Create new `cn.ts` in utils directory
   - Copy existing implementation from `lib/utils.ts`
   - Add necessary imports (clsx, tailwind-merge)

2. **Phase 2: Update Imports**
   - Update UI components first (lowest risk)
   - Update admin components
   - Update notification components
   - Update booking components
   - Verify each component after update

3. **Phase 3: Cleanup**
   - Verify all components are using new import
   - Remove old `lib/utils.ts` file
   - Test all affected components

## Implementation Plan
1. **Phase 1: Supabase Migration** 
   - Move supabase client file
   - Update all service files to use new path
   - Verify database operations still work

2. **Phase 2: UI Utils Update** 
   - Updated textarea.tsx
   - Updated Dialog.tsx
   - Updated select.tsx
   - Updated skeleton.tsx
   - Updated Tooltip.tsx

3. **Phase 3: Relative Path Fix** 
   - Updated UserImport.tsx
   - Verified admin functionality

4. **Phase 4: CN Utility Migration**
   - Setup new `cn.ts` file
   - Update all components to use new import
   - Verify all components are working correctly

## Latest Update
**Last Updated: December 26, 2024, 06:23 SGT**
- Found and updated missed Tooltip component
- Fixed relative path import in Tooltip
- All components now using @utils/cn consistently

### Verification Steps
1. Supabase operations still working
2. UI components render correctly
3. Admin functionality intact
4. No import errors in console
5. All files using correct path aliases
