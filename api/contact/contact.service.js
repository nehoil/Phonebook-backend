
const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const crypto = require('crypto')
const delay = require('delay');


module.exports = {
    query,
    getById,
    getByEmail,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    await delay(1500);
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('contact')
    try {
        const contacts = await collection.find(criteria).toArray();
        contacts.forEach(contact => delete contact.password);

        return contacts
    } catch (err) {
        console.log('ERROR: cannot find contacts')
        throw err;
    }
}

async function getById(contactId) {
    const collection = await dbService.getCollection('contact')
    try {
        const contact = await collection.findOne({ '_id': +contactId })
        // console.log(ObjectId(contactId));
        return contact
    } catch (err) {
        console.log(`ERROR: while finding contact ${contactId}`)
        throw err;
    }
}


function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.term) {
        const term = filterBy.term
        criteria.$or = [{ email: { $regex: term } }, { message: { $regex: term } }]
    }
    // if (filterBy.inStock !== 'all' && filterBy.inStock !== undefined) {
    // criteria.inStock = JSON.parse(filterBy.inStock)
    // }
    return criteria;
}

async function getByEmail(email) {
    const collection = await dbService.getCollection('contact')
    try {
        const contact = await collection.findOne({ email })
        return contact
    } catch (err) {
        console.log(`ERROR: while finding contact ${email}`)
        throw err;
    }
}

async function remove(contactId) {
    const newId = contactId + ''
    const collection = await dbService.getCollection('contact')
    try {
        await collection.deleteOne({ '_id': ObjectId(newId) })
    } catch (err) {
        console.log(`ERROR: cannot remove contact ${contactId}`)
        throw err;
    }
}

async function update(contact) {
    console.log('update contact', contact);
    const collection = await dbService.getCollection('contact')
    contact._id = ObjectId(contact._id);
    try {
        await collection.updateOne({ _id: contact._id }, { $set: contact })
        return contact
    } catch (err) {
        console.log(`ERROR: cannot update contact ${contact._id}`)
        throw err;
    }
}

async function add(contact) {
    const imgHex = crypto.createHash('md5').update(contact.email).digest('hex')
    contact.img = imgHex
    const collection = await dbService.getCollection('contact')
    try {
        await collection.insertOne(contact);
        return contact;
    } catch (err) {
        console.log(`ERROR: cannot insert contact`)
        throw err;
    }
}



