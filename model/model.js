const mongoose = require('mongoose');

//schema for the voltage data
const voltageData = new mongoose.Schema({
    
    //Who
    sensorId: {               
        required: true,
        type: Number
    },
    tags: {
        firmwareVersion: String,
        hardwareVersion: String,
        model: String
    },

    //Where
    location: {
        lat: String,
        lon: String
    },

    //When
    timestamp: {
        required: true,
        type: Date
    },

    //What
    voltage: {
        require: true,
        type: Number
    }

    //Suggested approach
    /*
    values: {  
        status: String,
        voltage: Number,
        efficiencyRate: Number
    }
    */
},
{
    //createdAt, updatedAt
    timestamps: true
}
)

module.exports = mongoose.model('voltagedatas', voltageData)