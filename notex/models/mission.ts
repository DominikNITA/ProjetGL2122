import mongoose from 'mongoose';
import { IMission } from '../utils/types';

const MissionSchema = new mongoose.Schema<IMission>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  startDate: {
    type: Date,
    required: false,
    validate: {
      validator: function (v: Date) {
        return (
          v && // check that there is a date object
          v.getTime() > Date.now() + 24 * 60 * 60 * 1000 &&
          v.getTime() < Date.now() + 90 * 24 * 60 * 60 * 1000
        );
      },
      message:
        'An event must be at least 1 day from now and not more than 90 days.',
    },
  },
  endDate: { type: Date, required: false },
});

export const MissionModel =
  (mongoose.models.Mission as unknown as mongoose.Model<
    IMission,
    {},
    {},
    {}
  >) || mongoose.model<IMission>('Mission', MissionSchema);
