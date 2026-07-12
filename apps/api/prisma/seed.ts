import { PrismaClient, Platform } from '@prisma/client';

const prisma = new PrismaClient();

const issueCategories: Array<{
  platform: Platform;
  nameEn: string;
  nameTe: string;
  descriptionEn: string;
  descriptionTe: string;
  sortOrder: number;
}> = [
  {
    platform: Platform.instagram,
    nameEn: 'Account disabled',
    nameTe: 'ఖాతా నిలిపివేయబడింది',
    descriptionEn: 'Instagram account is disabled or unavailable.',
    descriptionTe: 'Instagram ఖాతా నిలిపివేయబడింది లేదా అందుబాటులో లేదు.',
    sortOrder: 10,
  },
  {
    platform: Platform.instagram,
    nameEn: 'Cannot log in',
    nameTe: 'లాగిన్ కాలేకపోతున్నాను',
    descriptionEn: 'User cannot access their Instagram account.',
    descriptionTe: 'వినియోగదారు Instagram ఖాతాలోకి ప్రవేశించలేకపోతున్నారు.',
    sortOrder: 20,
  },
  {
    platform: Platform.instagram,
    nameEn: 'Copyright issue',
    nameTe: 'కాపీరైట్ సమస్య',
    descriptionEn: 'Copyright warning, claim, or removed content on Instagram.',
    descriptionTe: 'Instagram లో కాపీరైట్ హెచ్చరిక, క్లెయిమ్ లేదా తొలగించిన కంటెంట్.',
    sortOrder: 30,
  },
  {
    platform: Platform.instagram,
    nameEn: 'Reach reduced',
    nameTe: 'రీచ్ తగ్గింది',
    descriptionEn: 'Posts, reels, or stories are getting lower reach.',
    descriptionTe: 'పోస్టులు, రీల్స్ లేదా స్టోరీస్‌కు రీచ్ తగ్గింది.',
    sortOrder: 40,
  },
  {
    platform: Platform.instagram,
    nameEn: 'Monetization problem',
    nameTe: 'మోనిటైజేషన్ సమస్య',
    descriptionEn: 'Instagram monetization is unavailable or not working.',
    descriptionTe: 'Instagram మోనిటైజేషన్ అందుబాటులో లేదు లేదా పనిచేయడం లేదు.',
    sortOrder: 50,
  },
  {
    platform: Platform.instagram,
    nameEn: 'Payment not received',
    nameTe: 'చెల్లింపు రాలేదు',
    descriptionEn: 'Expected Instagram payment has not been received.',
    descriptionTe: 'Instagram నుంచి రావాల్సిన చెల్లింపు రాలేదు.',
    sortOrder: 60,
  },
  {
    platform: Platform.facebook,
    nameEn: 'Page disabled',
    nameTe: 'పేజ్ నిలిపివేయబడింది',
    descriptionEn: 'Facebook page is disabled or restricted.',
    descriptionTe: 'Facebook పేజ్ నిలిపివేయబడింది లేదా పరిమితం చేయబడింది.',
    sortOrder: 10,
  },
  {
    platform: Platform.facebook,
    nameEn: 'Cannot log in',
    nameTe: 'లాగిన్ కాలేకపోతున్నాను',
    descriptionEn: 'User cannot access their Facebook account or page.',
    descriptionTe: 'వినియోగదారు Facebook ఖాతా లేదా పేజ్‌లోకి ప్రవేశించలేకపోతున్నారు.',
    sortOrder: 20,
  },
  {
    platform: Platform.facebook,
    nameEn: 'Monetization problem',
    nameTe: 'మోనిటైజేషన్ సమస్య',
    descriptionEn: 'Facebook monetization is unavailable or not working.',
    descriptionTe: 'Facebook మోనిటైజేషన్ అందుబాటులో లేదు లేదా పనిచేయడం లేదు.',
    sortOrder: 30,
  },
  {
    platform: Platform.facebook,
    nameEn: 'Payment not received',
    nameTe: 'చెల్లింపు రాలేదు',
    descriptionEn: 'Expected Facebook payment has not been received.',
    descriptionTe: 'Facebook నుంచి రావాల్సిన చెల్లింపు రాలేదు.',
    sortOrder: 40,
  },
  {
    platform: Platform.facebook,
    nameEn: 'Copyright issue',
    nameTe: 'కాపీరైట్ సమస్య',
    descriptionEn: 'Copyright warning, claim, or removed content on Facebook.',
    descriptionTe: 'Facebook లో కాపీరైట్ హెచ్చరిక, క్లెయిమ్ లేదా తొలగించిన కంటెంట్.',
    sortOrder: 50,
  },
  {
    platform: Platform.youtube,
    nameEn: 'Channel warning',
    nameTe: 'చానల్ హెచ్చరిక',
    descriptionEn: 'YouTube channel received a warning.',
    descriptionTe: 'YouTube చానల్‌కు హెచ్చరిక వచ్చింది.',
    sortOrder: 10,
  },
  {
    platform: Platform.youtube,
    nameEn: 'Copyright strike',
    nameTe: 'కాపీరైట్ స్ట్రైక్',
    descriptionEn: 'YouTube channel or video received a copyright strike.',
    descriptionTe: 'YouTube చానల్ లేదా వీడియోకు కాపీరైట్ స్ట్రైక్ వచ్చింది.',
    sortOrder: 20,
  },
  {
    platform: Platform.youtube,
    nameEn: 'Monetization issue',
    nameTe: 'మోనిటైజేషన్ సమస్య',
    descriptionEn: 'YouTube monetization is unavailable, disabled, or under review.',
    descriptionTe: 'YouTube మోనిటైజేషన్ అందుబాటులో లేదు, నిలిపివేయబడింది లేదా సమీక్షలో ఉంది.',
    sortOrder: 30,
  },
  {
    platform: Platform.youtube,
    nameEn: 'AdSense issue',
    nameTe: 'AdSense సమస్య',
    descriptionEn: 'AdSense connection, approval, or payment issue.',
    descriptionTe: 'AdSense కనెక్షన్, ఆమోదం లేదా చెల్లింపు సమస్య.',
    sortOrder: 40,
  },
  {
    platform: Platform.youtube,
    nameEn: 'Payment issue',
    nameTe: 'చెల్లింపు సమస్య',
    descriptionEn: 'YouTube payment is delayed, missing, or unclear.',
    descriptionTe: 'YouTube చెల్లింపు ఆలస్యం అయింది, రాలేదు లేదా స్పష్టంగా లేదు.',
    sortOrder: 50,
  },
  {
    platform: Platform.youtube,
    nameEn: 'Channel suspended',
    nameTe: 'చానల్ సస్పెండ్ అయింది',
    descriptionEn: 'YouTube channel is suspended or terminated.',
    descriptionTe: 'YouTube చానల్ సస్పెండ్ అయింది లేదా తొలగించబడింది.',
    sortOrder: 60,
  },
  {
    platform: Platform.other,
    nameEn: 'Other problem',
    nameTe: 'ఇతర సమస్య',
    descriptionEn: 'Any problem that does not match the listed categories.',
    descriptionTe: 'జాబితాలో లేని ఏదైనా సమస్య.',
    sortOrder: 10,
  },
];

async function main() {
  for (const category of issueCategories) {
    await prisma.issueCategory.upsert({
      where: {
        platform_nameEn: {
          platform: category.platform,
          nameEn: category.nameEn,
        },
      },
      create: category,
      update: {
        nameTe: category.nameTe,
        descriptionEn: category.descriptionEn,
        descriptionTe: category.descriptionTe,
        isActive: true,
        sortOrder: category.sortOrder,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
