import prisma from '../../lib/prisma.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';
import { NotFound } from '../../Errors/NotFound.js';

export const getAllCountries = asyncHandler(async (req, res) => {
    const countries = await prisma.country.findMany({ where: { isDeleted: false }, orderBy: { id: 'desc' } });
    return SuccessResponse(res, { message: 'Countries retrieved successfully', data: countries }, 200);
});

export const createCountry = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const existingCountry = await prisma.country.findFirst({ where: { name, isDeleted: false } });
    if (existingCountry) throw new ErrorResponse('Country already exists', 400);
    const country = await prisma.country.create({ data: { name } });
    return SuccessResponse(res, { message: 'Country created successfully', data: country }, 201);
});

export const getAllCities = asyncHandler(async (req, res) => {
    const cities = await prisma.city.findMany({
        where: { isDeleted: false },
        orderBy: { id: 'desc' },
        select: { id: true, name: true, isDeleted: true, country: { select: { id: true, name: true } } }
    });
    return SuccessResponse(res, { message: 'Cities retrieved successfully', data: cities }, 200);
});

export const createCity = asyncHandler(async (req, res) => {
    const { name, countryId } = req.body;
    const country = await prisma.country.findFirst({ where: { id: Number(countryId), isDeleted: false } });
    if (!country) throw new NotFound('Country not found');
    const existingCity = await prisma.city.findFirst({ where: { name, country_id: Number(countryId), isDeleted: false } });
    if (existingCity) throw new ErrorResponse('City already exists', 400);
    const city = await prisma.city.create({ data: { name, country_id: Number(countryId) } });
    return SuccessResponse(res, { message: 'City created successfully', data: city }, 201);
});


// edit country 
export const editConuntry = asyncHandler(async (req, res) => {
    const { countryId } = req.params;
    const { name } = req.body;
    const country = await prisma.country.findFirst({ where: { id: Number(countryId), isDeleted: false } });
    if (!country) throw new NotFound('Country not found');
    const updated = await prisma.country.update({ where: { id: Number(countryId) }, data: { name } });
    return SuccessResponse(res, { message: 'Country updated successfully', data: updated }, 200);
});
// edit city
export const editCity = asyncHandler(async (req, res) => {
    const { cityId } = req.params;
    const { name, countryId } = req.body;
    const city = await prisma.city.findFirst({ where: { id: Number(cityId), isDeleted: false } });
    if (!city) throw new NotFound('City not found');
    const country = await prisma.country.findFirst({ where: { id: Number(countryId), isDeleted: false } });
    if (!country) throw new NotFound('Country not found');
    const updated = await prisma.city.update({ where: { id: Number(cityId) }, data: { name, country_id: Number(countryId) } });
    return SuccessResponse(res, { message: 'City updated successfully', data: updated }, 200);
});


export const deleteCountry = asyncHandler(async (req, res) => {
    const { countryId } = req.params;
    const country = await prisma.country.findFirst({ where: { id: Number(countryId), isDeleted: false } });
    if (!country) throw new NotFound('Country not found');
    await prisma.city.deleteMany({ where: { country_id: Number(countryId), isDeleted: false } });
    await prisma.country.delete({ where: { id: Number(countryId) } });
    return SuccessResponse(res, { message: 'Country deleted successfully' }, 200);
});

// delete city
export const deleteCity = asyncHandler(async (req, res) => {
    const { cityId } = req.params;
    const city = await prisma.city.findFirst({ where: { id: Number(cityId), isDeleted: false } });
    if (!city) throw new NotFound('City not found');
    await prisma.city.delete({ where: { id: Number(cityId) } });
    return SuccessResponse(res, { message: 'City deleted successfully' }, 200);
});

// get country by ID
export const getCountryById = asyncHandler(async (req, res) => {
    const { countryId } = req.params;
    const country = await prisma.country.findFirst({ where: { id: Number(countryId), isDeleted: false } });
    if (!country) throw new NotFound('Country not found');
    return SuccessResponse(res, { message: 'Country retrieved successfully', data: country }, 200);
});

// get city by ID
export const getCityById = asyncHandler(async (req, res) => {
    const { cityId } = req.params;
    const city = await prisma.city.findFirst({
        where: { id: Number(cityId), isDeleted: false },
        select: { id: true, name: true, country: { select: { id: true, name: true } } }
    });
    if (!city) throw new NotFound('City not found');
    return SuccessResponse(res, { message: 'City retrieved successfully', data: city }, 200);
});