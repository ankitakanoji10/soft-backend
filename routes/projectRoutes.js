const express = require("express");
// const upload = require("../multerconfig.js");
const { createProjectController,
    editProjectController,
    
    deleteProjectController,
    getSingleProject,
    getPhotoController,
    getRating,
    getComments,
    postRating,
    postComment,
    addContributorController,
    getHelpController,
    addHelpController,
    addVideoController,
  getVideoController,
  getContributorController,
  getOwnerController} = require("../controllers/ProjectController.js");

const router = express.Router();
const multer = require('multer');
const formidable = require('express-formidable')
//multer options
const upload = multer({
  dest: './upload/',
  limits: {
    fileSize: 10000000,
  }
})
// const config = {
//     api: {
//       bodyParser: false
//     }
//   }
router.post("/create-project",formidable(), createProjectController); // only authenticated user can create project(checked)
router.put("/:pid/edit-project",formidable(), editProjectController); // its controller will match userid to owner which is an id and then only the edit project can be done(chekced)
router.get("/:pid/get-contributor", getContributorController); //checked
router.get("/:pid/photo", getPhotoController); //get photo call in use effect (checked)
router.put("/:pid/add-contributor", addContributorController); // only owner can add contributor(checked)
router.get("/:pid/get-owner", getOwnerController);
router.delete("/:pid/delete-project", deleteProjectController); // only owner can delete project(delete)
router.get("/:pid", getSingleProject); //(checked)
router.get("/:pid/rating", getRating); // call in use effect(checked)
router.get("/:pid/ask-for-help", getHelpController); // call in use effect fetches ask for help section (checked)
router.put("/:pid/add-help", addHelpController); // only authenticated user can add help(Checked)
router.get("/:pid/comments", getComments); // call in use effect(checked)
router.post("/:pid/post-rating", postRating); //checked
router.put("/:pid/post-comment", postComment); // only authenticated user can comment (checked)
router.put("/:pid/add-video",formidable(), upload.single('video'), addVideoController); // only owner can add video(checked)
router.get("/:pid/get-videos", getVideoController); // call in use effect (checked)
module.exports = {projectRoutes: router};