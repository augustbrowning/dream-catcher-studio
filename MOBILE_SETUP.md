# Mobile App Setup Guide

This Dream Journal app has been configured for mobile deployment using Capacitor. Follow these steps to run it on iOS and Android devices.

## Prerequisites

### For iOS Development
- macOS with Xcode installed
- Apple Developer account (for device testing)

### For Android Development
- Android Studio with SDK installed
- Java Development Kit (JDK)

## Setup Instructions

### 1. Export to GitHub
Click the "Export to GitHub" button in Lovable to create your own repository.

### 2. Clone and Setup
```bash
git clone [your-repo-url]
cd [your-repo-name]
npm install
```

### 3. Add Mobile Platforms
```bash
# For iOS
npx cap add ios

# For Android  
npx cap add android
```

### 4. Update Dependencies
```bash
# For iOS
npx cap update ios

# For Android
npx cap update android
```

### 5. Build the Project
```bash
npm run build
```

### 6. Sync with Native Platforms
```bash
npx cap sync
```

### 7. Run on Device/Emulator
```bash
# For iOS (requires macOS)
npx cap run ios

# For Android
npx cap run android
```

## Mobile Features

### Authentication
The app includes mobile-optimized OAuth flows:
- **Apple Sign In**: Native mobile integration
- **Google Sign In**: Mobile-optimized OAuth
- **Email/Password**: Standard authentication

### Mobile-Specific Features
- **Responsive Design**: Optimized for mobile screens
- **Touch Interactions**: Mobile-friendly UI components
- **Native Performance**: Leverages Capacitor for native capabilities

### Hot Reload Development
The app is configured for hot reload during development:
- **Preview URL**: https://2aa1f291-973b-419d-a1ad-c7f1b242259c.lovableproject.com
- **Real-time Updates**: Changes appear instantly on device

## OAuth Configuration

### Deep Links
The app uses deep links for OAuth redirects:
- **App Scheme**: `app.lovable.2aa1f291973b419da1adc7f1b242259c://auth`
- **Web Fallback**: Standard web URLs for browser testing

### Supabase Setup
Configure your Supabase project with these redirect URLs:
1. Web: `https://your-domain.com/`
2. Mobile: `app.lovable.2aa1f291973b419da1adc7f1b242259c://auth`

## Troubleshooting

### Common Issues
- **Build Errors**: Ensure all dependencies are installed with `npm install`
- **Sync Issues**: Run `npx cap sync` after any code changes
- **OAuth Issues**: Verify redirect URLs in Supabase Auth settings

### Support Resources
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Supabase Mobile Auth Guide](https://supabase.com/docs/guides/auth)

## Next Steps

After successful setup:
1. Test authentication flows on device
2. Configure push notifications (if needed)
3. Add native device features (camera, storage, etc.)
4. Deploy to App Store/Play Store

The app is now ready for mobile development and deployment!