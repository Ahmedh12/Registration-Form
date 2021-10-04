const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());

mongoose.connect("mongodb+srv://admin_ahmed:QeL4sOokc6cQzQjW@reservation.frbmk.mongodb.net/reservation?retryWrites=true&w=majority");

const reservationSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    email: { type: String, unique: true },
    studentNumber : { type: String, unique: true },
    parentNumber : { type: String, unique: true },
    center: { type: String, required: true },
    grade: { type: String, required: true }
});

const Reservation = mongoose.model("reservation",reservationSchema);



app.listen(process.env.PORT || 3000,()=>{
    console.log("Server Started");
});



app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});

app.post("/",(req,res)=>{
    const reservation = new Reservation({
        name : req.body.name,
        email : req.body.email,
        studentNumber : req.body.st_no,
        parentNumber : req.body.pr_no,
        center : req.body.center,
        grade : req.body.Grade
    })

    if(req.body.st_no == req.body.pr_no)
    {
        res.sendFile(__dirname+"/sameNumberError.html"); 
    }

    if(req.body.name.split(" ").length-1 < 2)
    {
        res.sendFile(__dirname+"/nameError.html"); 
    }

    if(req.body.center == " ")
    {
        res.sendFile(__dirname+"/centerError.html"); 
    }

    if(req.body.Grade == " ")
    {
        res.sendFile(__dirname+"/gradeError.html"); 
    }

    Reservation.find({email : req.body.email},(err,reservation)=>{
        if(err)
        {
            console.log(err);
        }else if(reservation)
        {
            res.sendFile(__dirname+"/success.html");
        }
    });

    Reservation.find({studentNumber : req.body.st_no},(err,reservation)=>{
        if(err)
        {
            console.log(err);
        }else if(reservation)
        {
            res.sendFile(__dirname+"/success.html");
        }
    });

    Reservation.find({parentNumber : req.body.parentNumber},(err,reservation)=>{
        if(err)
        {
            console.log(err);
        }else if(reservation)
        {
            res.sendFile(__dirname+"/success.html");
        }
    });

    reservation.save((err)=>{
        if(err)
        {
            res.sendFile(__dirname+"/failure.html");
        }else
        {
            res.sendFile(__dirname+"/success.html");
        }
    });

    
});

app.post("/failure",(req,res)=>{
    res.redirect("/");
});


app.get("/stats",(req,res)=>{
    res.sendFile(__dirname+"/auth.html");
});


app.post("/auth",(req,res)=>{
    if(req.body.name == "Moustafa_Tamer" && req.body.password == "f90cdd349f")
    {
        Reservation.find((err,reservation)=>{
            if(err)
            {
                res.sendFile(__dirname+"/failure.html");
            }else{
                res.write("<h1 style='text-align:center'>Basmalla Dokki</h1>");
                res.write("<table><tr>")
                res.write("<th style='padding:20px'>Name</th><th style='padding:20px'>phone</th></tr>");
                reservation.forEach(element => {
                    if(element.center == "Basmalla-Dokki")
                    res.write("<tr><td style='padding:20px'>"+element.name+"</td><td style='padding:20px'>"+element.studentNumber+"</td></tr>");
                });
                res.write("</table>");
                res.send();
            }
        });
    }else
    {
        res.sendFile(__dirname+"/failure.html");
    }
});
