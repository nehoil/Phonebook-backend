const contactService = require('./contact.service')

async function getContact(req, res) {
    const contact = await contactService.getById(req.params.id)
    res.send(contact)
}
  
async function getContacts(req, res) {
    const contacts = await contactService.query(req.query)
    res.send(contacts)
}

async function deleteContact(req, res) {
    await contactService.remove(req.params.id)
    res.end()
}

async function updateContact(req, res) {
    const contact = req.body;
    await contactService.update(contact)
    console.log(contact);
    res.send(contact)
}

async function addContact(req, res) {
    const contact = req.body;
    await contactService.add(contact)
    res.send(contact)
}

module.exports = {
    getContact,
    getContacts,
    deleteContact,
    updateContact,
    addContact
}