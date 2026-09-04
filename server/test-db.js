import mongoose from 'mongoose';
mongoose.connect('mongodb://janinduac_db_user:BF7SDlds9Igxe1ZZ@ac-nx2opj8-shard-00-00.qtzokmg.mongodb.net:27017,ac-nx2opj8-shard-00-01.qtzokmg.mongodb.net:27017,ac-nx2opj8-shard-00-02.qtzokmg.mongodb.net:27017/syncboard?ssl=true&replicaSet=atlas-8415qi-shard-0&authSource=admin&retryWrites=true&w=majority').then(() => {
  console.log('Connected!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
