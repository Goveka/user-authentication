const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  tittle: {type: String},
  author: {type: String},
  contentImageUrl: {type: String},
  imageSrc:{type: String},
  firstParagraph:  {type: String},
  searchKeywords: {type: Array},
  other: {type: String},
  date: {
    type: String,
    default: Date.now
  },
  catergory: {type: String}
});

module.exports = mongoose.model('Blog', blogSchema);
