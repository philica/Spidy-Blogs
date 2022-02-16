const express = require('express')
const mongoose = require('mongoose')
const chalk = require('chalk')
const Blog = require('./models/blog')
const { render } = require('ejs')

//creasting express app 
const app = express()

//database url
const dbUrl = 'mongodb+srv://philica:sabifithawok@cluster0.1c5jn.mongodb.net/spidysBlog?retryWrites=true&w=majority'

// connecting to database 
mongoose.connect(dbUrl,{useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(4000))
    .catch((err) => console.log(chalk.red(err)))

//registering view engine
app.set('view engine','ejs')

//middleware and static files
app.use( express.static( "public" ) );
app.use(express.urlencoded({extended: true}))


// routing to about page
app.get('/create',(req,res) => {
    res.render('create')
})

//routing to homepage
app.get('/',(req,res) => {
    Blog.find()
   .then((result) => {
       res.render('index',{blogs: result}) 
   })
   .catch((err) => {
       console.log(chalk.red.inverse(err))
   })
   
})

app.get('/login',(req,res) => {
    res.render('login')
})

//return all blog
app.get('/blogs',(req,res) => {
    Blog.find()
   .then((result) => {
       res.render('blogs',{blogs: result}) 
   })
   .catch((err) => {
       console.log(chalk.red.inverse(err))
   })
   
})

app.get('/blogs/:id', (req,res) => {
    const id = req.params.id;
    console.log ('id ' + id)
    Blog.findByIdAndDelete(id)
    .then(result => {
        res.redirect('/')
    })
    .catch(err => {
        console.log(err)
    })
})

//sending blog data
app.post('/', (req,res) => {
    const blog = new Blog(req.body)
    blog.save()
    .then((result) => {
        res.redirect('/')
    })
    .catch((err) => {
        console.log(err)
    })

})

app.get('/:id', (req,res) => {
    const id = req.params.id
    Blog.findById(id)
    .then((result) => {
        res.render('details', {blogs: result})
    })
    console.log(id)
})

//routing for 404 pages
app.use((req,res) => {
     res.send('<h1>404 page</h1>')
})

