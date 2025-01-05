export const loginPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "iAircon Easy Booking Login",
  "description": "Access Singapore's premier air conditioning service platform. New customers get special offers, or sign in to manage your bookings.",
  "url": "https://iaircon.app/login",
  "provider": {
    "@type": "LocalBusiness",
    "name": "iAircon Singapore Aircon Services",
    "description": "Professional air conditioning services in Singapore",
    "image": "https://iaircon.app/logo.png",
    "telephone": "+65 9187 4498",
    "email": "iairconsg@gmail.com",
    "priceRange": "$$",
    "currencyAccepted": "SGD",
    "areaServed": {
      "@type": "City",
      "name": "Singapore"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Professional Aircon Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "PowerJet Chemical Wash",
            "description": "Premium chemical wash using PowerJet technology for deep cleaning",
            "category": "Cleaning Service",
            "serviceType": "Premium",
            "offers": {
              "@type": "Offer",
              "priceSpecification": {
                "@type": "PriceSpecification",
                "priceCurrency": "SGD",
                "price": "From 120.00"
              }
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Gas Top-up & Leak Repair",
            "description": "Professional gas leak detection and repair with quality refrigerant top-up",
            "category": "Repair Service",
            "serviceType": "Essential",
            "offers": {
              "@type": "Offer",
              "priceSpecification": {
                "@type": "PriceSpecification",
                "priceCurrency": "SGD",
                "price": "From 125.00"
              }
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Annual Maintenance Contract",
            "description": "Comprehensive yearly maintenance package with priority support",
            "category": "Maintenance Service",
            "serviceType": "Contract",
            "offers": {
              "@type": "Offer",
              "priceSpecification": {
                "@type": "PriceSpecification",
                "priceCurrency": "SGD",
                "price": "From 240.00"
              }
            }
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "John D."
        },
        "datePublished": "2024-01-05",
        "reviewBody": "Excellent service! The technicians were professional and efficient.",
        "isPurchaseVerified": true,
        "servicePerformed": "PowerJet Chemical Wash"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Sarah L."
        },
        "datePublished": "2024-01-04",
        "reviewBody": "Very satisfied with their AMC package. Great value for money!",
        "isPurchaseVerified": true,
        "servicePerformed": "Annual Maintenance Contract"
      }
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+65 9187 4498",
        "contactType": "customer service",
        "areaServed": "SG",
        "availableLanguage": ["en", "zh"],
        "hoursAvailable": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ],
            "opens": "09:00",
            "closes": "18:00"
          }
        ]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+65 9187 4498",
        "contactType": "emergency service",
        "areaServed": "SG",
        "availableLanguage": ["en", "zh"],
        "hoursAvailable": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ],
            "opens": "09:00",
            "closes": "18:00"
          }
        ]
      }
    ]
  },
  "offers": {
    "@type": "Offer",
    "name": "First Time Customer Special",
    "description": "Special offers for first-time customers booking aircon servicing"
  },
  "potentialAction": [
    {
      "@type": "AuthorizeAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://iaircon.app/login",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "result": {
        "@type": "AuthorizeAction",
        "description": "Login to access your iAircon account"
      }
    }
  ]
};