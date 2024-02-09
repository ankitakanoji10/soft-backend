const { default: slugify } = require("slugify");
const Course = require("../models/Course.js");
const User = require("../models/User.js");
const Project = require("../models/Project.js");
const fs = require("fs");
const userProfileController = async (req, res) => {
    try {
        const user = await User
          .findById(req.params.id)
          .select("-photo");
        if (!user)
        {
            return res.status(404).send({
                success: false,
                message: "user not found",
            });
        }
        res.status(200).send({
          success: true,
          message: "Single User Fetched",
          user,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Eror while getitng single user",
          error,
        });
      }
}
const addCourseController = async (req, res) => {
  
  try {
      
      const { course } = req.body;
      const courseslug = slugify(course, {lower:true});
      const reqcourse = await Course.findOne({ slug: courseslug });
      if (!reqcourse)
      {
        return res.status(404).send({
          success: false,
          message: "Course not found",
        });
    }
   
    const loggedin = req.user;
    
      if (!loggedin)
      {
        return res.status(401).send({
          success: false,
          message: "not loggedin",
        });
    }
    const user = await User.findById(loggedin._id);
      
      user.courses.push(reqcourse);
      const updatedUser = await user.save();
      res.status(200).send({
        success: true,
        message: "courses added",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Eror while adding course",
        error,
      });
    }
    
}
const getProfileController = async (req, res) => {
  
    try {
      const user = req.user;
        if (!user)
        {
            return res.status(401).send({
                success: false,
                message: "user not logged in",
            });
        }
        res.status(200).send({
          success: true,
          message: "Profile Fetched",
          user,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Eror while getitng single user",
          error,
        });
      }

}

const addSkillController = async (req, res) => {
    try {
      const {skills} =req.body;
      const loggedin = req.user;
      if (!loggedin)
      {
        return res.status(401).send({
          success: false,
          message: "user not loggedin",
      });
      }
      const user = await User.findById(loggedin._id);
      user.skills.push(skills);
      const modifiedUser = await user.save();
      res.status(201).send({
        success: true,
        message: "Skills Updated Successfully",
        modifiedUser,
      });
    } catch (error) {
        console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while updating skills",
        error,
      });
    }
    
}

const getPhotoController = async (req, res) => {
    try {
        // console.log(req.params.pid);
        const user = await User.findById(req.params.id).select("photo");
        if (user.photo.data) {
          res.set("Content-type", user.photo.contentType);
          return res.status(200).send(user.photo.data);
        }
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Erorr while getting photo",
          error,
        });
      }
}
const ProfilePhotoController = async (req, res) => {
  try {
    if (!req.user)
    {
      return res.status(401).send({
        success: false,
        message: "user not loggedin",
      })
    }
    // console.log(req.user);
    const user = await User.findById(req.user._id).select("photo");
    if (user.photo.data) {
      res.set("Content-type", user.photo.contentType);
      return res.status(200).send(user.photo.data);
    }
    else {
      return res.status(404).send({
        success: true,
        message:"photo not present"
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
}
const allUserController = async (req, res) => {
    try {
        const users = await User.find({}).select("-photo");
        res.status(200).send({
            success: true, 
            message: "all users fetched",
            total:users.length,
            users, 
            
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in getting users",
            error
        })
    }
}
const getAllCoursesController = async (req, res) => {
    try {
        const user  = await User.findById(req.params.id).populate("courses");
        if (!user)
        {
            return res.status(404).send({
                success: false,
                message: "user not found",
            });
        }
        const courses  = user.courses;
        res.status(200).send({
            success: true, 
            message: "all courses fetched",
            total:courses.length,
            courses, 
            
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in get courses",
            error
        })
    }
}
const ProfileCoursesController = async (req, res) => {
  try {
    if (!req.user)
    {
      res.status(401).send({
        success: false, 
        message: "user not loggedin",
         
        
    })
    }
    const user  = await User.findById(req.user._id).populate("courses");
    if (!user)
    {
        return res.status(404).send({
            success: false,
            message: "user not found",
        });
    }
    const courses  = user.courses;
    res.status(200).send({
        success: true, 
        message: "all courses fetched",
        total:courses.length,
        courses, 
        
    })
    
} catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: "error in get courses",
        error
    })
}
}
const getAllProjectsController = async (req, res)=>{
    try {
        const user  = await User.findById(req.params.id).populate("projects");
        if (!user)
        {
            return res.status(404).send({
                success: false,
                message: "user not found",
            });
        }
        const projects  = user.projects;
        res.status(200).send({
            success: true, 
            message: "all projects fetched",
            total:projects.length,
            projects, 
            
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in get projects",
            error
        })
    }
}
const ProfileProjectsController = async (req, res) => {
  try {
    if (!req.user)
    {
      res.status(401).send({
        success: false, 
        message: "user not loggedin",
         
        
    })
    }
    const user  = await User.findById(req.user._id).populate("projects");
    if (!user)
    {
        return res.status(404).send({
            success: false,
            message: "user not found",
        });
    }
    const projects  = user.projects;
    res.status(200).send({
        success: true, 
        message: "all projects fetched",
        total:projects.length,
        projects, 
        
    })
    
} catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: "error in get projects",
        error
    })
}
}
const searchUserController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await User
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search user API",
      error,
    });
  }
}
const addPhotoController = async (req, res) => {
  try {
    const { photo } = req.files;
    // console.log(photo);
    // Validation
    if (!photo || photo.size > 10000000) {
      return res
        .status(500)
        .send({ error: "Photo is required and should be less than 1MB" });
    }

    const loggedin = req.user;
    
    if (!loggedin)
    {
      return res.status(401).send({
        success: false,
        message: "not loggedin",
      });
  }

    const user = await User.findById(loggedin._id);
    
    // Check if the user already has a photo
    if (!user.photo) {
      // If there is no existing photo, add the new photo
      user.photo = {
        data: fs.readFileSync(photo.path),
        contentType: photo.type,
      };
    }
     else {
      // If there is an existing photo, update it
      user.photo.data = fs.readFileSync(photo.path);
      user.photo.contentType = photo.type;
    }

    await user.save();

    res.status(201).send({
      success: true,
      message: "Photo Updated Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating photo",
      error,
    });
  }
};
const deletePhotoController = async (req, res) => {
  try {
    const loggedin = req.user;
    
    if (!loggedin)
    {
      return res.status(401).send({
        success: false,
        message: "not loggedin",
      });
  }
    const user = await User.findById(req.user._id);
    // Check if the user has a photo
    if (!user.photo) {
      return res.status(404).send({ error: "User does not have a photo" });
    }
   
    // Remove the photo from the user
    user.photo = undefined;

    await user.save();
    
    res.status(200).send({
      success: true,
      message: "Photo Deleted Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting photo",
      error,
    });
  }
};

module.exports = {
    userProfileController,
    addSkillController,
    allUserController,
    addCourseController,
    getProfileController,
    getPhotoController,
    getAllCoursesController,
  getAllProjectsController,
  searchUserController,
  addPhotoController,
  deletePhotoController,
  ProfilePhotoController,
  ProfileCoursesController,
  ProfileProjectsController
};