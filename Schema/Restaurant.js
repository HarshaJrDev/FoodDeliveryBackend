import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    street: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere',
        required: true,
      }
    }
  },
  cuisines: {
    type: [String],
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  gallery: [{
    type: String,
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  }]
}, {
  timestamps: true,
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
export default Restaurant;
