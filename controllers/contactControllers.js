const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModel")
//@desc Get all contacts
//@route Get /api/contacts
//@access public 

const getContacts = asyncHandler(async (req, res) =>{
    const contacts = await Contact.find({user_id: req.user.id})
    res.status(200).json(contacts)
})



//@desc Get single contact
//@route Get /api/contacts/:id
//@access public 

const getContact = asyncHandler(async (req, res) =>{
    const contact = await Contact.findById(req.params.id)
    if(!contact)
    {
        res.status(404)
        throw new Error("Contact not found")
    }
    res.status(200).json(contact)
})



//@desc Create new contact
//@route Get /api/contacts
//@access public 

const createContact = asyncHandler(async (req, res) =>{
    console.log("the rquest body is :", req.body)
    const {name, email, phone} = req.body
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are required")
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id : req.user.id
    })

    res.status(201).json(contact)
})








//@desc Get all contacts
//@route Get /api/contacts
//@access public 

const updateContact = asyncHandler(async (req, res) =>{
    const contact = await Contact.findById(req.params.id)
    if(!contact)
    {
        res.status(404)
        throw new Error("Contact not found")
    }

    if (contact.user_id.toString() !== req.user.id)
    {
        res.status(403)
        throw new Error("User dont have permission to update other user contacts")
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new : true}
       
    )
    res.status(200).json(updatedContact)
})

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    console.log("Contact ID:", req.params.id);
    

    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString() !== req.user.id)
    {
        res.status(403)
        throw new Error("User dont have permission to update other user contacts")
    }


    await contact.deleteOne({_id: req.params.id});

    res.status(200).json({ message: "Contact deleted" });
});





module.exports = {getContact, createContact, getContacts,updateContact,deleteContact}