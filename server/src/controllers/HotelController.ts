import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { CustomError } from '../util/error/CustomError';
import { HotelDao } from '../dao/HotelDao';
import { TYPES } from '../configs/types';
import { Hotel } from '../models/Hotel';

@injectable()
export class HotelController {

    constructor(@inject(TYPES.HotelDao) private hotelDao: HotelDao) { }

    async getHotels(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving all hotels`);
            const { weddingId } = request.params;

            const hotels: Array<Hotel> = await this.hotelDao.getAllHotels(weddingId);

            Logger.info(`Number of hotels retrieved successfully: ${hotels.length}`);
            response.status(200).json(hotels);
        } catch (error) {
            Logger.error("Error retrieving hotels");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getHotelbyId(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving hotel with ID: ${request.params.hotelId}`);
            const { weddingId, hotelId } = request.params;
            const hotel: Hotel = await this.hotelDao.getHotelById(weddingId, hotelId);
            response.status(200).json(hotel);
        } catch (error) {
            Logger.error(`Error retrieving hotel with ${request.params.hotelId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async saveHotel(request: Request, response: Response, next: NextFunction) {
        try {
            const { weddingId } = request.params;
            const hotel: Hotel = request.body;
            const updatedHotel: Hotel = await this.hotelDao.saveHotel(weddingId, hotel);
            Logger.info(`Successfully updated hotel for ${hotel.name}`);
            response.status(200).json(updatedHotel);
        } catch (error) {
            Logger.error("Error updated hotel", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async batchCreateHotels(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Batch creating new hotels`);
            const { weddingId } = request.params;
            const hotels: Array<Hotel> = request.body;
            await this.hotelDao.batchCreateHotels(weddingId, hotels);
            Logger.info(`Successfully added batch hotels`);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error adding batch hotels", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deleteHotel(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Deleting hotel ${JSON.stringify(request.body)}`);
            const { weddingId } = request.params;
            const hotel: Hotel = request.body;
            await this.hotelDao.deleteHotel(weddingId, hotel.id);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error deleting hotel", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async batchDeleteHotels(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Deleting hotels ${JSON.stringify(request.body)}`);
            const { weddingId } = request.params;
            const hotels: Array<Hotel> = request.body;
            await this.hotelDao.batchDeleteHotels(weddingId, hotels);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error batch deleting hotels", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }
}