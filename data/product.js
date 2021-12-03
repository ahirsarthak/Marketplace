const mongoCollections = require('../config/mongoCollections');
const product = mongoCollections.product;
const { ObjectId } = require('bson');

async function create(productName, description,price) {

    if (!productName) throw [400,"You must provide with all the details"];
    if (!description) throw[400,"You must provide with all the details"];
    if (!price) throw[400,"You must provide with all the details"];

    if (typeof productName!='string') throw[400,"You must provide string for product Name"];
    var res = productName.replace(/ /g, "");
    if(res==0) throw[400,"Invalid Product Name"];

    if (typeof description!='string') throw[400,"You must provide string for description"];
    res = description.replace(/ /g, "");
    if(res==0) throw[400,"Invalid Description"];

    if (price < 0) throw[400,"You must provide valid price"];
    
    const productCollection = await product();

    let newProduct = {
        productName: productName,
        description: description,
        image: null,
        sellerId: null,
        purchased: false,
        price: price,
        comments: []
    };
      
    const insertInfo = await productCollection.insertOne(newProduct);
    const newId = insertInfo.insertedId;
    const productList = await this.get(newId);
    productList["_id"] = productList["_id"].toString();
    return productList;

}

async function getProduct(id) {

    if (!id) throw[400,"You must provide an id to search for"];
  
    if(typeof id !="object" && typeof id !="string") throw[400,"Error: You must provide an id in string"]; 

    //if(ObjectId.isValid(id)==false)  throw[400,"Invalid ObjectId"];

    let parsedId = ObjectId(id);
    
    const productCollection = await product();
    const products = await productCollection.findOne({ _id: parsedId });
    
    if (products === null) throw[404,"Product Not found"];
    products["_id"] = products["_id"].toString(); 

    return products;
}
async  function getAll(){
    const productCollection = await product();
    const productList = await productCollection.find({}, {projection: {productName: 1, image: 1, price: 1}}).toArray();
    return productList;
}

async function createcomment(productId,comment){

    if(typeof comment !=='string'){
        throw 'Error: The input is not a string'
    }

    const productsCollection = await product();
    let objid=  ObjectId(productId)
    
    let newcomment={ 
        username: 'username',
        comment:comment
    }

    const z = await productsCollection.updateOne({_id:objid},{$addToSet:{comments: newcomment}});
    let userInserted=true

    if (z.insertedCount === 0){
        userInserted=false;
        throw 'Insert failed!';
    }
    let prod= await productsCollection.findOne({ _id: objid });
    
    if (prod === null){ 
        throw 'Error: No product with that id create comment';
    } 
    return true
}

module.exports = {
    create,
    getProduct,
    getAll,
    createcomment
}
