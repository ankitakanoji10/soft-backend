const express = require("express");
const { userProfileController,
    addSkillController,
    allUserController,
    addCourseController,
    ProfilePhotoController,
    getPhotoController,
    getAllCoursesController,
    getAllProjectsController,
    addPhotoController,
    searchUserController,
    deletePhotoController,
    getProfileController,
    ProfileCoursesController,
    ProfileProjectsController} = require("../controllers/UserController.js");
const router = express.Router();
const formidableMiddleware = require('express-formidable');

router.get("/profile-photo", ProfilePhotoController); // call in use effect  for profile (checked)
router.get("/all-user", allUserController); // use effect for all users page (checked)

router.get("/setup-profile", getProfileController); // user's profile(only authenticated user can access)(checked)
router.put("/add-skills", addSkillController); //(checked)

router.delete("/delete-photo", deletePhotoController);//(checked)
router.put("/add-course", addCourseController); //(checked)

router.get("/profile-courses", ProfileCoursesController); // use effect  (checked)
router.get("/profile-projects", ProfileProjectsController); // use effect(checked)

router.put("/add-photo",formidableMiddleware(), addPhotoController);//(checked)
router.get("/:id", userProfileController);   //(checked)
router.get("/:id/get-photo", getPhotoController); // call in use effect  (checked)
router.get("/:id/all-courses", getAllCoursesController); // use effect  (checked)
router.get("/:id/all-projects", getAllProjectsController); // use effect (checked)
router.get("/search-user/:keyword", searchUserController);  //checked

module.exports = {profileRoutes: router};