const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-session");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

const { render } = require("ejs");
const { get } = require("./users/UsersController");

// View engine
app.set("view engine", "ejs");

// Sessions
app.use(session({
    secret: "qualquercoisaaleatoria",
    cookie: {maxAge: 30000000}
}));

// Static
app.use(express.static("public"));

// Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database
connection
    .authenticate()
    .then(() => {
        console.log("Conectado ao banco de dados!");
    }).catch((error) => {
        console.log(error);
    })


// rotas
app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });        
    });
});

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });   
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
});

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("O servidor está rodando!");
});