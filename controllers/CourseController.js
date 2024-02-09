const Course = require('../models/Course.js');
const User = require('../models/User.js');
const slugify = require('slugify');
const createCourseController = async (req, res) => {
  try {
    if (!req.user)
    {
      return res.status(401).send({
        success: false,
        message: "Error user not authenticated",
        
    })
    }
    const user = await User.findById(req.user._id).select("-photo");
    if (!user)
    {
      return res.status(401).send({
        success: false,
        message: "Error user not found",
        error,
    })
    }
    console.log(req.body.name);
        
    var courseFields = {
      name : req.body.name,
      description: req.body.description,
      comments: req.body.comments,
       rating:parseInt(req.body.rating,10)
        }
        //alidation
      // switch (true) {
      //   case !req.body?.name:
      //     return res.status(500).send({ error: "Name is Required" });
        
      // }
  
      const course = new Course({ ...courseFields, slug: slugify(courseFields.name) });
    

    await course.save();
    user.courses.push(course);
    await user.save();
      res.status(201).send({
          success: true,
          message: "course created successfully",
          course
      })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while creating course",
            error,
        })
    }
}
const editCourseController = async (req, res) => {
  try {
    if (!req.user)
    {
      return res.status(401).send({
        success: false,
        message: "Error user not authenticated",
        
    })
    }
    const user = await User.findById(req.user._id).select("-photo");
    if (!user)
    {
      return res.status(401).send({
        success: false,
        message: "Error user not found",
        error,
    })
    }
    console.log(req.body.name);
        
    var courseFields = {
      name : req.body.name,
      description: req.body.description,
      comments: req.body.comments,
       rating:parseInt(req.body.rating,10)
        }
        //alidation
    
      const course = await Course.findByIdAndUpdate(
        req.params.cid,
        { ...courseFields, slug: slugify(courseFields.name) },
        { new: true }
      );
      
      await course.save();
      res.status(201).send({
        success: true,
        message: "Course Updated Successfully",
        course,
      });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while creating course",
            error,
        })
    }
}
const getSingleCourse = async (req, res) => {
    try {
        const course = await Course
            .findById(req.params.cid);
        res.status(200).send({
          success: true,
          message: "Single Course Fetched",
          course,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Eror while getting single course",
          error,
        });
      }
    
}

const getAllCourses = async (req, res) => {
    try {
        const course = await Course.find({});
        res.status(200).send({
            success: true, 
            message: "all courses fetched",
            total:course.length,
            course, 
            
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in get course",
            error
        })
    }
    
}

const getRating = async (req, res) => {
    try {
        const course = await Course
            .findById(req.params.cid);
        const rating = course.rating;
        res.status(200).send({
          success: true,
          message: "Rating fetched",
          rating,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "error while getting rating",
          error,
        });
      }
    
}
const getComments = async (req, res) => {
    try {
        const course = await Course
            .findById(req.params.cid);
        const comment = course.comments;
        res.status(200).send({
          success: true,
          message: "Comment fetched",
          comment,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "error while getting comment",
          error,
        });
      }
    
}
const postRating = async (req, res) => {
    try {
        const { userrating } = req.body;
        const course = await Course
            .findById(req.params.cid);
        if (!course) {
            return res.status(404).send({
                success: false,
                message: "Course not found",
            });
        }
        course.cumulativeRating += parseInt(userrating);
        course.numberOfRatings += 1;
        console.log(course.cumulativeRating);
        console.log(course.numberOfRatings);
        course.rating = course.cumulativeRating / course.numberOfRatings;
        const rating = course.rating;
        const updatedCourse = await course.save();
        res.status(200).send({
          success: true,
          message: "rating updated",
          rating,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "error while updating rating",
          error,
        });
      }
}
const postComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).send({
        success: false,
        message: "user not authenticated",
        error,
      })
    }
      const user = await User.findById(req.user._id).select("-photo");
      if (!user)
      {
        return res.status(401).send({
          success: false,
          message: "Error user not found",
          error,
      })
      }
        const { comment } = req.body;
        const course = await Course
            .findById(req.params.cid);
        if (!course) {
            return res.status(404).send({
                success: false,
                message: "Course not found",
            });
        }
        course.comments.push(comment);
        const comments = course.comments;
        const updatedCourse = await course.save();
        res.status(200).send({
          success: true,
          message: "Comment fetched",
          comments,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "error while getting comment",
          error,
        });
      }
}
const searchCourseController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await Course
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      });
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search course API",
      error,
    });
  }
}
const deleteCourseController = async (req, res) => {
  try {
    const loggedin = req.user;
    if (!loggedin)
    {
      return res.status(401).send({
        success: false,
        message: "user not loggedin",
    });
    }
    const cou = await Course.findById(req.params.cid);
    if (!cou)
    {
      return res.status(404).send({
        success: false,
        message: "course not found",
      })  
    }
    
    const modifiedUser = await User.findByIdAndUpdate(loggedin._id, {
      $pull: { courses: req.params.cid } 
    });
        res.status(200).send({
          success: true,
          message: "Course Deleted successfully",
          modifiedUser,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error while deleting course",
          error,
        });
      }
}
module.exports = {
    createCourseController,
    editCourseController,
    getSingleCourse,
    getAllCourses,
    getRating,
    getComments,
    postRating,
    postComment,
  searchCourseController,
  deleteCourseController
    
}