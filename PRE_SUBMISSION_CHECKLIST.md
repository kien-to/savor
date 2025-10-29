# Pre-Submission Checklist for Savor App

## ✅ App Configuration
- [x] Updated app.json with proper bundle identifier
- [x] Changed app name to "Savor - Food Waste Reduction"
- [x] Added proper description
- [x] Set unique bundle identifier: com.savor.foodwaste
- [x] Added build numbers and version codes
- [x] Created EAS configuration

## ✅ Legal Requirements
- [x] Privacy Policy implemented with language switching
- [x] Terms of Service implemented with language switching
- [x] Contact information provided (privacy@savor.app, support@savor.app)
- [x] Data collection and usage clearly explained
- [x] Permissions justification provided

## ✅ Content & Functionality
- [x] Removed placeholder URLs and content
- [x] Fixed example.com image URL
- [x] Removed TODO comments
- [x] All navigation flows working
- [x] Privacy policy accessible from multiple locations
- [x] Terms of service accessible from contact screen

## 🔄 Still Needed

### App Assets
- [ ] **App Icon**: 1024x1024px for App Store
- [ ] **Splash Screen**: High-quality splash screen image
- [ ] **Screenshots**: 5 screenshots for each required device size
- [ ] **App Preview Video**: 30-second video (optional but recommended)

### App Store Connect Setup
- [ ] **Apple Developer Account**: Ensure account is active
- [ ] **App Store Connect**: Create new app entry
- [ ] **App Information**: Fill in all required fields
- [ ] **Pricing**: Set as free app
- [ ] **Age Rating**: Complete questionnaire
- [ ] **Keywords**: Add relevant keywords
- [ ] **Categories**: Select Food & Drink

### Testing & Quality Assurance
- [ ] **Device Testing**: Test on multiple iOS devices
- [ ] **Functionality Testing**: Test all user flows
- [ ] **Performance Testing**: Ensure smooth performance
- [ ] **Network Testing**: Test with poor connectivity
- [ ] **Edge Cases**: Test error scenarios

### Build & Submission
- [ ] **EAS Build**: Create production build
- [ ] **App Store Connect**: Upload build
- [ ] **Metadata**: Complete all app information
- [ ] **Screenshots**: Upload all required screenshots
- [ ] **Review Information**: Add notes for reviewers
- [ ] **Submit for Review**: Submit to Apple

## 📋 App Store Connect Information

### App Information
- **Name**: Savor - Food Waste Reduction
- **Subtitle**: Save money, reduce waste
- **Category**: Food & Drink
- **Age Rating**: 4+
- **Price**: Free

### Keywords (100 characters max)
food waste, sustainability, restaurant, discount, eco-friendly, surplus food, green living

### Description
See APP_STORE_DESCRIPTIONS.md for complete descriptions in English and Vietnamese.

### Contact Information
- **Support URL**: https://savor.app/support
- **Marketing URL**: https://savor.app
- **Privacy Policy URL**: https://savor.app/privacy
- **Terms of Service URL**: https://savor.app/terms

## 🚀 Next Steps

### Immediate Actions
1. **Create App Icons**: Design 1024x1024px app icon
2. **Take Screenshots**: Capture screenshots on actual devices
3. **Set up App Store Connect**: Create app entry
4. **Build Production Version**: Use EAS Build
5. **Upload to App Store Connect**: Submit for review

### Commands to Run
```bash
# Navigate to app directory
cd /Users/lkthaiha/Downloads/Code/savor-revamped/savor-app-main

# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure EAS (if not already done)
eas build:configure

# Build for iOS production
eas build --platform ios --profile production

# Submit to App Store (after build is complete)
eas submit --platform ios --profile production
```

## ⚠️ Common Rejection Reasons to Avoid

### Content Issues
- **Incomplete Functionality**: Ensure all features work
- **Placeholder Content**: Remove all placeholder text/images
- **Misleading Descriptions**: Be accurate about features
- **Inappropriate Content**: Keep content family-friendly

### Technical Issues
- **Crashes**: Test thoroughly on multiple devices
- **Broken Links**: Ensure all external links work
- **Poor Performance**: Optimize for smooth experience
- **Missing Permissions**: Justify all permission requests

### Legal Issues
- **Privacy Policy**: Must be comprehensive and accessible
- **Terms of Service**: Required for user-generated content
- **Data Protection**: Follow GDPR and other regulations
- **Contact Information**: Provide valid support channels

## 📞 Support Resources

### Apple Resources
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **App Store Connect Help**: https://developer.apple.com/help/app-store-connect/
- **Human Interface Guidelines**: https://developer.apple.com/design/human-interface-guidelines/

### Expo Resources
- **EAS Build Documentation**: https://docs.expo.dev/build/introduction/
- **EAS Submit Documentation**: https://docs.expo.dev/submit/introduction/
- **Expo Community**: https://forums.expo.dev/

### Review Process
- **Typical Review Time**: 24-48 hours
- **Rejection Reasons**: Apple provides specific feedback
- **Resubmission**: Fix issues and resubmit
- **Appeal Process**: Available for disputed rejections
