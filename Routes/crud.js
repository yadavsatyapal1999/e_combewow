const express = require('express');
const multer = require('multer');
const addSchema = require('../Schema/addproduct');
const crudrouter = express.Router();
const path = require('path')

//  Giving path and file name  for newly added file in multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage });


// To List new product

crudrouter.post('/addproduct', upload.single("productimage"), (req, res) => {

    const data = req.body;
    const productdetail = new addSchema({

        name: data.name,
        price: data.price,
        details: data.details,
        image: req.file.filename,
        stock: data.stock,
        category: data.category

    })

})




//To get Product list on home page frontend

crudrouter.get("/", (req, res) => {
console.log("get request")

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;


    addSchema.find().skip(skip).limit(limit).then(result => {
        res.status(200).json({
            message: "Products details fetched successfully",
            data: result
        })
    }).catch(err => {
        res.status(500).json({
            message: "Internal server error",
            error: err
        })
    })
})

// TO give result of search

crudrouter.get("/search",async (req,res)=>{
    console.log("search request")
    const query = req.query.query;
    console.log(query)
    try {
        // Use regular expression to match words in name and details fields
        const products = await addSchema.find({
            $or: [
                { name: { $regex: query, $options: "i" } }, //i used for Case-insensitive search for name
                { details: { $regex: query, $options: "i" } } //iused for Case-insensitive search for details
            ]
        });

        if(!products){
            return res.status(404).json({message:"Product not listed Yet"})
        }
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "No producte listed" });
    }

})

// To update data
crudrouter.patch("/update:id",upload.single('image'), async (req, res) => {
    console.log("update request")
    const productId = req.params.id;
    const updateFields = req.body;

    if(req.file){
        updateFields.image = req.file.path
    }

    try {
        const product = await addSchema.findByIdAndUpdate(productId, updateFields, { new: true });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});


// TO delete data
crudrouter.delete("/delete:id", async (req, res) => {
    console.log("delete request")
    const productId = req.params.id;

    try {
        const product = await addSchema.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});
