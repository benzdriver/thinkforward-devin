/**
 * Consultant model for immigration consultants
 */
const mongoose = require('mongoose');

const consultantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String
  },
  specialization: [{
    type: String,
    enum: ['express_entry', 'provincial_nominee', 'business_immigration', 'family_sponsorship', 'refugee', 'study_permit', 'work_permit', 'citizenship', 'appeals', 'other'],
    required: true
  }],
  countries: [{
    type: String,
    required: true
  }],
  experience: {
    years: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String
    }
  },
  languages: [{
    language: {
      type: String,
      required: true
    },
    proficiency: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced', 'native'],
      required: true
    }
  }],
  credentials: [{
    title: {
      type: String,
      required: true
    },
    organization: {
      type: String,
      required: true
    },
    year: {
      type: Number
    },
    licenseNumber: {
      type: String
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  availability: {
    status: {
      type: String,
      enum: ['available', 'limited', 'unavailable'],
      default: 'available'
    },
    nextAvailableDate: {
      type: Date
    },
    workingHours: {
      monday: {
        start: String,
        end: String,
        available: {
          type: Boolean,
          default: true
        }
      },
      tuesday: {
        start: String,
        end: String,
        available: {
          type: Boolean,
          default: true
        }
      },
      wednesday: {
        start: String,
        end: String,
        available: {
          type: Boolean,
          default: true
        }
      },
      thursday: {
        start: String,
        end: String,
        available: {
          type: Boolean,
          default: true
        }
      },
      friday: {
        start: String,
        end: String,
        available: {
          type: Boolean,
          default: true
        }
      },
      saturday: {
        start: String,
        end: String,
        available: {
          type: Boolean,
          default: false
        }
      },
      sunday: {
        start: String,
        end: String,
        available: {
          type: Boolean,
          default: false
        }
      }
    }
  },
  fees: {
    consultationFee: {
      amount: {
        type: Number
      },
      currency: {
        type: String,
        default: 'CAD'
      },
      per: {
        type: String,
        enum: ['hour', 'session'],
        default: 'hour'
      }
    },
    serviceFees: [{
      service: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        default: 'CAD'
      },
      description: {
        type: String
      }
    }]
  },
  bio: {
    type: String
  },
  website: {
    type: String
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String
  },
  location: {
    address: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    province: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    postalCode: {
      type: String
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

/**
 * Add review to consultant
 * @param {Object} review - Review data
 * @returns {Object} - Updated consultant
 */
consultantSchema.methods.addReview = function(review) {
  const existingReviewIndex = this.reviews.findIndex(
    r => r.userId.toString() === review.userId.toString()
  );
  
  if (existingReviewIndex !== -1) {
    this.reviews[existingReviewIndex] = {
      ...this.reviews[existingReviewIndex],
      ...review,
      date: new Date()
    };
  } else {
    this.reviews.push({
      ...review,
      date: new Date()
    });
  }
  
  const totalRating = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.rating.average = totalRating / this.reviews.length;
  this.rating.count = this.reviews.length;
  
  return this;
};

/**
 * Update availability status
 * @param {string} status - New status
 * @param {Date} nextAvailableDate - Next available date
 * @returns {Object} - Updated consultant
 */
consultantSchema.methods.updateAvailability = function(status, nextAvailableDate = null) {
  this.availability.status = status;
  
  if (nextAvailableDate) {
    this.availability.nextAvailableDate = nextAvailableDate;
  }
  
  return this;
};

/**
 * Find consultants by specialization
 * @param {string} specialization - Specialization to search for
 * @returns {Promise<Array>} - Matching consultants
 */
consultantSchema.statics.findBySpecialization = function(specialization) {
  return this.find({
    specialization: specialization,
    isActive: true,
    isVerified: true
  }).sort({ 'rating.average': -1 });
};

/**
 * Find consultants by language
 * @param {string} language - Language to search for
 * @returns {Promise<Array>} - Matching consultants
 */
consultantSchema.statics.findByLanguage = function(language) {
  return this.find({
    'languages.language': language,
    isActive: true,
    isVerified: true
  }).sort({ 'rating.average': -1 });
};

/**
 * Find consultants by location
 * @param {string} country - Country to search for
 * @param {string} province - Province to search for (optional)
 * @param {string} city - City to search for (optional)
 * @returns {Promise<Array>} - Matching consultants
 */
consultantSchema.statics.findByLocation = function(country, province = null, city = null) {
  const query = {
    'location.country': country,
    isActive: true,
    isVerified: true
  };
  
  if (province) {
    query['location.province'] = province;
  }
  
  if (city) {
    query['location.city'] = city;
  }
  
  return this.find(query).sort({ 'rating.average': -1 });
};

consultantSchema.index({ specialization: 1, isActive: 1, isVerified: 1 });
consultantSchema.index({ 'languages.language': 1, isActive: 1, isVerified: 1 });
consultantSchema.index({ 'location.country': 1, 'location.province': 1, 'location.city': 1, isActive: 1, isVerified: 1 });
consultantSchema.index({ 'rating.average': -1 });

const Consultant = mongoose.model('Consultant', consultantSchema);

module.exports = Consultant;
