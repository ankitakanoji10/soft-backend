const express = require("express");
const { createCourseController,
    editCourseController,
    getSingleCourse,
    getAllCourses,
    getRating,
    getComments,
    postRating,
    postComment,
    searchCourseController,
    deleteCourseController
    } = require("../controllers/CourseController.js");

const router = express.Router();
const formidableMiddleware = require('express-formidable')
router.post("/create-course", createCourseController); // only autheticated user can create course (checked)
router.get("/all-courses", getAllCourses); //(checked)
router.get("/single-course/:cid", getSingleCourse);// call in use effect for all courses page (checked)
router.put("/:cid/edit-course", editCourseController); // only authenticated users can edit course (checked)
router.get("/:cid/rating", getRating);     // call in use effect (checked)
router.delete("/:cid/delete-course", deleteCourseController);
router.get("/search-course/:keyword", searchCourseController); //checked

router.get("/:cid/comments", getComments); // call in use effect (checked)
router.post("/:cid/post-rating", postRating);// call in use effect (checked)
router.post("/:cid/post-comment", postComment); // only authenticated users can post comment  (checked)


module.exports = {courseRoutes: router};