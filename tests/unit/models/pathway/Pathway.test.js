const Pathway = require('../../../../backend/models/pathway/Pathway');
const mongoose = require('mongoose');

describe('Pathway Model', () => {
  test('should create a new pathway', async () => {
    const pathwayData = {
      name: 'Express Entry - Federal Skilled Worker',
      code: 'fsw-2023',
      country: 'Canada',
      category: 'federal',
      description: 'Federal Skilled Worker Program for skilled immigrants',
      eligibilityCriteria: [
        {
          name: 'Work Experience',
          description: 'At least 1 year of skilled work experience',
          type: 'required'
        },
        {
          name: 'Language Proficiency',
          description: 'CLB 7 in all abilities',
          type: 'required'
        }
      ],
      processingTime: {
        min: 6,
        max: 12,
        unit: 'months'
      },
      applicationFee: {
        amount: 1325,
        currency: 'CAD'
      },
      requiredDocuments: [
        {
          name: 'Language Test Results',
          description: 'IELTS or CELPIP results'
        }
      ],
      steps: [
        {
          order: 1,
          title: 'Create Express Entry Profile',
          description: 'Create profile in the Express Entry system'
        }
      ],
      officialLink: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/works.html'
    };
    
    const pathway = await Pathway.create(pathwayData);
    
    expect(pathway).toHaveProperty('_id');
    expect(pathway.name).toBe(pathwayData.name);
    expect(pathway.code).toBe(pathwayData.code);
    expect(pathway.eligibilityCriteria.length).toBe(2);
  });
  
  test('should get translated pathway content', async () => {
    const pathway = await Pathway.create({
      name: 'Express Entry',
      code: 'ee-2023',
      country: 'Canada',
      category: 'federal',
      description: 'Express Entry system for skilled immigrants',
      processingTime: {
        min: 6,
        max: 12,
        unit: 'months'
      },
      applicationFee: {
        amount: 1325,
        currency: 'CAD'
      },
      officialLink: 'https://www.canada.ca/express-entry',
      translations: new Map([
        ['fr', {
          name: 'Entrée Express',
          description: 'Système Entrée Express pour les immigrants qualifiés'
        }],
        ['zh', {
          name: '快速通道',
          description: '技术移民快速通道系统'
        }]
      ])
    });
    
    const enTranslation = pathway.getTranslation('en');
    const frTranslation = pathway.getTranslation('fr');
    const zhTranslation = pathway.getTranslation('zh');
    const nonExistentTranslation = pathway.getTranslation('de');
    
    expect(enTranslation.name).toBe('Express Entry');
    expect(frTranslation.name).toBe('Entrée Express');
    expect(zhTranslation.name).toBe('快速通道');
    expect(nonExistentTranslation.name).toBe('Express Entry'); // 回退到默认语言
  });
  
  test('should check eligibility for a pathway', async () => {
    const pathway = await Pathway.create({
      name: 'Test Pathway',
      code: 'test-2023',
      country: 'Canada',
      category: 'federal',
      description: 'Test pathway description',
      eligibilityCriteria: [
        {
          name: 'Age',
          description: 'Between 18 and 35',
          type: 'required',
          points: 0
        },
        {
          name: 'Education',
          description: 'Bachelor degree or higher',
          type: 'required',
          points: 0
        },
        {
          name: 'Work Experience',
          description: 'At least 1 year',
          type: 'optional',
          points: 10
        },
        {
          name: 'Adaptability',
          description: 'Previous visits to Canada',
          type: 'bonus',
          points: 5
        }
      ],
      processingTime: {
        min: 6,
        max: 12,
        unit: 'months'
      },
      applicationFee: {
        amount: 1000,
        currency: 'CAD'
      },
      officialLink: 'https://example.com'
    });
    
    const userProfile = {
      age: 30,
      education: 'master',
      workExperience: 3,
      visits: ['Canada']
    };
    
    const result = pathway.checkEligibility(userProfile);
    
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('points');
    expect(result).toHaveProperty('maxPoints');
    expect(result).toHaveProperty('results');
    expect(result.results).toHaveProperty('required');
    expect(result.results).toHaveProperty('optional');
    expect(result.results).toHaveProperty('bonus');
  });
  
  test('should validate required fields', async () => {
    try {
      await Pathway.create({
        name: 'Invalid Pathway'
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      expect(error.errors).toBeDefined();
    }
  });
  
  test('should enforce code uniqueness', async () => {
    await Pathway.create({
      name: 'First Pathway',
      code: 'unique-code',
      country: 'Canada',
      category: 'federal',
      description: 'First pathway description',
      processingTime: {
        min: 6,
        max: 12,
        unit: 'months'
      },
      applicationFee: {
        amount: 1000,
        currency: 'CAD'
      },
      officialLink: 'https://example.com'
    });
    
    try {
      await Pathway.create({
        name: 'Second Pathway',
        code: 'unique-code', // 与第一个途径相同
        country: 'Canada',
        category: 'federal',
        description: 'Second pathway description',
        processingTime: {
          min: 6,
          max: 12,
          unit: 'months'
        },
        applicationFee: {
          amount: 1000,
          currency: 'CAD'
        },
        officialLink: 'https://example.com'
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('MongoError');
      expect(error.code).toBe(11000); // 重复键错误代码
    }
  });
  
  test('should validate enum fields', async () => {
    const pathway = new Pathway({
      name: 'Invalid Category Pathway',
      code: 'invalid-category',
      country: 'Canada',
      category: 'invalid-category', // 不在枚举列表中
      description: 'Invalid category pathway description',
      processingTime: {
        min: 6,
        max: 12,
        unit: 'months'
      },
      applicationFee: {
        amount: 1000,
        currency: 'CAD'
      },
      officialLink: 'https://example.com'
    });
    
    try {
      await pathway.validate();
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      expect(error.errors.category).toBeDefined();
    }
    
    const pathway2 = new Pathway({
      name: 'Invalid Unit Pathway',
      code: 'invalid-unit',
      country: 'Canada',
      category: 'federal',
      description: 'Invalid unit pathway description',
      processingTime: {
        min: 6,
        max: 12,
        unit: 'invalid-unit' // 不在枚举列表中
      },
      applicationFee: {
        amount: 1000,
        currency: 'CAD'
      },
      officialLink: 'https://example.com'
    });
    
    try {
      await pathway2.validate();
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      expect(error.errors['processingTime.unit']).toBeDefined();
    }
  });
});
