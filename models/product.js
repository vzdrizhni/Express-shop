const getDb = require('../util/database').getDb;
const mongoDb = require('mongodb')

class Product {
  constructor(title, price, imageUrl, description, id) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this.id = id;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this.id) {
      dbOp = db.collection('products').updateOne({_id: new mongoDb.ObjectId(this.id)}, {$set: this})
    } else {
      dbOp = db.collection('products').insertOne(this)
    }
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        throw err
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(result => {
        console.log(result);
        return result;
      })
      .catch()
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .find({_id: new mongoDb.ObjectId(prodId)})
      .next()
      .then(prod => prod)
      .catch()
  }
}

module.exports = Product;
