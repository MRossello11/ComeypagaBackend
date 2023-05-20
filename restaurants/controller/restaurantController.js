const Restaurant = require('../model/Restaurant');
const { verifyAddress } = require('../../config/verifyAddress');
const fs = require('fs');

// get all restaurants
const getRestaurants = async(req,res) => {
    const restaurants = await Restaurant.find(
        { isDeleted: false },
        { menu: { $elemMatch: { isDeleted: false } }, isDeleted: false },
    ).exec();

    if (!restaurants) return res.sendStatus(204);

    // get images
    const restaurantsWithImages = restaurants.map((restaurant) => {
      if (fs.existsSync(restaurant.picture) && restaurant.picture.length != 0) {
        const image = fs.readFileSync(restaurant.picture);
        const base64Image = Buffer.from(image).toString('base64');
        restaurant.picture = base64Image;
      } else {
        // default picture
        const image = fs.readFileSync("./images/default_image.jpg");
        const base64Image = Buffer.from(image).toString('base64');
        restaurant.picture = base64Image;

      }
      return restaurant;
    });

    res.status(200).json({ "restaurants": restaurantsWithImages });
}

// create new restaurant
const putRestaurant = async(req, res) => {
    const {
        name,
        foodType,
        typology,
        reviewStars,
        phone,
        email,
        address,
        picture
    } = req.body;

    // verify fields
    if(
        !name ||
        !foodType || 
        !typology || 
        !reviewStars || 
        !phone || 
        !email ||
        !picture ||
        !verifyAddress(address)
    ){
        return res.sendStatus(400);
    }

    const duplicate = await Restaurant.findOne({ name: name, isDeleted: false }).exec();

    if(duplicate) return res.status(409).json({ 'message': "Restaurant already exists" });;

    // save picture
    const imageBuffer = Buffer.from(picture, 'base64');

    // Save the image to local storage
    const imagesDir = "./images";
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir);
    }
    const imagePath = `${imagesDir}/${name}_${new Date().getTime()}.jpeg`;
    fs.writeFile(imagePath, imageBuffer, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving the image.');
        }
    });

    // if no duplicate found, create restaurant
    try{
        const result = await Restaurant.create({
            name,
            foodType,
            typology,
            reviewStars,
            phone,
            email,
            address,
            picture: imagePath,
            menu: []
        });


        res.status(201).json({ "restaurant": result});;
    } catch(err){
        res.status(500).json({ 'message': "An error occurred creating the restaurant" });
    }
}

const postRestaurant = async(req, res) => {
    const {
        _id,
        name,
        foodType,
        typology,
        reviewStars,
        phone,
        email,
        address,
        picture
    } = req.body;
    console.log("Post restaurant");

    if(!_id){
        return res.sendStatus(400);
    }

    const foundRestaurant = await Restaurant.findOne({ _id }).exec();

    if(!foundRestaurant){
        return res.status(500).json({'message':'Restaurant not found'});
    }

    // save picture
    const imageBuffer = Buffer.from(picture, 'base64');

    // Save the image to local storage
    const imagesDir = "./images";
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir);
    }
    const imagePath = `${imagesDir}/${name}_${new Date().getTime()}.jpeg`;
    fs.writeFile(imagePath, imageBuffer, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving the image.');
        }
    });

    try{
        const street = address.street;
        const town = address.town;

        // update the non-null parameters
        await Restaurant.updateOne(
            { _id: foundRestaurant._id },
            {
                $set: {
                    name: name ? name : foundRestaurant.name,
                    foodType: foodType ? foodType : foundRestaurant.foodType,
                    typology: typology ? typology : foundRestaurant.typology,
                    reviewStars: reviewStars ? reviewStars : foundRestaurant.reviewStars,
                    phone: phone ? phone : foundRestaurant.phone,
                    email: email ? email : foundRestaurant.email,
                    address: {
                        street: street ? street : foundRestaurant.address.street,
                        town: town ? town : foundRestaurant.address.town
                    },
                    picture: imagePath ? imagePath : foundRestaurant.picture
                }
            }
        );
        res.status(200).json({ "restaurant": foundRestaurant});;
    } catch(err){
        console.error(err);
        res.status(500).json({ 'message': err.message });
    }

}

const deleteRestaurant = async(req, res) => {
    const _id = req.params.id;

    const foundRestaurant = await Restaurant.findOne({ _id }).exec();

    if(!foundRestaurant){
        return res.status(500).json({'message':'Restaurant not found'});
    }

    try {
        await Restaurant.updateOne(
            { _id: foundRestaurant._id },
            { $set: { isDeleted: true }}
        );
        res.status(200).json({ 'message': "Restaurant deleted" });;
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': "An error occurred deleting the restaurant" });
    }

}

const getRestaurant = async(req, res) => {
    console.log("Get restaurant");
    const _id = req.params.id;

    if(!_id){
        return res.sendStatus(400);
    }

    const foundRestaurant = await Restaurant.findOne(
        { _id, isDeleted: false }
    ).exec();

    if(!foundRestaurant){
        return res.status(500).json({'message':'Restaurant not found'});
    }

    const filteredMenu = foundRestaurant.menu.filter((plate) => !plate.isDeleted);

    // get image
    const image = fs.readFileSync(foundRestaurant.picture);
    const base64Image = Buffer.from(image).toString('base64');

    const modifiedRestaurant = {
        _id: foundRestaurant._id,
        name: foundRestaurant.name,
        foodType: foundRestaurant.foodType,
        typology: foundRestaurant.typology,
        reviewStars: foundRestaurant.reviewStars,
        phone: foundRestaurant.phone,
        email: foundRestaurant.email,
        address: foundRestaurant.address,
        picture: base64Image,
        menu: filteredMenu,
    };

    console.log(modifiedRestaurant);

    return res.status(200).json({ "restaurant": modifiedRestaurant });
}

module.exports = {
    getRestaurant,
    getRestaurants,
    putRestaurant,
    postRestaurant,
    deleteRestaurant
}