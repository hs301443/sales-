import Country from '../../models/modelschema/country.js';
import  City  from '../../models/modelschema/city.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';
import { NotFound } from '../../Errors/NotFound.js';

export const getAllCountries = asyncHandler(async (req, res) => {
    const countries = await Country.find({ isDeleted: false })
        .select('-isDeleted -__v')
        .sort({ createdAt: -1 });
    return SuccessResponse(res, { message: 'Countries retrieved successfully', data: countries }, 200);
});

export const createCountry = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const existingCountry = await Country.findOne({
        name,
        isDeleted: false,
    });
    if (existingCountry) {
        throw new ErrorResponse('Country already exists', 400);
    }
    const country = await Country.create({
        name,
    });
    return SuccessResponse(res, { message: 'Country created successfully', data: country }, 201);
});

export const getAllCities = asyncHandler(async (req, res) => {
    const cities = await City.find({ isDeleted: false })
        .select('-isDeleted -__v')
        .sort({ createdAt: -1 })
        .populate('country', 'name');
    return SuccessResponse(res, { message: 'Cities retrieved successfully', data: cities }, 200);
});

export const createCity = asyncHandler(async (req, res) => {
    const { name, countryId } = req.body;
    const country = await Country.findOne({
        _id: countryId,
        isDeleted: false,
    });
    console.log(country);
    if (!country) {
        throw new NotFound('Country not found');
    }
    const existingCity = await City.findOne({
        name,
        country: countryId,
        isDeleted: false,
    });
    if (existingCity) {
        throw new ErrorResponse('City already exists', 400);
    }
    const city = await City.create({
        name,
        country: countryId,
    });
    return SuccessResponse(res, { message: 'City created successfully', data: city }, 201);
});


// edit country 
export const editConuntry = asyncHandler(async (req, res) => {
    const { countryId } = req.params;
    const { name } = req.body;
    const country = await Country.findOne({
        _id: countryId,
        isDeleted: false,
    });
    if (!country) {
        throw new NotFound('Country not found');
    }
    country.name = name;
    await country.save();
    return SuccessResponse(res, { message: 'Country updated successfully', data: country }, 200);
});
// edit city
export const editCity = asyncHandler(async (req, res) => {
    const { cityId } = req.params;
    const { name, countryId } = req.body;
    const city = await City.findOne({
        _id: cityId,
        isDeleted: false,
    });
    if (!city) {
        throw new NotFound('City not found');
    }
    const country = await Country.findOne({
        _id: countryId,
        isDeleted: false,
    });
    if (!country) {
        throw new NotFound('Country not found');
    }
    city.name = name;
    city.country = countryId;
    await city.save();
    return SuccessResponse(res, { message: 'City updated successfully', data: city }, 200);
});

// delete country
export const deleteCountry = asyncHandler(async (req, res) => {
    const { countryId } = req.params;
    const country = await Country.findOne({
        _id: countryId,
        isDeleted: false,
    });

    if (!country) {
        throw new NotFound('Country not found');
    }

    await country.deleteOne();

    return SuccessResponse(res, { message: 'Country deleted successfully' }, 200);
});

// delete city
export const deleteCity = asyncHandler(async (req, res) => {
    const { cityId } = req.params;
    const city = await City.findOne({
        _id: cityId,
        isDeleted: false,
    });

    if (!city) {
        throw new NotFound('City not found');
    }

    await city.deleteOne();

    return SuccessResponse(res, { message: 'City deleted successfully' }, 200);
});

// get country by ID
export const getCountryById = asyncHandler(async (req, res) => {
    const { countryId } = req.params;
    const country = await Country.findById({
        _id: countryId,
        isDeleted: false,
    });

    if (!country) {
        throw new NotFound('Country not found');
    }

    return SuccessResponse(res, { message: 'Country retrieved successfully', data: country }, 200);
});

// get city by ID
export const getCityById = asyncHandler(async (req, res) => {
    const { cityId } = req.params;
    const city = await City.findById({
        _id: cityId,
        isDeleted: false,
    }).populate('country', 'name');

    if (!city) {
        throw new NotFound('City not found');
    }

    return SuccessResponse(res, { message: 'City retrieved successfully', data: city }, 200);
});