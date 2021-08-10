var express = require('express');
var router = express.Router();

//get word by id
router.get('/:wordid', (req, res, next) => {
    res.send("get request on word " + req.params.wordid);
});

//put word by id
router.put('/:wordid', (req, res, next) => {
    res.send("put request on word " + req.params.wordid);
})

//delete word by id
router.delete('/:wordid', (req, res, next) => {
    res.send("delete request on word " + req.params.wordid);
})

//post word
router.post('/', (req, res, next) => {
    res.send("post request on word");
});

module.exports = router;
