const express = require('express');

const router = express.Router();

const Model = require('../model/model.js');

module.exports = router;

let timeRangeData = require('../constants/constants.js').timeRanges;

//Post Method
router.post('/post', async (req, res) => {
    console.log("/post Called :: ", req.body.sensorId);
    const data = new Model({
        sensorId: req.body.sensorId,
        timestamp: new Date(),
        voltage: req.body.voltage
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get all Method
router.get('/getAll', async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        console.log("/getAll Called");
        let data;
        //console.log(" Headers : ", JSON.stringify(req.headers));

        //If time period is selected by the user - 1m, 15m, 1h, 6h, 12h
        if (req.headers.timeperiod != "24h") {
            let startDate = new Date("2023-03-10 10:00:00");

            //Adding the selected time range in milliseconds
            let endDate = new Date(startDate.getTime()
                + timeRangeData[req.headers.timeperiod]);

            //Calling the DB 
            data = await Model.find({
                timestamp: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
        }
        //If time period is not selected by the user - default loading time is 24h
        else {
            //Calling the DB 
            data = await Model.find();
        }
        res.json(data)
    }
    catch (error) {
        console.log("Error during getAll operation");
        res.status(500).json({ message: error.message })
    }
})

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Post Sample Data
router.post('/bulkPost', async (req, res) => {
    console.log("/post Called :: ", req.body.gen);
    if (!req.body.gen == "true") {
        res.send("gen value not enabled");
    }

    //Initial Date - 2023-03-10 10:00:00 AM
    let currentDate = new Date("2023-03-10 10:00:00");
    let voltage = 0;
    let sensordId = 1;
    let increaseV = true;
    let data;

    try {
        //Generate data point for every 10 seconds until 24hrs
        for (let i = 0; i < 8640; i++) {

            //Add 10seconds for every iteration         
            currentDate = new Date(currentDate.getTime() + 10000); //time in milliseconds

            if (voltage.toFixed(2) == 0) {
                increaseV = true
            } else if (voltage.toFixed(2) == 5) {
                increaseV = false
            }

            if (increaseV) {
                voltage = voltage + 0.01;

            } else {
                voltage = voltage - 0.01
            }

            //data point
            data = new Model({
                sensorId: sensordId,
                timestamp: currentDate,
                voltage: voltage.toFixed(2)
            });
            dataToSave = await data.save();
        }

        res.status(200).json(dataToSave)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

    console.log("Done !");
    return data.length;

})

