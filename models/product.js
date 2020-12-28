const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Product', productSchema);

// const getDb = require('../util/database').getDb;
// const mongoDb = require('mongodb')

// class Product {
//   constructor(title, price, imageUrl, description, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this._id = id ? id : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db.collection('products').updateOne({_id: new mongoDb.ObjectId(this._id)}, {$set: this})
//     } else {
//       dbOp = db.collection('products').insertOne(this)
//     }
//     return dbOp
//       .then(result => {
//         console.log(result);
//       })
//       .catch(err => {
//         throw err
//       });
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection('products')
//       .find()
//       .toArray()
//       .then(result => {
//         return result;
//       })
//       .catch()
//   }

//   static findById(prodId) {
//     const db = getDb();
//     return db
//       .collection('products')
//       .find({_id: new mongoDb.ObjectId(prodId)})
//       .next()
//       .then(prod => prod)
//       .catch()
//   }

//   static deleteById(prodId) {
//     const db = getDb();
//     return db.collection('products').deleteOne({_id: new mongoDb.ObjectId(prodId)})
//   }
// }

// module.exports = Product;
