import stringSchema from "../../Models/stringSchema.js";
import { analyseString } from "../../utils/stringUtils.js";

export const createString = async (req, res) => {
    try {
        const {value} = req.body;
        if (typeof value !== "string") 
            return res.status(422).json({message: "value must be a string"});
        
        const properties = analyseString(value);
        const exists = await stringSchema.findOne({id: properties.sha256_hash });
        if (exists) return res.status(409).json({message: "String already exists"});

        const newString = await stringSchema.create({
            id: properties.sha256_hash,
            value,
            properties,
        });

        res.status(201).json(newString);

    } catch (error) {
        res.status(400).json({Message: error.Message });
    }
};


export const getString = async (req, res) => {
    const { string_value } = req.params;
    const result = await stringSchema.findOne({ value: string_value});
    if (!result) return res.status(404).json({message: "String not found"});
    res.json(result);
};


export const getAllString = async (req, res) => {
    const filter = {};
    const {is_palindrome, min_length, max_length, word_count, contains_character } = req.query;

    if (is_palindrome) filter["properties.is_palindrome"] = is_palindrome === "true";
    if (min_length || max_length) {
     filter["properties.length"] = {};
    if (min_length) filter["properties.length"].$gte =Number(min_length);
    if (max_length) filter["properties.length"].$lte =Number(max_length);
    }
    if (word_count) filter["properties.word_count"] = Number(word_count);
    if (contains_character) filter.value = {$regex: contains_character, $options: "i"};

    const data = await stringSchema.find(filter);
    res.json({data, count: data.length, filters_applied: req.query });
};

export const deleteString = async (req, res) => {
    const { string_value } = req.params;
    const deleted = await stringSchema.findOneAndDelete({ value: string_value});
    if (!deleted) return res.status(404).json({ message: "String not found"});
    res.status(204).send();
};