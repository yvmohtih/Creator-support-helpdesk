export type Language = 'en' | 'te';
export type PlatformSlug = 'instagram' | 'facebook' | 'youtube' | 'other';

export interface ProblemCategory {
  slug: string;
  icon: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
}

export interface SupportPlatform {
  slug: PlatformSlug;
  name: string;
  teluguName: string;
  shortName: string;
  helpText: string;
}

export const languages: Array<{ code: Language; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'తెలుగు' },
];

export const supportPlatforms: SupportPlatform[] = [
  {
    slug: 'instagram',
    name: 'Instagram',
    teluguName: 'ఇన్‌స్టాగ్రామ్',
    shortName: 'IG',
    helpText: 'Login, account, reels, posts, followers',
  },
  {
    slug: 'facebook',
    name: 'Facebook',
    teluguName: 'ఫేస్‌బుక్',
    shortName: 'FB',
    helpText: 'Page, profile, posts, messages, access',
  },
  {
    slug: 'youtube',
    name: 'YouTube',
    teluguName: 'యూట్యూబ్',
    shortName: 'YT',
    helpText: 'Channel, videos, monetization, comments',
  },
  {
    slug: 'other',
    name: 'Other',
    teluguName: 'ఇతర',
    shortName: 'OT',
    helpText: 'Any other social media problem',
  },
];

export const commonText = {
  back: { en: 'Back', te: 'వెనక్కి' },
  trackRequest: { en: 'Track Request', te: 'రిక్వెస్ట్ చూడండి' },
  chooseProblem: { en: 'What problem are you facing?', te: 'మీకు ఏ సమస్య ఎదురవుతోంది?' },
  instruction: {
    en: 'Choose one problem. We will ask for details in the next step.',
    te: 'ఒక సమస్యను ఎంచుకోండి. తర్వాత దశలో వివరాలు అడుగుతాము.',
  },
  invalidPlatformTitle: { en: 'We could not find this app', te: 'ఈ యాప్ దొరకలేదు' },
  invalidPlatformMessage: {
    en: 'Please go back and choose Instagram, Facebook, YouTube, or Other.',
    te: 'దయచేసి వెనక్కి వెళ్లి Instagram, Facebook, YouTube లేదా Other ఎంచుకోండి.',
  },
  goHome: { en: 'Go to Home', te: 'హోమ్‌కు వెళ్లండి' },
  continue: { en: 'Continue', te: 'కొనసాగించండి' },
  nextStepTitle: { en: 'Next step', te: 'తర్వాత దశ' },
  nextStepMessage: {
    en: 'The problem details form will be available in the next step.',
    te: 'సమస్య వివరాల ఫారం తర్వాత దశలో ఉంటుంది.',
  },
  categoryMissingTitle: { en: 'Problem not selected', te: 'సమస్య ఎంచుకోలేదు' },
  categoryMissingMessage: {
    en: 'Please choose a problem category first.',
    te: 'దయచేసి ముందుగా సమస్య రకాన్ని ఎంచుకోండి.',
  },
};

