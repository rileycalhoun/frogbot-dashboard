import mongoose from 'mongoose';
import { MONGO_URI } from '$env/static/private';

var isConnected = 0;

export const connect = async () => {
    if(isConnected === 1) {
        console.log('Using existing database connection');
        return;
    }

    if(mongoose.connections.length > 0) {
        isConnected = mongoose.connections[0].readyState;
        if(isConnected === 1) {
            console.log("Using existing database connection");
            return;
        }

        await mongoose.disconnect();
    }

    await mongoose.connect(MONGO_URI ?? '');
    isConnected = 1;
    console.log("New database connection established");
};

export const disconnect = async () => {
    if(process.env.NODE_ENV === 'development') return;
    if(isConnected === 0) return;

    await mongoose.disconnect();
    isConnected = 0;
    console.log('Database connection terminated');
};