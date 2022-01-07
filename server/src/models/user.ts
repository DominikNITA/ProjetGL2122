import mongoose, { model } from 'mongoose';
import { IAuthData, IUser } from '../utility/types';

const AuthDataSchema = new mongoose.Schema<IAuthData>({
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
});

const UserSchema = new mongoose.Schema<IUser>({
    surname: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: false,
    },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
    authData: AuthDataSchema,
});

export const UserModel =
    (mongoose.models.User as unknown as mongoose.Model<IUser, {}, {}, {}>) ||
    model<IUser>('User', UserSchema);