export const problemCategories: Record<PlatformSlug, ProblemCategory[]> = {
  instagram: [
    category(
      'account-disabled',
      '!',
      'Account disabled',
      'ఖాతా నిలిపివేయబడింది',
      'Account is disabled or not available.',
      'ఖాతా నిలిపివేయబడింది లేదా అందుబాటులో లేదు.',
    ),
    category(
      'cannot-log-in',
      '↪',
      'Cannot log in',
      'లాగిన్ కాలేకపోతున్నాను',
      'Password, OTP, or access is not working.',
      'పాస్‌వర్డ్, OTP లేదా యాక్సెస్ పనిచేయడం లేదు.',
    ),
    category(
      'copyright-issue',
      '©',
      'Copyright issue',
      'కాపీరైట్ సమస్య',
      'Warning, claim, or removed content.',
      'హెచ్చరిక, క్లెయిమ్ లేదా తొలగించిన కంటెంట్.',
    ),
    category(
      'reach-reduced',
      '↓',
      'Reach reduced',
      'రీచ్ తగ్గింది',
      'Reels, posts, or stories are not reaching people.',
      'రీల్స్, పోస్టులు లేదా స్టోరీస్ ఎక్కువ మందికి చేరడం లేదు.',
    ),
    category(
      'monetization-problem',
      '₹',
      'Monetization problem',
      'మోనిటైజేషన్ సమస్య',
      'Earning tools are not available or not working.',
      'ఎర్నింగ్ టూల్స్ అందుబాటులో లేవు లేదా పనిచేయడం లేదు.',
    ),
    category(
      'payment-not-received',
      '₹',
      'Payment not received',
      'చెల్లింపు రాలేదు',
      'Expected payment has not arrived.',
      'రావాల్సిన చెల్లింపు ఇంకా రాలేదు.',
    ),
    category(
      'other-problem',
      '?',
      'Other problem',
      'ఇతర సమస్య',
      'Something else is wrong.',
      'మరేదైనా సమస్య ఉంది.',
    ),
  ],
  facebook: [
    category(
      'page-disabled',
      '!',
      'Page disabled',
      'పేజ్ నిలిపివేయబడింది',
      'Page is disabled or restricted.',
      'పేజ్ నిలిపివేయబడింది లేదా పరిమితం చేయబడింది.',
    ),
    category(
      'cannot-log-in',
      '↪',
      'Cannot log in',
      'లాగిన్ కాలేకపోతున్నాను',
      'Account or page access is not working.',
      'ఖాతా లేదా పేజ్ యాక్సెస్ పనిచేయడం లేదు.',
    ),
    category(
      'monetization-problem',
      '₹',
      'Monetization problem',
      'మోనిటైజేషన్ సమస్య',
      'Earning tools are not available or not working.',
      'ఎర్నింగ్ టూల్స్ అందుబాటులో లేవు లేదా పనిచేయడం లేదు.',
    ),
    category(
      'payment-not-received',
      '₹',
      'Payment not received',
      'చెల్లింపు రాలేదు',
      'Expected payment has not arrived.',
      'రావాల్సిన చెల్లింపు ఇంకా రాలేదు.',
    ),
    category(
      'copyright-issue',
      '©',
      'Copyright issue',
      'కాపీరైట్ సమస్య',
      'Warning, claim, or removed content.',
      'హెచ్చరిక, క్లెయిమ్ లేదా తొలగించిన కంటెంట్.',
    ),
    category(
      'page-access-problem',
      'K',
      'Page access problem',
      'పేజ్ యాక్సెస్ సమస్య',
      'Admin access or page role is missing.',
      'అడ్మిన్ యాక్సెస్ లేదా పేజ్ రోల్ కనిపించడం లేదు.',
    ),
    category(
      'other-problem',
      '?',
      'Other problem',
      'ఇతర సమస్య',
      'Something else is wrong.',
      'మరేదైనా సమస్య ఉంది.',
    ),
  ],
  youtube: [
    category(
      'channel-warning',
      '!',
      'Channel warning',
      'చానల్ హెచ్చరిక',
      'Channel received a warning.',
      'చానల్‌కు హెచ్చరిక వచ్చింది.',
    ),
    category(
      'copyright-strike',
      '©',
      'Copyright strike',
      'కాపీరైట్ స్ట్రైక్',
      'Channel or video received a strike.',
      'చానల్ లేదా వీడియోకు స్ట్రైక్ వచ్చింది.',
    ),
    category(
      'channel-suspended',
      'X',
      'Channel suspended',
      'చానల్ సస్పెండ్ అయింది',
      'Channel is suspended or removed.',
      'చానల్ సస్పెండ్ అయింది లేదా తొలగించబడింది.',
    ),
    category(
      'monetization-issue',
      '₹',
      'Monetization issue',
      'మోనిటైజేషన్ సమస్య',
      'Monetization is disabled or under review.',
      'మోనిటైజేషన్ నిలిపివేయబడింది లేదా సమీక్షలో ఉంది.',
    ),
    category(
      'adsense-issue',
      'A',
      'AdSense issue',
      'AdSense సమస్య',
      'AdSense approval, connection, or payment issue.',
      'AdSense ఆమోదం, కనెక్షన్ లేదా చెల్లింపు సమస్య.',
    ),
    category(
      'payment-issue',
      '₹',
      'Payment issue',
      'చెల్లింపు సమస్య',
      'Payment is delayed, missing, or unclear.',
      'చెల్లింపు ఆలస్యం అయింది, రాలేదు లేదా స్పష్టంగా లేదు.',
    ),
    category(
      'other-problem',
      '?',
      'Other problem',
      'ఇతర సమస్య',
      'Something else is wrong.',
      'మరేదైనా సమస్య ఉంది.',
    ),
  ],
  other: [
    category(
      'account-problem',
      '!',
      'Account problem',
      'ఖాతా సమస్య',
      'Account is blocked, missing, or not working.',
      'ఖాతా బ్లాక్ అయింది, కనిపించడం లేదు లేదా పనిచేయడం లేదు.',
    ),
    category(
      'login-problem',
      '↪',
      'Login problem',
      'లాగిన్ సమస్య',
      'You cannot open or access the account.',
      'మీరు ఖాతాను తెరవలేకపోతున్నారు లేదా యాక్సెస్ చేయలేకపోతున్నారు.',
    ),
    category(
      'payment-problem',
      '₹',
      'Payment problem',
      'చెల్లింపు సమస్య',
      'Payment is delayed or not received.',
      'చెల్లింపు ఆలస్యం అయింది లేదా రాలేదు.',
    ),
    category(
      'copyright-problem',
      '©',
      'Copyright problem',
      'కాపీరైట్ సమస్య',
      'Copyright warning, claim, or removal.',
      'కాపీరైట్ హెచ్చరిక, క్లెయిమ్ లేదా తొలగింపు.',
    ),
    category(
      'other-problem',
      '?',
      'Other problem',
      'ఇతర సమస్య',
      'Something else is wrong.',
      'మరేదైనా సమస్య ఉంది.',
    ),
  ],
};

export function getPlatform(slug?: string | null) {
  return supportPlatforms.find((platform) => platform.slug === slug);
}

export function getLanguage(value?: string | null): Language {
  return value === 'te' ? 'te' : 'en';
}

export function getCategory(platform: PlatformSlug, slug?: string | null) {
  return problemCategories[platform].find((categoryItem) => categoryItem.slug === slug);
}

function category(
  slug: string,
  icon: string,
  titleEn: string,
  titleTe: string,
  descriptionEn: string,
  descriptionTe: string,
): ProblemCategory {
  return {
    slug,
    icon,
    title: { en: titleEn, te: titleTe },
    description: { en: descriptionEn, te: descriptionTe },
  };
}
