import { db } from '../configs/firebase';
import { DatabaseError, NoDataError } from '../util/error/CustomError';
import { injectable } from 'inversify';
import { CollectionReference, DocumentData, QuerySnapshot, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { Hotel } from '../models/Hotel';

@injectable()
export class HotelDao {

    private hotelsCollection: CollectionReference<DocumentData>;

    constructor() {
        this.hotelsCollection = db.collection('hotels');
    }

    async getAllHotels(weddingId: string): Promise<Array<Hotel>> {
        try {
            const snapshot: QuerySnapshot<DocumentData> = await this.hotelsCollection
                .where('weddingId', '==', weddingId)
                .get();

            if (snapshot.empty) {
                return [];
            }

            const hotels: Array<Hotel> = [];

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const hotelData = doc.data() as Hotel;
                hotelData.id = doc.id;
                hotels.push(hotelData);
            });

            return hotels;
        } catch (error) {
            throw error;
        }
    }

    async getHotelById(weddingId: string, hotelId: string): Promise<Hotel> {
        try {
            const snapshot = await this.hotelsCollection
                .where('__name__', '==', hotelId)
                .where('weddingId', '==', weddingId)
                .get();

            if (snapshot.empty) {
                throw new Error('No such hotel found with the given id and weddingId');
            }

            const hotelDoc = snapshot.docs[0];

            const hotelData = hotelDoc.data() as Hotel;
            hotelData.id = hotelDoc.id;

            return hotelData;
        } catch (error) {
            throw new DatabaseError("Could not retrieve hotel from database: " + error);
        }
    }

    async saveHotel(weddingId: string, hotel: Hotel): Promise<Hotel> {
        try {
            const hotelId = hotel.id || this.hotelsCollection.doc().id;
            const hotelRef = this.hotelsCollection.doc(hotelId);

            hotel.id = hotelId;
            hotel.weddingId = weddingId;

            await hotelRef.set(hotel, { merge: true });
            return hotel;
        } catch (error) {
            throw new DatabaseError("Could not save hotel: " + error);
        }
    }

    async batchCreateHotels(weddingId: string, hotels: Hotel[]): Promise<void> {
        try {
            const batchSize = 500;
            for (let i = 0; i < hotels.length; i += batchSize) {
                const batch = db.batch();
                const batchHotels = hotels.slice(i, i + batchSize);

                batchHotels.forEach(hotel => {
                    const newHotelRef = this.hotelsCollection.doc();
                    hotel.id = newHotelRef.id;
                    hotel.weddingId = weddingId;
                    batch.set(newHotelRef, hotel);
                });

                await batch.commit();
            }
        } catch (error) {
            throw new DatabaseError("Could not batch add hotels to database: " + error);
        }
    }

    async deleteHotel(weddingId: string, hotelId: string): Promise<void> {
        try {
            const hotelRef = this.hotelsCollection.doc(hotelId);
            const hotelDoc = await hotelRef.get();

            if (!hotelDoc.exists) {
                throw new Error('Hotel to delete does not exist.');
            }

            const hotelData = hotelDoc.data();
            if (!hotelData) {
                throw new Error('Hotel data is undefined.');
            }

            if (hotelData.weddingId !== weddingId) {
                throw new Error('Hotel does not belong to the specified wedding.');
            }

            await hotelRef.delete();
        } catch (error) {
            throw new DatabaseError('Could not delete hotel from database: ' + error);
        }
    }


    async batchDeleteHotels(weddingId: string, hotels: Hotel[]): Promise<void> {
        try {
            const batchSize = 500;
            const getAllLimit = 100;

            for (let i = 0; i < hotels.length; i += batchSize) {
                const batch = db.batch();
                const batchHotels = hotels.slice(i, i + batchSize);

                const hotelRefs = batchHotels.map((hotel, index) => {
                    if (!hotel.id) {
                        throw new Error(`Hotel at index ${i + index} does not have an id.`);
                    }
                    return this.hotelsCollection.doc(hotel.id);
                });

                for (let j = 0; j < hotelRefs.length; j += getAllLimit) {
                    const hotelRefsChunk = hotelRefs.slice(j, j + getAllLimit);

                    const docs = await db.getAll(...hotelRefsChunk);

                    docs.forEach(docSnapshot => {
                        if (!docSnapshot.exists) {
                            return;
                        }

                        const hotelData = docSnapshot.data();
                        if (hotelData && hotelData.weddingId === weddingId) {
                            batch.delete(docSnapshot.ref);
                        }
                    });
                }

                await batch.commit();
            }
        } catch (error: any) {
            throw new DatabaseError('Could not batch delete hotels: ' + error);
        }
    }


}
