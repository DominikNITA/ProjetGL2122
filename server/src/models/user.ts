import mongoose, { model } from 'mongoose';
import { IAuthData, IUser, UserRole } from '../utility/types';

const AuthDataSchema = new mongoose.Schema<IAuthData>({
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
});

const UserSchema = new mongoose.Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: false,
    },
    authData: AuthDataSchema,
    roles: [{ type: String, enum: UserRole }],
});

export const UserModel =
    (mongoose.models.User as unknown as mongoose.Model<IUser, {}, {}, {}>) ||
    model<IUser>('User', UserSchema);
