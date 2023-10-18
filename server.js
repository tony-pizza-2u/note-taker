const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();
const port = 3000;
const PUBLIC_DIR = 'public';
const DB_FILE = 'db/db.json';

var db = [];


try{
    
    db = JSON.parse(fs.readFileSync(DB_FILE));

} catch(err){
    
    console.log('Unable to read DB file');
    console.log(err);
    
    process.exit(1);

}

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

app.get('/', (reg, res) => {
    res.sendFile('index.html', {root: PUBLIC_DIR});
});

app.get('/notes', (reg, res) => {
    res.sendFile('notes.html', {root: PUBLIC_DIR});
});

app.get('/api/notes', (req, res) => {
    res.json(db);
});

app.post('/api/notes', (req, res) => {
    
    try{

        note = req.body;
        note.id = uuidv4();
    
        db.push(req.body);
        
        fs.writeFileSync(DB_FILE, JSON.stringify(db));

        res.json(db);

    } catch(err){
        
        console.log('Unable to save new note');
        console.log(err);

        next(err);
    }
    

});

app.delete('/api/notes/:id', (req, res) => {

    try{
        
        for(i = 0; i < db.length; i++){

            if(db[i].id == req.params.id){
                db.splice(i, 1);
            }
        }

        fs.writeFileSync(DB_FILE, JSON.stringify(db));

        res.json(db);

    } catch(err){

        console.log('Unable to delete note');
        console.log(err);

        next(err);

    }


});

app.listen(port, () => {
    console.log('Note taker started on port:' + port);
})