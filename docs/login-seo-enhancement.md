# Login Page SEO Enhancement Plan

## 1. Meta Tags & Document Head
```tsx
// Add to index.html or through React Helmet
<title>Login - iAircon Easy Booking | Air Conditioning Services</title>
<meta name="description" content="Login to iAircon Easy Booking for hassle-free air conditioning services. New customers get special offers, or sign in to manage your bookings." />
<meta name="keywords" content="aircon service, air conditioning, booking system, Singapore aircon" />
<meta property="og:title" content="Login - iAircon Easy Booking" />
<meta property="og:description" content="Access Singapore's premier air conditioning service platform. Book services or manage your account." />
<meta property="og:type" content="website" />
```

## 2. Semantic HTML Improvements

### A. Current Structure
```tsx
<div className="min-h-screen">
  <div className="content">
    <div className="panels">
```

### B. Enhanced Structure
```tsx
<main className="min-h-screen" role="main">
  <header className="welcome-section" role="banner">
    <h1>Welcome to iAircon Easy Booking</h1>
  </header>
  <section className="login-panels" aria-label="Login Options">
```

## 3. Accessibility Enhancements

### A. ARIA Labels
```tsx
// Video Background
<div aria-hidden="true">
  <video />
</div>

// Form Elements
<form aria-label="Customer Login Form">
<input aria-label="Mobile Number" />
<button aria-label="Send OTP" />
```

### B. Focus Management
```tsx
// Add focus styles
const focusStyles = {
  ring: "focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD700]",
  outline: "focus:outline-none",
  visible: "focus-visible:ring-2"
}
```

## 4. Performance Optimizations

### A. Image Optimization
```tsx
// Logo optimization
<img
  src="/logo.png"
  alt="iAircon Easy Booking Logo"
  width="64"
  height="64"
  loading="eager"
  fetchPriority="high"
/>
```

### B. Video Background
```tsx
// Optimize video loading
<video
  preload="auto"
  poster="/video-poster.jpg"
  aria-hidden="true"
>
```

## 5. Content Structure

### A. Main Sections
```tsx
<main>
  <header>
    <h1>Welcome to iAircon Easy Booking</h1>
    <p>Singapore's Premier Air Conditioning Service Platform</p>
  </header>

  <section>
    <h2>First Time Customer</h2>
    <p>Experience hassle-free air conditioning services with our easy booking system.</p>
    {/* CTAs */}
  </section>

  <section>
    <h2>Returning Customer</h2>
    <p>Welcome back! Sign in to manage your bookings and services.</p>
    {/* Login Form */}
  </section>
</main>
```

### B. Rich Snippets
```tsx
// Add JSON-LD
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "iAircon Easy Booking Login",
  "description": "Access Singapore's premier air conditioning service platform",
  "provider": {
    "@type": "LocalBusiness",
    "name": "iAircon Services",
    "areaServed": "Singapore"
  }
}
</script>
```

## 6. Implementation Steps

1. Meta Tags
- [ ] Add React Helmet integration
- [ ] Implement dynamic meta tags
- [ ] Add Open Graph tags

2. Semantic HTML
- [ ] Update component structure
- [ ] Add proper heading hierarchy
- [ ] Implement semantic sections

3. Accessibility
- [ ] Add ARIA labels
- [ ] Enhance keyboard navigation
- [ ] Improve focus management

4. Performance
- [ ] Optimize images
- [ ] Add loading strategies
- [ ] Implement video optimizations

5. Content
- [ ] Add structured data
- [ ] Enhance content hierarchy
- [ ] Implement rich snippets

## 7. Success Metrics

1. Technical SEO
- Improved Lighthouse SEO score
- Better accessibility score
- Faster loading times

2. Content SEO
- Clear heading hierarchy
- Rich snippets implementation
- Proper meta descriptions

3. Accessibility
- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader support

## 8. Notes

1. Preserve Current Functionality
- Maintain all existing features
- Keep current styling
- Preserve user experience

2. Progressive Enhancement
- Add SEO features gradually
- Test each enhancement
- Monitor performance impact