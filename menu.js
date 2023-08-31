var express = require('express');
var router = express.Router();
const { verifyToken } = require('./middleware/auth');
const menuModel = require('./models/menu.model');
const { writeMessageToQueue } = require('./aws');



// add new menu
router.post('/addMenu', verifyToken('admin'), (req, res) => {
    const post = new menuModel({
        item: req.body.item,
        quantity: req.body.quantity,
        description: req.body.description,
    })
    writeMessageToQueue({
        name:'AddMenu',
    })
    post.save();
    res.status(201).json({message:"Menu Item Added Succesfully"});
})

// List of menu items without pagination

router.get('/getMenuList', verifyToken('admin'), async (req, res) => {
    try {
        const data = await menuModel.find();
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// List of menu items with pagination

router.get('/getMenuList/:page', verifyToken('admin'), async (req, res) => {
    const resultsPerPage = 5;
    let page = req.params.page >= 1 ? req.params.page : 1;
    // const query = req.query.search;
    page = page - 1
    menuModel.find()
        // .select("item")
        .sort({ name: "asc" })
        .limit(resultsPerPage)
        .skip(resultsPerPage * page)
        .then((results) => {
            return res.status(200).send(results);
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
})

// FInd by Id and update menu
router.get('/getMenuById/:id', verifyToken('admin'), async (req, res) => {
    try {
        const data = await menuModel.findOneAndUpdate({ _id: req.params.id }, { $set: { item: req.body.item, quantity: req.body.quantity, description: req.body.description } });
        writeMessageToQueue({
            name:'UpdateMenu',
        })
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// delete a menu
router.delete("/deleteMenu/:id", verifyToken('admin'), async (req, res) => {
    let result = await menuModel.findByIdAndRemove(req.params.id);
    res.send(result).status(200);
});

module.exports = router;