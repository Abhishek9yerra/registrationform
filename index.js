const express=require("express")
const mongoos=require("mongoose")
const bodyParser=require("body-parser")
const dotenv=require("dotenv");
const { default: mongoose } = require("mongoose");


const app=express();
dotenv.config();
const username=process.env.MONGO_USERNAME
const password=process.env.MONGO_PASSWORD


const port=process.env.PORT || 3000;
mongoos.connect(`mongodb+srv://${username}:${password}@cluster0.kiha57b.mongodb.net/registrationDB`,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
// registration schema
const registrationSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
})
//creating model of the registrtion
const registration=mongoose.model('Registration',registrationSchema)

app.use(express.urlencoded({extended:true}));
app.use(express.json());



app.get("/",(req,res)=> {
    res.sendFile(__dirname + "/pages/index.html");
})
app.post('/register',async(req,res)=>{
    try{
    const {name,email,password}=req.body;
    const existingUser=await registration.findOne({email:email});
    if(!existingUser){
        const registrationdata=new registration(
            {
                name,
                email,password
            }
        );
        await registrationdata.save();
        console.log(registrationdata)
        res.redirect("/success")
    }
    else{
        console.log("user already exist")
        res.redirect("/error")
    }
    
    }   
    catch(error){
        console.log(error)
    res.redirect("/error")
    }
})
app.get("/success",(req,res)=>{
    res.sendFile(__dirname + "/pages/success.html")
})
app.get("/error",(req,res)=>{
    res.sendFile(__dirname + "/pages/error.html")
})

app.listen(port,()=>{
    console.log(`server started sucessfully running on ${port}`)
})