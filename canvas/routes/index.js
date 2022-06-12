var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var data=[
    {href:'/main' , text:'mein画面へ！'},
    {href:'/hello/add' , text:'アカウント追加'},
    {href:'/hello/find', text:'アカウント検索'},
    {href:'/hello/delete', text:'アカウント削除'}
  ]
  res.render('index', {
    title: 'Canvas',
    link:data,

  });
});



module.exports = router;
